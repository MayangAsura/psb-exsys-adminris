import { useEffect, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import supabase from "../../../services/database-server";
import TitleCard from "../../../components/Cards/TitleCard";
import CustomUploadAdapterPlugin from "./CustomUpload";

const QuestionForm = ({ admissionId, onSave }) => {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: "",
            question_type: "multiple_choice",
            score: 1,
            options: ["", "", "", ""],
            correct_answer: "",
            explanation: "",
            attachments: []
        }
    ]);
    const [uploading, setUploading] = useState(false);

    // Question types
    const questionTypes = [
        { value: "multiple_choice", label: "Multiple Choice" },
        { value: "true_false", label: "True/False" },
        { value: "short_answer", label: "Short Answer" },
        { value: "file_upload", label: "File Upload" }
    ];

    // Add new question
    const addQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            question: "",
            question_type: "multiple_choice",
            score: 1,
            options: ["", "", "", ""],
            correct_answer: "",
            // explanation: "",
            attachments: []
        };
        setQuestions([...questions, newQuestion]);
    };

    // Remove question
    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    // Update question field
    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        
        // Reset options when changing question type
        if (field === 'question_type') {
            if (value === 'MC') {
                newQuestions[index].options = ["", "", "", ""];
            } else if (value === 'true_false') {
                newQuestions[index].options = ["True", "False"];
            } else {
                newQuestions[index].options = [];
            }
        }
        
        setQuestions(newQuestions);
    };

    // Update option for multiple choice
    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    // Add option to multiple choice
    const addOption = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.push("");
        setQuestions(newQuestions);
    };

    // Remove option from multiple choice
    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex].options.length > 2) {
            newQuestions[questionIndex].options.splice(optionIndex, 1);
            setQuestions(newQuestions);
        }
    };

    // Upload image to Supabase
    const uploadImage = async (file, questionIndex) => {
        try {
            setUploading(true);
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${admissionId}/question_${questionIndex + 1}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('question-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('question-images')
                .getPublicUrl(filePath);

            // Add attachment to question
            const newQuestions = [...questions];
            newQuestions[questionIndex].attachments.push({
                url: publicUrl,
                filename: file.name,
                type: file.type
            });
            setQuestions(newQuestions);

            return { default: publicUrl };
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Handle file upload for file_upload type questions
    const handleFileUpload = async (file, questionIndex) => {
        try {
            setUploading(true);
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${admissionId}/submissions/question_${questionIndex + 1}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('exams/')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('question-files')
                .getPublicUrl(filePath);

            // Update correct answer with file URL for file_upload type
            const newQuestions = [...questions];
            newQuestions[questionIndex].correct_answer = publicUrl;
            setQuestions(newQuestions);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Validate form
    const validateForm = () => {
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            if (!q.question.trim()) {
                alert(`Soal ${i + 1} wajid diisi`);
                return false;
            }
            
            if (q.question_type === 'MC') {
                if (!q.options.some(opt => opt.trim()) || !q.correct_answer) {
                    alert(`Semua pilihan jawaban wajib diisi dan pilih satu jawaban benar untuk soal ${i + 1}`);
                    return false;
                }
            }
            
            if (q.question_type === 'BS' && !q.correct_answer) {
                alert(`pilih satu jawaban benar untuk soal ${i + 1}`);
                return false;
            }
            
            if (q.score <= 0) {
                alert(`Skor harus lebih dari 0 untuk soal${i + 1}`);
                return false;
            }
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (onSave) {
            onSave(questions);
        }
    };

    return (
      <TitleCard title="Tambah Soal Ujian" topMargin="mt-2">
        {/* <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg"> */}
            {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Questions Form</h2> */}
            
            <form onSubmit={handleSubmit}>
                {questions.map((question, questionIndex) => (
                    <div key={question.id} className="mb-8 p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                        {/* Question Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Soal {questionIndex + 1}
                            </h3>
                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(questionIndex)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>

                        {/* Question Type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipe Soal *
                            </label>
                            <select
                                value={question.question_type}
                                onChange={(e) => updateQuestion(questionIndex, 'question_type', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {questionTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Score */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skor *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={question.score}
                                onChange={(e) => updateQuestion(questionIndex, 'score', parseInt(e.target.value) || 1)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Question Text with CKEditor */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pertanyaan *
                            </label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={question.question}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    updateQuestion(questionIndex, 'question', data);
                                }}
                                config={{
                                    extraPlugins: [CustomUploadAdapterPlugin],
                                    toolbar: [
                                        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 
                                        'numberedList', 'blockQuote', 'imageUpload', 'insertTable',
                                        'mediaEmbed', 'undo', 'redo'
                                    ]
                                    // ckfinder: {
                                    //     uploadUrl: '/api/upload', 
                                    // }
                                }}
                                onReady={editor => {
                                    // You can store the editor instance and use it later.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                                // onChange={(event, editor) => {
                                //   const data = editor.getData();
                                //   console.log({ event, editor, data });
                                // }}
                            />
                        </div>

                        {/* Attachments */}
                        {question.attachments.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attachments
                                </label>
                                <div className="space-y-2">
                                    {question.attachments.map((attachment, attIndex) => (
                                        <div key={attIndex} className="flex items-center justify-between p-2 bg-white border rounded">
                                            <span className="text-sm text-gray-600">{attachment.filename}</span>
                                            <a 
                                                href={attachment.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                            >
                                                View
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Options for Multiple Choice */}
                        {question.question_type === 'multiple_choice' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Options *
                                </label>
                                <div className="space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`correct_answer_${questionIndex}`}
                                                value={option}
                                                checked={question.correct_answer === option}
                                                onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                                placeholder={`Option ${optionIndex + 1}`}
                                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {question.options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(questionIndex, optionIndex)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addOption(questionIndex)}
                                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    Add Option
                                </button>
                            </div>
                        )}

                        {/* Options for True/False */}
                        {question.question_type === 'true_false' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correct Answer *
                                </label>
                                <div className="space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`correct_answer_${questionIndex}`}
                                                value={option}
                                                checked={question.correct_answer === option}
                                                onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Correct Answer for Short Answer */}
                        {question.question_type === 'short_answer' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Answer *
                                </label>
                                <textarea
                                    value={question.correct_answer}
                                    onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                                    placeholder="Enter the expected answer"
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        {/* File Upload for File Upload Type */}
                        {question.question_type === 'file_upload' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected File (for reference)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            handleFileUpload(file, questionIndex);
                                        }
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={uploading}
                                />
                                {uploading && (
                                    <p className="text-sm text-gray-500 mt-1">Uploading file...</p>
                                )}
                                {question.correct_answer && (
                                    <p className="text-sm text-green-600 mt-1">
                                        File uploaded successfully
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Explanation */}
                        {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation (Optional)
                            </label>
                            <textarea
                                value={question.explanation}
                                onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                                placeholder="Explanation for the answer"
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div> */}
                    </div>
                ))}

                {/* Add Question Button */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + Add Another Question
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Save Questions
                    </button>
                </div>
            </form>
        {/* </div> */}
      </TitleCard>
    );
};

export default QuestionForm;
// import { useEffect, useState } from "react";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import supabase from "../../services/database-server";

// const QuestionForm = ({ admissionId, onSave }) => {
//     const [questions, setQuestions] = useState([
//         {
//             id: 1,
//             question: "",
//             question_type: "multiple_choice",
//             score: 1,
//             options: ["", "", "", ""],
//             correct_answer: "",
//             explanation: "",
//             attachments: []
//         }
//     ]);
//     const [uploading, setUploading] = useState(false);

//     // Question types
//     const questionTypes = [
//         { value: "multiple_choice", label: "Multiple Choice" },
//         { value: "true_false", label: "True/False" },
//         { value: "short_answer", label: "Short Answer" },
//         { value: "file_upload", label: "File Upload" }
//     ];

//     // Add new question
//     const addQuestion = () => {
//         const newQuestion = {
//             id: questions.length + 1,
//             question: "",
//             question_type: "multiple_choice",
//             score: 1,
//             options: ["", "", "", ""],
//             correct_answer: "",
//             explanation: "",
//             attachments: []
//         };
//         setQuestions([...questions, newQuestion]);
//     };

//     // Remove question
//     const removeQuestion = (index) => {
//         if (questions.length > 1) {
//             const newQuestions = questions.filter((_, i) => i !== index);
//             setQuestions(newQuestions);
//         }
//     };

//     // Update question field
//     const updateQuestion = (index, field, value) => {
//         const newQuestions = [...questions];
//         newQuestions[index][field] = value;
        
//         // Reset options when changing question type
//         if (field === 'question_type') {
//             if (value === 'multiple_choice') {
//                 newQuestions[index].options = ["", "", "", ""];
//             } else if (value === 'true_false') {
//                 newQuestions[index].options = ["True", "False"];
//             } else {
//                 newQuestions[index].options = [];
//             }
//         }
        
//         setQuestions(newQuestions);
//     };

//     // Update option for multiple choice
//     const updateOption = (questionIndex, optionIndex, value) => {
//         const newQuestions = [...questions];
//         newQuestions[questionIndex].options[optionIndex] = value;
//         setQuestions(newQuestions);
//     };

//     // Add option to multiple choice
//     const addOption = (questionIndex) => {
//         const newQuestions = [...questions];
//         newQuestions[questionIndex].options.push("");
//         setQuestions(newQuestions);
//     };

//     // Remove option from multiple choice
//     const removeOption = (questionIndex, optionIndex) => {
//         const newQuestions = [...questions];
//         if (newQuestions[questionIndex].options.length > 2) {
//             newQuestions[questionIndex].options.splice(optionIndex, 1);
//             setQuestions(newQuestions);
//         }
//     };

//     // Upload image to Supabase
//     const uploadImage = async (file, questionIndex) => {
//         try {
//             setUploading(true);
            
//             const fileExt = file.name.split('.').pop();
//             const fileName = `${admissionId}/question_${questionIndex + 1}_${Math.random().toString(36).substring(2)}.${fileExt}`;
//             const filePath = `${fileName}`;

//             const { error: uploadError } = await supabase.storage
//                 .from('question-images')
//                 .upload(filePath, file);

//             if (uploadError) {
//                 throw uploadError;
//             }

//             const { data: { publicUrl } } = supabase.storage
//                 .from('question-images')
//                 .getPublicUrl(filePath);

//             // Add attachment to question
//             const newQuestions = [...questions];
//             newQuestions[questionIndex].attachments.push({
//                 url: publicUrl,
//                 filename: file.name,
//                 type: file.type
//             });
//             setQuestions(newQuestions);

//             return { default: publicUrl };
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             return null;
//         } finally {
//             setUploading(false);
//         }
//     };

//     // Handle file upload for file_upload type questions
//     const handleFileUpload = async (file, questionIndex) => {
//         try {
//             setUploading(true);
            
//             const fileExt = file.name.split('.').pop();
//             const fileName = `${admissionId}/submissions/question_${questionIndex + 1}_${Math.random().toString(36).substring(2)}.${fileExt}`;
//             const filePath = `${fileName}`;

//             const { error: uploadError } = await supabase.storage
//                 .from('question-files')
//                 .upload(filePath, file);

//             if (uploadError) {
//                 throw uploadError;
//             }

//             const { data: { publicUrl } } = supabase.storage
//                 .from('question-files')
//                 .getPublicUrl(filePath);

//             // Update correct answer with file URL for file_upload type
//             const newQuestions = [...questions];
//             newQuestions[questionIndex].correct_answer = publicUrl;
//             setQuestions(newQuestions);

//             return publicUrl;
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             return null;
//         } finally {
//             setUploading(false);
//         }
//     };

//     // Validate form
//     const validateForm = () => {
//         for (let i = 0; i < questions.length; i++) {
//             const q = questions[i];
            
//             if (!q.question.trim()) {
//                 alert(`Question ${i + 1} is required`);
//                 return false;
//             }
            
//             if (q.question_type === 'multiple_choice') {
//                 if (!q.options.some(opt => opt.trim()) || !q.correct_answer) {
//                     alert(`Please fill all options and select correct answer for question ${i + 1}`);
//                     return false;
//                 }
//             }
            
//             if (q.question_type === 'true_false' && !q.correct_answer) {
//                 alert(`Please select correct answer for question ${i + 1}`);
//                 return false;
//             }
            
//             if (q.score <= 0) {
//                 alert(`Score must be greater than 0 for question ${i + 1}`);
//                 return false;
//             }
//         }
//         return true;
//     };

//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         if (!validateForm()) {
//             return;
//         }

//         if (onSave) {
//             onSave(questions);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">Questions Form</h2>
            
//             <form onSubmit={handleSubmit}>
//                 {questions.map((question, questionIndex) => (
//                     <div key={question.id} className="mb-8 p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
//                         {/* Question Header */}
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold text-gray-700">
//                                 Question {questionIndex + 1}
//                             </h3>
//                             {questions.length > 1 && (
//                                 <button
//                                     type="button"
//                                     onClick={() => removeQuestion(questionIndex)}
//                                     className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                                 >
//                                     Remove
//                                 </button>
//                             )}
//                         </div>

//                         {/* Question Type */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Question Type *
//                             </label>
//                             <select
//                                 value={question.question_type}
//                                 onChange={(e) => updateQuestion(questionIndex, 'question_type', e.target.value)}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 {questionTypes.map(type => (
//                                     <option key={type.value} value={type.value}>
//                                         {type.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Score */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Score *
//                             </label>
//                             <input
//                                 type="number"
//                                 min="1"
//                                 value={question.score}
//                                 onChange={(e) => updateQuestion(questionIndex, 'score', parseInt(e.target.value) || 1)}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 required
//                             />
//                         </div>

//                         {/* Question Text with CKEditor */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Question Text *
//                             </label>
//                             <CKEditor
//                                 editor={ClassicEditor}
//                                 data={question.question}
//                                 onChange={(event, editor) => {
//                                     const data = editor.getData();
//                                     updateQuestion(questionIndex, 'question', data);
//                                 }}
//                                 config={{
//                                     toolbar: [
//                                         'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 
//                                         'numberedList', 'blockQuote', 'imageUpload', 'insertTable',
//                                         'mediaEmbed', 'undo', 'redo'
//                                     ],
//                                     ckfinder: {
//                                         uploadUrl: '/api/upload', // You might need to set up an upload endpoint
//                                     }
//                                 }}
//                                 onReady={editor => {
//                                     // You can store the editor instance and use it later.
//                                     console.log('Editor is ready to use!', editor);
//                                 }}
//                                 onBlur={(event, editor) => {
//                                     console.log('Blur.', editor);
//                                 }}
//                                 onFocus={(event, editor) => {
//                                     console.log('Focus.', editor);
//                                 }}
//                             />
//                         </div>

//                         {/* Attachments */}
//                         {question.attachments.length > 0 && (
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Attachments
//                                 </label>
//                                 <div className="space-y-2">
//                                     {question.attachments.map((attachment, attIndex) => (
//                                         <div key={attIndex} className="flex items-center justify-between p-2 bg-white border rounded">
//                                             <span className="text-sm text-gray-600">{attachment.filename}</span>
//                                             <a 
//                                                 href={attachment.url} 
//                                                 target="_blank" 
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue-500 hover:text-blue-700 text-sm"
//                                             >
//                                                 View
//                                             </a>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Options for Multiple Choice */}
//                         {question.question_type === 'multiple_choice' && (
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Options *
//                                 </label>
//                                 <div className="space-y-2">
//                                     {question.options.map((option, optionIndex) => (
//                                         <div key={optionIndex} className="flex items-center gap-2">
//                                             <input
//                                                 type="radio"
//                                                 name={`correct_answer_${questionIndex}`}
//                                                 value={option}
//                                                 checked={question.correct_answer === option}
//                                                 onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
//                                                 className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
//                                             />
//                                             <input
//                                                 type="text"
//                                                 value={option}
//                                                 onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
//                                                 placeholder={`Option ${optionIndex + 1}`}
//                                                 className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             />
//                                             {question.options.length > 2 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeOption(questionIndex, optionIndex)}
//                                                     className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                                                 >
//                                                     Remove
//                                                 </button>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <button
//                                     type="button"
//                                     onClick={() => addOption(questionIndex)}
//                                     className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
//                                 >
//                                     Add Option
//                                 </button>
//                             </div>
//                         )}

//                         {/* Options for True/False */}
//                         {question.question_type === 'true_false' && (
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Correct Answer *
//                                 </label>
//                                 <div className="space-y-2">
//                                     {question.options.map((option, optionIndex) => (
//                                         <div key={optionIndex} className="flex items-center gap-2">
//                                             <input
//                                                 type="radio"
//                                                 name={`correct_answer_${questionIndex}`}
//                                                 value={option}
//                                                 checked={question.correct_answer === option}
//                                                 onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
//                                                 className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
//                                             />
//                                             <span className="text-gray-700">{option}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Correct Answer for Short Answer */}
//                         {question.question_type === 'short_answer' && (
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Expected Answer *
//                                 </label>
//                                 <textarea
//                                     value={question.correct_answer}
//                                     onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
//                                     placeholder="Enter the expected answer"
//                                     rows="3"
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                         )}

//                         {/* File Upload for File Upload Type */}
//                         {question.question_type === 'file_upload' && (
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Expected File (for reference)
//                                 </label>
//                                 <input
//                                     type="file"
//                                     onChange={(e) => {
//                                         const file = e.target.files[0];
//                                         if (file) {
//                                             handleFileUpload(file, questionIndex);
//                                         }
//                                     }}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     disabled={uploading}
//                                 />
//                                 {uploading && (
//                                     <p className="text-sm text-gray-500 mt-1">Uploading file...</p>
//                                 )}
//                                 {question.correct_answer && (
//                                     <p className="text-sm text-green-600 mt-1">
//                                         File uploaded successfully
//                                     </p>
//                                 )}
//                             </div>
//                         )}

//                         {/* Explanation */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Explanation (Optional)
//                             </label>
//                             <textarea
//                                 value={question.explanation}
//                                 onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
//                                 placeholder="Explanation for the answer"
//                                 rows="3"
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                     </div>
//                 ))}

//                 {/* Add Question Button */}
//                 <div className="mb-6">
//                     <button
//                         type="button"
//                         onClick={addQuestion}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                     >
//                         + Add Another Question
//                     </button>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-4">
//                     <button
//                         type="button"
//                         className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                     >
//                         Save Questions
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default QuestionForm;
// // import { useState } from 'react';
// // import { useForm, useFieldArray } from 'react-hook-form';
// // import { useMutation } from '@tanstack/react-query';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { questionSchema } from './schemas/question_schemas';
// // import TextEditor from './components/TextEditor';
// // import { FaPlus, FaTrash, FaSave, FaUpload, FaImage } from 'react-icons/fa';
// // import supabase from '../../../services/database-server';
// // import { addQuestion } from '../../../services/api/questions';

// // function QuestionAdd() {
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadingIndex, setUploadingIndex] = useState(null);
// //   const [questionType, setQuestionType] = useState('');
  
// //   const {
// //     register,
// //     control,
// //     handleSubmit,
// //     setValue,
// //     watch,
// //     formState: { errors },
// //   } = useForm({
// //     resolver: zodResolver(questionSchema),
// //     defaultValues: {
// //       question_type: '',
// //       question: '',
// //       questionImage: '',
// //       answers: [
// //         {
// //           order: 1,
// //           option: '',
// //           score: 0,
// //           image: '',
// //           isCorrect: true // First answer is correct by default
// //         }
// //       ],
// //       correctAnswer: 0,
// //       explanation: ''
// //     }
// //   });

// //   const { fields, append, remove } = useFieldArray({
// //     control,
// //     name: "answers"
// //   });

// //   const addAnswerOption = () => {
// //     append({
// //       order: fields.length + 1,
// //       option: '',
// //       score: 0,
// //       image: '',
// //       isCorrect: false
// //     });
// //   };

// //   const removeAnswerOption = (index) => {
// //     if (fields.length > 1) {
// //       remove(index);
// //     }
// //   };

// //   const handleImageUpload = async (file, type, index = null) => {
// //     if (!file) return null;
    
// //     setUploading(true);
// //     if (index !== null) setUploadingIndex(index);

// //     try {
// //       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// //       if (!validTypes.includes(file.type)) {
// //         throw new Error('Format file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.');
// //       }

// //       if (file.size > 5 * 1024 * 1024) {
// //         throw new Error('Ukuran file terlalu besar. Maksimal 5MB.');
// //       }

// //       const fileExt = file.name.split('.').pop();
// //       const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
// //       const filePath = `questions/${fileName}`;

// //       const { error: uploadError } = await supabase.storage
// //         .from('exams')
// //         .upload(filePath, file);

// //       if (uploadError) throw uploadError;

// //       const { data: { publicUrl } } = supabase.storage
// //         .from('exams')
// //         .getPublicUrl(filePath);

// //       if (type === 'question') {
// //         setValue('questionImage', publicUrl);
// //       } else if (index !== null) {
// //         setValue(`answers.${index}.image`, publicUrl);
// //       }

// //       return publicUrl;
// //     } catch (error) {
// //       console.error('Error uploading image:', error);
// //       throw error;
// //     } finally {
// //       setUploading(false);
// //       setUploadingIndex(null);
// //     }
// //   };

// //   const handleQuestionImageUpload = async (event) => {
// //     const file = event.target.files[0];
// //     if (!file) return;

// //     try {
// //       await handleImageUpload(file, 'question');
// //     } catch (error) {
// //       alert(`Gagal mengupload gambar: ${error.message}`);
// //     }
// //   };

// //   const handleAnswerImageUpload = async (event, index) => {
// //     const file = event.target.files[0];
// //     if (!file) return;

// //     try {
// //       await handleImageUpload(file, 'answer', index);
// //     } catch (error) {
// //       alert(`Gagal mengupload gambar: ${error.message}`);
// //     }
// //   };

// //   const removeImage = (type, index = null) => {
// //     if (type === 'question') {
// //       setValue('questionImage', '');
// //     } else if (index !== null) {
// //       setValue(`answers.${index}.image`, '');
// //     }
// //   };

// //   const { mutate: onSave, isPending } = useMutation({
// //     mutationFn: async (formData) => {
// //       const questionData = {
// //         question: formData.question,
// //         question_type: formData.question_type,
// //         question_image: formData.questionImage || null,
// //         answers: formData.answers.map((answer, index) => ({
// //           order: answer.order,
// //           option: answer.option,
// //           score: answer.score,
// //           image: answer.image || null,
// //           isCorrect: index === formData.correctAnswer
// //         })),
// //         explanation: formData.explanation || null
// //       };
      
// //       return await addQuestion(questionData);
// //     },
// //     onSuccess: (data) => {
// //       console.log('Question saved successfully:', data);
// //       alert('Pertanyaan berhasil disimpan!');
// //     },
// //     onError: (error) => {
// //       console.error('Error saving question:', error);
// //       alert(`Gagal menyimpan pertanyaan: ${error.message}`);
// //     },
// //   });

// //   const onSubmit = (data) => {
// //     console.log('Form data:', data);
// //     onSave(data);
// //   };

// //   const questionImage = watch('questionImage');
// //   const answers = watch('answers');

// //   return (
// //     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
// //       <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Pertanyaan Baru</h1>

// //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //         {/* Question Type Selection */}
// //         <div>
// //           <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-2">
// //             Tipe Soal *
// //           </label>
// //           <select 
// //             id="question_type" 
// //             {...register('question_type')}
// //             value={questionType} 
// //             onChange={(e) => setQuestionType(e.target.value)}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             required
// //           >
// //             <option value="">-Pilih Tipe-</option>
// //             <option value="text">Teks</option>
// //             <option value="image">Gambar</option>
// //             <option value="text_image">Teks dan Gambar</option>
// //             <option value="mc">Pilihan Ganda</option>
// //           </select>
// //           {errors.question_type && (
// //             <p className="mt-1 text-sm text-red-600">{errors.question_type.message}</p>
// //           )}
// //         </div>

// //         {/* Question Content */}
// //         {(questionType === 'text' || questionType === 'text_image' || questionType === 'mc') && (
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Pertanyaan *
// //             </label>
// //             <TextEditor
// //               value={watch('question') || ''}
// //               onChange={(content) => setValue('question', content)}
// //               placeholder="Ketik pertanyaan di sini..."
// //               height={200}
// //             />
// //             {errors.question && (
// //               <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
// //             )}
// //           </div>
// //         )}

// //         {/* Question Image Upload */}
// //         {(questionType === 'image' || questionType === 'text_image') && (
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Gambar Pertanyaan {questionType === 'image' ? '*' : '(Opsional)'}
// //             </label>
// //             <div className="space-y-4">
// //               {questionImage ? (
// //                 <div className="relative inline-block">
// //                   <img 
// //                     src={questionImage} 
// //                     alt="Question" 
// //                     className="max-w-full h-64 object-contain border rounded-lg"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => removeImage('question')}
// //                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
// //                   >
// //                     <FaTrash className="w-3 h-3" />
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
// //                   <FaImage className="mx-auto text-gray-400 text-3xl mb-2" />
// //                   <p className="text-gray-500 mb-3">Upload gambar pertanyaan</p>
// //                   <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
// //                     <FaUpload className="inline mr-2" />
// //                     Pilih Gambar
// //                     <input
// //                       type="file"
// //                       accept="image/*"
// //                       onChange={handleQuestionImageUpload}
// //                       className="hidden"
// //                       disabled={uploading}
// //                     />
// //                   </label>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* Multiple Choice Options */}
// //         {questionType === 'mc' && (
// //           <>
// //             <div className="flex justify-between items-center">
// //               <h2 className="text-lg font-medium text-gray-800">Pilihan Jawaban *</h2>
// //               <button
// //                 type="button"
// //                 onClick={addAnswerOption}
// //                 className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
// //               >
// //                 <FaPlus className="mr-2" /> Tambah Opsi
// //               </button>
// //             </div>
            
// //             <div className="space-y-4">
// //               {fields.map((field, index) => (
// //                 <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-1">
// //                         Teks Jawaban {index + 1} *
// //                       </label>
// //                       <input 
// //                         {...register(`answers.${index}.option`)}
// //                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                         placeholder={`Masukkan jawaban ${index + 1}`}
// //                       />
// //                       {errors.answers?.[index]?.option && (
// //                         <p className="mt-1 text-sm text-red-600">
// //                           {errors.answers[index].option.message}
// //                         </p>
// //                       )}
// //                     </div>

// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-1">
// //                         Poin
// //                       </label>
// //                       <input
// //                         type="number"
// //                         {...register(`answers.${index}.score`, { valueAsNumber: true })}
// //                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         min="0"
// //                         step="0.5"
// //                         placeholder="0"
// //                       />
// //                       {errors.answers?.[index]?.score && (
// //                         <p className="mt-1 text-sm text-red-600">
// //                           {errors.answers[index].score.message}
// //                         </p>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Remove Button */}
// //                   <div className="flex justify-between items-center mt-3">
// //                     <label className="flex items-center">
// //                       <input
// //                         type="radio"
// //                         {...register('correctAnswer')}
// //                         value={index}
// //                         className="h-4 w-4 text-blue-600 focus:ring-blue-500"
// //                       />
// //                       <span className="ml-2 text-sm font-medium text-gray-700">
// //                         Jawaban Benar
// //                       </span>
// //                     </label>
                    
// //                     {fields.length > 1 && (
// //                       <button
// //                         type="button"
// //                         onClick={() => removeAnswerOption(index)}
// //                         className="text-red-500 hover:text-red-700"
// //                       >
// //                         <FaTrash className="w-4 h-4" />
// //                       </button>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {errors.answers && (
// //               <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
// //             )}
// //             {errors.correctAnswer && (
// //               <p className="mt-1 text-sm text-red-600">{errors.correctAnswer.message}</p>
// //             )}
// //           </>
// //         )}

// //         {/* Submit Button */}
// //         <div className="flex justify-end pt-4 border-t">
// //           <button
// //             type="submit"
// //             disabled={uploading || isPending}
// //             className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             <FaSave className="mr-2" />
// //             {uploading || isPending ? 'Menyimpan...' : 'Simpan Pertanyaan'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// // export default QuestionAdd;
// // // import { useState } from 'react';
// // // import { useForm, useFieldArray } from 'react-hook-form';
// // // // import { useMutation } from '@tanstack/react-query'; // Added missing import
// // // import { useMutation } from '@tanstack/react-query';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { questionSchema } from './schemas/question_schemas';
// // // import TextEditor from './components/TextEditor';
// // // import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
// // // import supabase from '../../../services/database-server';
// // // import { addQuestion } from '../../../services/api/questions';

// // // function QuestionAdd() {
// // //   const [uploading, setUploading] = useState(false);
// // //   const [questionType, setQuestionType] = useState('');
  
// // //   const {
// // //     register,
// // //     control,
// // //     handleSubmit,
// // //     setValue,
// // //     watch,
// // //     formState: { errors },
// // //   } = useForm({
// // //     resolver: zodResolver(questionSchema),
// // //     defaultValues: {
// // //       question_type: '',
// // //       question: '',
// // //       answers: [
// // //         {
// // //           order: '',
// // //           option: '',
// // //           point: 0,
// // //         }
// // //       ],
// // //     }
// // //   });

// // //   const { fields, append, remove } = useFieldArray({
// // //     control,
// // //     name: "answers"
// // //   });

// // //   const addAnswerOption = () => {
// // //     append({
// // //       order: '',
// // //       option: '',
// // //       score: 0
// // //     });
// // //   };

// // //   const removeAnswerOption = (index) => {
// // //     if (fields.length > 1) {
// // //       remove(index);
// // //     }
// // //   };

// // //   const handleImageUpload = async (file, type, index = null) => {
// // //     if (!file) return;
    
// // //     setUploading(true);
// // //     const fileExt = file.name.split('.').pop();
// // //     const fileName = `${Math.random()}.${fileExt}`;
// // //     const filePath = `${fileName}`;

// // //     try {
// // //       const { error: uploadError } = await supabase.storage
// // //         .from('exams/uploads/questions')
// // //         .upload(filePath, file);

// // //       if (uploadError) throw uploadError;

// // //       const { data: { publicUrl } } = supabase.storage
// // //         .from('exams/uploads/questions')
// // //         .getPublicUrl(filePath);

// // //       if (type === 'question') {
// // //         setValue('questionImage', publicUrl);
// // //       } else {
// // //         setValue(`answers.${index}.image`, publicUrl);
// // //       }

// // //       return publicUrl;
// // //     } catch (error) {
// // //       console.error('Error uploading image:', error);
// // //       throw error;
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   // Fixed mutation function
// // //   const { mutate: onSave, isPending } = useMutation({
// // //     mutationFn: async (data) => {
// // //       // Transform the data to match your API expectations
// // //       const questionData = {
// // //         question: data.question,
// // //         question_type: data.question_type,
// // //         answers: data.answers.map((answer, index) => ({
// // //           order: answer.order || index + 1,
// // //           option: answer.option,
// // //           score: answer.score || answer.point || 0,
// // //           isCorrect: answer.isCorrect || false
// // //         }))
// // //       };
      
// // //       return await addQuestion(questionData);
// // //     },
// // //     onSuccess: (data) => {
// // //       console.log('Question saved successfully:', data);
// // //       // Add success notification or redirect here
// // //     },
// // //     onError: (error) => {
// // //       console.error('Error saving question:', error);
// // //       // Add error notification here
// // //     },
// // //   });

// // //   const onSubmit = (data) => {
// // //     onSave(data);
// // //   };

// // //   return (
// // //     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
// // //       <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Pertanyaan Baru</h1>

// // //       <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
// // //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// // //           {/* Question Type Selection */}
// // //           <div>
// // //             <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-2">
// // //               Tipe Soal
// // //             </label>
// // //             <select 
// // //               id="question_type" 
// // //               {...register('question_type')}
// // //               value={questionType} 
// // //               onChange={(e) => setQuestionType(e.target.value)}
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
// // //               required
// // //             >
// // //               <option value="">-Pilih Tipe-</option>
// // //               <option value="text">Teks</option>
// // //               <option value="upload">Upload Gambar</option>
// // //               <option value="mc">Pilihan Ganda</option>
// // //             </select>
// // //           </div>

// // //           {/* Question Text/Content */}
// // //           {questionType && (
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Pertanyaan *
// // //               </label>
// // //               <TextEditor
// // //                 value={watch('question') || ''}
// // //                 onChange={(content) => setValue('question', content)}
// // //                 placeholder=""
// // //                 height={200}
// // //               />
// // //               {errors.question && (
// // //                 <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* Multiple Choice Options */}
// // //           {questionType === 'mc' && (
// // //             <>
// // //               <div className="flex justify-between items-center">
// // //                 <h2 className="text-lg font-medium text-gray-800">Pilihan Jawaban</h2>
// // //                 <button
// // //                   type="button"
// // //                   onClick={addAnswerOption}
// // //                   className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
// // //                 >
// // //                   <FaPlus className="mr-2" /> Tambah Opsi
// // //                 </button>
// // //               </div>
              
// // //               <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
// // //                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
// // //                   <tr>
// // //                     <th scope="col" className="px-6 py-3">No.</th>
// // //                     <th scope="col" className="px-6 py-3">Pertanyaan</th>
// // //                     <th scope="col" className="px-6 py-3">Pilihan</th>
// // //                     <th scope="col" className="px-6 py-3">Poin</th>
// // //                     <th scope="col" className="px-6 py-3">Aksi</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {fields.map((field, index) => (
// // //                     <tr key={field.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
// // //                       <td className="px-6 py-4">
// // //                         <input 
// // //                           {...register(`answers.${index}.order`)}
// // //                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                           type="text" 
// // //                           placeholder="1"
// // //                           required
// // //                         />
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <TextEditor
// // //                           value={watch(`answers.${index}.questionText`) || ''}
// // //                           onChange={(content) => setValue(`answers.${index}.questionText`, content)}
// // //                           placeholder=""
// // //                           height={100}
// // //                           compact={true}
// // //                         />
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <div className="space-y-2">
// // //                           <input 
// // //                             {...register(`answers.${index}.option_order`)}
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                             type="text" 
// // //                             placeholder="A."
// // //                             required
// // //                           />
// // //                           <input 
// // //                             {...register(`answers.${index}.option`)}
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                             type="text" 
// // //                             placeholder="Teks jawaban"
// // //                             required
// // //                           />
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <input
// // //                           type="number"
// // //                           {...register(`answers.${index}.score`, { valueAsNumber: true })}
// // //                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
// // //                           min="0"
// // //                           step="0.5"
// // //                         />
// // //                         {errors.answers?.[index]?.score && (
// // //                           <p className="mt-1 text-sm text-red-600">
// // //                             {errors.answers[index].score.message}
// // //                           </p>
// // //                         )}
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => removeAnswerOption(index)}
// // //                           className="text-red-500 hover:text-red-700 transition-colors duration-200"
// // //                           disabled={fields.length <= 1}
// // //                         >
// // //                           <FaTrash />
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>

// // //               {/* Correct Answer Selection */}
// // //               <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Pilih Jawaban yang Benar:
// // //                 </label>
// // //                 <div className="flex flex-wrap gap-4">
// // //                   {fields.map((field, index) => (
// // //                     <div key={field.id} className="flex items-center">
// // //                       <input
// // //                         type="radio"
// // //                         {...register('correctAnswer')}
// // //                         value={index}
// // //                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
// // //                       />
// // //                       <label className="ml-2 block text-sm font-medium text-gray-700">
// // //                         Jawaban {index + 1}
// // //                       </label>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Explanation */}
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Penjelasan (Opsional)
// // //             </label>
// // //             <TextEditor
// // //               value={watch('explanation') || ''}
// // //               onChange={(content) => setValue('explanation', content)}
// // //               placeholder="Tambahkan penjelasan jawaban di sini..."
// // //               height={150}
// // //             />
// // //           </div>

// // //           {/* Submit Button */}
// // //           <div className="flex justify-end pt-4">
// // //             <button
// // //               type="submit"
// // //               disabled={uploading || isPending}
// // //               className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// // //             >
// // //               <FaSave className="mr-2" />
// // //               {uploading || isPending ? 'Menyimpan...' : 'Simpan Pertanyaan'}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default QuestionAdd;
// // // import { useState } from 'react';
// // // import { useForm, useFieldArray } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { questionSchema } from './schemas/question_schemas';
// // // import TextEditor from './components/TextEditor';
// // // import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
// // // // import TextEditor from './components/TextEditor';

// // // import supabase from '../../../services/database-server';
// // // import { addQuestion } from '@/services/api/questions';

// // // function QuestionAdd() {
// // //   const [uploading, setUploading] = useState(false);
// // //   const [questionType, setQuestionType] = useState('');
  
// // //   const {
// // //     register,
// // //     control,
// // //     handleSubmit,
// // //     setValue,
// // //     watch,
// // //     formState: { errors },
// // //   } = useForm({
// // //     resolver: zodResolver(questionSchema),
// // //     defaultValues: {
// // //       question_type: '',
// // //       question: '',
// // //       // questionImage: '',
// // //       answers: [
// // //         {
// // //           order: '',
// // //           option: '',
// // //           point: 0,
// // //           // isCorrect: false,
// // //           // image: ''
// // //         }
// // //       ],
// // //       // explanation: ''
// // //     }
// // //   });

// // //   const { fields, append, remove } = useFieldArray({
// // //     control,
// // //     name: "answers"
// // //   });

// // //   const addAnswerOption = () => {
// // //     append({
// // //       order: '',
// // //       option: '',
// // //       score: 0
// // //       // // isCorrect: false,
// // //       // image: ''
// // //     });
// // //   };

// // //   const removeAnswerOption = (index) => {
// // //     if (fields.length > 1) {
// // //       remove(index);
// // //     }
// // //   };

// // //   const handleImageUpload = async (file, type, index = null) => {
// // //     if (!file) return;
    
// // //     setUploading(true);
// // //     const fileExt = file.name.split('.').pop();
// // //     const fileName = `${Math.random()}.${fileExt}`;
// // //     const filePath = `${fileName}`;

// // //     try {
// // //       const { error: uploadError } = await supabase.storage
// // //         .from('exams/uploads/questions')
// // //         .upload(filePath, file);

// // //       if (uploadError) throw uploadError;

// // //       const { data: { publicUrl } } = supabase.storage
// // //         .from('exams/uploads/questions')
// // //         .getPublicUrl(filePath);

// // //       if (type === 'question') {
// // //         setValue('questionImage', publicUrl);
// // //       } else {
// // //         setValue(`answers.${index}.image`, publicUrl);
// // //       }

// // //       return publicUrl;
// // //     } catch (error) {
// // //       console.error('Error uploading image:', error);
// // //       throw error;
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   const { mutate: onSave, isPending } = useMutation({
// // //       mutationFn: async (data) => {
// // //         // questions.forEach(key in question){

// // //         // }
// // //         for (let index = 0; index < questions.length; index++) {
// // //           const question = questions[index].question;
// // //           const options = 
          
// // //           const response = await addQuestion({question, options})
// // //         }
// // //         // setRequestData(prev => ({...prev, phone_number: data.phone_number, full_name: data.full_name}))
// // //         // console.log('data>', data, requestData.phone_number, requestData)

// // //         // const { data: data_appl, error } = await supabase.rpc("edit_applicant", {
// // //         //       _full_name : data.full_name,
// // //         //       _gender : data.gender,
// // //         //       _phone_number : data.phone_number,
// // //         //       _email : data.email,
// // //         //       _password : data.password,
// // //         //       _media : data.media,
// // //         //       _school_id : parseInt(data.school_id),
// // //         //       _subschool : data.subschool,
// // //         //       _dob : data.dob
// // //         //     });
// // //         //   return data_appl
// // //         // return register(
// // //         //       data.email,
// // //         //       data.full_name,
// // //         //       data.gender,
// // //         //       data.media,
// // //         //       data.password,
// // //         //       data.phone_number,
// // //         //       data.school_id,
// // //         //       data.subschool
// // //         //     );
// // //       },
// // //       onSuccess: (data) => {
// // //         if(data){
// // //           setResults(data)

// // //           if(data.f1 !== '01'){
// // //             sendNotif(data)
// // //           }
// // //         }
// // //         // sonner.success("Register berhasil!");

// // //         // Redirect to dashboard
// // //         // if()
// // //         // navigate("/login");
// // //       },
// // //       onError: (error) => {
// // //         setError(error)
// // //         console.log('pendaftaran error ', error)
// // //         // sonner.error((error).message || "Register gagal. Silakan coba lagi.");
// // //       },
// // //     });

// // //   const onSubmit = (data) => {
// // //     // console.log('Form data:', data);
// // //     // Submit to your API here
// // //     onSave(data)

    
// // //   };



// // //   return (
// // //     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
// // //       <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Pertanyaan Baru</h1>


// // //         <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
// // //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// // //             <div>
// // //           <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-2">
// // //             Tipe Soal
// // //           </label>
// // //             <select 
// // //               id="question_type" 
// // //               value={questionType} 
// // //               onChange={(e) => setQuestionType(e.target.value)}
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
// // //               required
// // //             >
// // //               <option value="">-Pilih Tipe-</option>
// // //               <option value="text">Teks</option>
// // //               <option value="upload">Upload Gambar</option>
// // //               <option value="mc">Pilihan Ganda</option>
// // //             </select>
// // //           </div>

// // //           {questionType && (
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Pertanyaan *
// // //             </label>
// // //             <TextEditor
// // //               value={watch('questionText') || ''}
// // //               onChange={(content) => setValue('questionText', content)}
// // //               placeholder=""
// // //               height={200}
// // //             />
// // //             {errors.questionText && (
// // //               <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
// // //             )}
// // //           </div>
// // //         )}

// // //           {questionType === 'mc' && (
// // //             <>
// // //               <div className="flex justify-between items-center">
// // //                   <h2 className="text-lg font-medium text-gray-800">Pilihan Jawaban</h2>
// // //                   <button
// // //                     type="button"
// // //                     onClick={addAnswerOption}
// // //                     className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
// // //                   >
// // //                     <FaPlus className="mr-2" /> Tambah Opsi
// // //                   </button>
// // //                 </div>
// // //                 <table class="w-full text-sm text-left md:grid-cols-2 sm:grid-cols-1 rtl:text-right text-gray-500 dark:text-gray-400">
// // //                 <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
// // //                     <tr>
// // //                         <th scope="col" class="px-6 py-3">
// // //                             No.
// // //                         </th>
// // //                         <th scope="col" class="px-6 py-3">
// // //                             <div class="flex items-center">
// // //                                 Pertanyaan
// // //                                 <a href="#"><svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
// // //             <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
// // //           </svg></a>
// // //                             </div>
// // //                         </th>
// // //                         <th scope="col" class="px-6 py-3">
// // //                             <div class="flex items-center">
// // //                                 Pilihan
// // //                                 <a href="#"><svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
// // //             <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
// // //           </svg></a>
// // //                             </div>
// // //                         </th>
// // //                         <th scope="col" class="px-6 py-3">
// // //                             <div class="flex items-center">
// // //                                 Poin
// // //                                 <a href="#"><svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
// // //             <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
// // //           </svg></a>
// // //                             </div>
// // //                         </th>
// // //                         {/* <th scope="col" class="px-6 py-3">
// // //                             <span class="sr-only">Edit</span>
// // //                         </th> */}
// // //                     </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                     <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
// // //                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[0].order}
// // //                               onChange={(e) => handleInputChange('order[0]', e.target.value)}
// // //                               required
// // //                             />
// // //                         </th>
// // //                         <td class="px-6 py-4">
// // //                             <TextEditor
// // //                               value={watch('question') || ''}
// // //                               onChange={(content) => setValue('question[0]', content[0])}
// // //                               placeholder=""
// // //                               height={200}
// // //                             />
// // //                             {errors.question && (
// // //                               <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
// // //                             )}
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                           <div className="grid-col-2">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[0].option_order}
// // //                               placeholder='A.'
// // //                               onChange={(e) => handleInputChange('option_order[0]', e.target.value)}
// // //                               required
// // //                             />
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[0].option}
// // //                               placeholder=''
// // //                               onChange={(e) => handleInputChange('option[0]', e.target.value)}
// // //                               required
// // //                             />

// // //                           </div>
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[0].poin}
// // //                               placeholder='A.'
// // //                               onChange={(e) => handleInputChange('poin[0]', e.target.value)}
// // //                               required
// // //                             />
                            
// // //                         </td>
// // //                         {/* <td class="px-6 py-4 text-right">
// // //                             <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
// // //                         </td> */}
// // //                     </tr>
// // //                     <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
// // //                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[1].order}
// // //                               onChange={(e) => handleInputChange('order[1]', e.target.value)}
// // //                               required
// // //                             />

// // //                         </th>
// // //                         <td class="px-6 py-4">
// // //                             <TextEditor
// // //                               value={watch('question') || ''}
// // //                               onChange={(content) => setValue('question[1]', content[1])}
// // //                               placeholder=""
// // //                               height={200}
// // //                             />
// // //                             {errors.question && (
// // //                               <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
// // //                             )}
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                           <div className="grid-col-2">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[1].option_order}
// // //                               placeholder='A.'
// // //                               onChange={(e) => handleInputChange('option_order[1]', e.target.value)}
// // //                               required
// // //                             />
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[1].option}
// // //                               placeholder=''
// // //                               onChange={(e) => handleInputChange('option[1]', e.target.value)}
// // //                               required
// // //                             />

// // //                           </div>
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[1].poin}
// // //                               placeholder='A.'
// // //                               onChange={(e) => handleInputChange('poin[1]', e.target.value)}
// // //                               required
// // //                             />
                            
// // //                         </td>
// // //                         {/* <td class="px-6 py-4 text-right">
// // //                             <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
// // //                         </td> */}
// // //                     </tr>
// // //                     <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
// // //                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[2].order}
// // //                               onChange={(e) => handleInputChange('order[2]', e.target.value)}
// // //                               required
// // //                             />
// // //                         </th>
// // //                         <td class="px-6 py-4">
// // //                             <TextEditor
// // //                               value={watch('question') || ''}
// // //                               onChange={(content) => setValue('question[2]', content[2])}
// // //                               placeholder=""
// // //                               height={200}
// // //                             />
// // //                             {errors.question && (
// // //                               <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
// // //                             )}
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                           <div className="grid-col-2">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[2].option_order}
// // //                               placeholder='A.'
// // //                               onChange={(e) => handleInputChange('option_order[2]', e.target.value)}
// // //                               required
// // //                             />
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[2].option}
// // //                               placeholder=''
// // //                               onChange={(e) => handleInputChange('option[2]', e.target.value)}
// // //                               required
// // //                             />

// // //                           </div>
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions[2].poin}
// // //                               placeholder='A.'
// // //                               onChange={(e) => handleInputChange('poin[2] ', e.target.value)}
// // //                               required
// // //                             />
                            
// // //                         </td>
// // //                         {/* <td class="px-6 py-4 text-right">
// // //                             <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
// // //                         </td> */}
// // //                     </tr>
// // //                     <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
// // //                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions.order}
// // //                               onChange={(e) => handleInputChange('order', e.target.value)}
// // //                               required
// // //                             />
// // //                         </th>
// // //                         <td class="px-6 py-4">
// // //                             <TextEditor
// // //                               value={watch('question') || ''}
// // //                               onChange={(content) => setValue('question', content)}
// // //                               placeholder=""
// // //                               height={200}
// // //                             />
// // //                             {errors.question && (
// // //                               <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
// // //                             )}
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                           <div className="grid-col-2">
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               // value={questions.option_order}
// // //                               {...register(`answers.2.isCorrect`)}
// // //                                 onChange={() => {
// // //                                   // fields.forEach((_, i) => {
// // //                                     setValue(`answers.2.isCorrect`, i === index);
// // //                                   // });
// // //                                 }}
// // //                               placeholder='A.'
                              
// // //                               // onChange={(e) => handleInputChange('option_order', e.target.value)}
// // //                               required
// // //                             />
// // //                             <input 
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                               type="text" 
// // //                               value={questions.option}
// // //                               placeholder=''
// // //                               onChange={(e) => handleInputChange('option', e.target.value)}
// // //                               required
// // //                             />

// // //                           </div>
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                             <input
// // //                               type="number"
// // //                               {...register(`answers.1.score`, { valueAsNumber: true })}
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
// // //                               min="0"
// // //                               step="0.5"
// // //                             />
// // //                             {errors.answers?.[2]?.score && (
// // //                               <p className="mt-1 text-sm text-red-600">
// // //                                 {errors.answers[2].score.message}
// // //                               </p>
// // //                             )}
                            
// // //                         </td>
// // //                         {/* <td class="px-6 py-4 text-right">
// // //                             <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
// // //                         </td> */}
// // //                     </tr>
                    
                    
// // //                     {/* <tr class="bg-white dark:bg-gray-800">
// // //                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
// // //                             Magic Mouse 2
// // //                         </th>
// // //                         <td class="px-6 py-4">
// // //                             Black
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                             Accessories
// // //                         </td>
// // //                         <td class="px-6 py-4">
// // //                             $99
// // //                         </td>
// // //                         <td class="px-6 py-4 text-right">
// // //                             <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
// // //                         </td>
// // //                     </tr> */}
// // //                 </tbody>
// // //             </table>


// // //             </>
// // //           )}
// // //           <div className="flex justify-end pt-4">
// // //             <button
// // //               type="submit"
// // //               disabled={uploading}
// // //               className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// // //             >
// // //               <FaSave className="mr-2" />
// // //               {uploading ? 'Menyimpan...' : 'Simpan Pertanyaan'}
// // //             </button>
// // //           </div>
// // //             </form>
// // //         </div>

      
// // //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// // //         {/* Question Type Selection */}
// // //         <div>
// // //           <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-2">
// // //             Tipe Pertanyaan *
// // //           </label>
// // //           <select 
// // //             id="question_type" 
// // //             value={questionType} 
// // //             onChange={(e) => setQuestionType(e.target.value)}
// // //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
// // //             required
// // //           >
// // //             <option value="">-Pilih Tipe-</option>
// // //             <option value="text">Teks</option>
// // //             <option value="upload">Upload Gambar</option>
// // //             <option value="mc">Pilihan Ganda</option>
// // //           </select>
// // //         </div>

// // //         {/* Question Text/Content */}
        

// // //         {/* Multiple Choice Options */}
// // //         {questionType === 'mc' && (
// // //           <div className="space-y-4">
// // //             <div className="flex justify-between items-center">
// // //               <h2 className="text-lg font-medium text-gray-800">Pilihan Jawaban</h2>
// // //               <button
// // //                 type="button"
// // //                 onClick={addAnswerOption}
// // //                 className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
// // //               >
// // //                 <FaPlus className="mr-2" /> Tambah Opsi
// // //               </button>
// // //             </div>
            
// // //             {fields.map((field, index) => (
// // //               <div key={field.id} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeAnswerOption(index)}
// // //                   className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
// // //                   disabled={fields.length <= 1}
// // //                 >
// // //                   <FaTrash />
// // //                 </button>

// // //                 <div className="flex items-center mb-4">
// // //                   <input
// // //                     type="radio"
// // //                     {...register(`answers.${index}.isCorrect`)}
// // //                     onChange={() => {
// // //                       fields.forEach((_, i) => {
// // //                         setValue(`answers.${i}.isCorrect`, i === index);
// // //                       });
// // //                     }}
// // //                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
// // //                   />
// // //                   <label className="ml-2 block text-sm font-medium text-gray-700">
// // //                     Jawaban Benar
// // //                   </label>
// // //                 </div>

// // //                 <div className="mb-4">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                     Teks Jawaban *
// // //                   </label>
// // //                   <TextEditor
// // //                     value={watch(`answers.${index}.text`) || ''}
// // //                     onChange={(content) => setValue(`answers.${index}.text`, content)}
// // //                     placeholder="Tulis jawaban di sini..."
// // //                     compact={true}
// // //                     height={120}
// // //                     className="bg-white"
// // //                   />
// // //                   {errors.answers?.[index]?.text && (
// // //                     <p className="mt-1 text-sm text-red-600">
// // //                       {errors.answers[index].text.message}
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 <div className="mb-3">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                     Score *
// // //                   </label>
// // //                   <input
// // //                     type="number"
// // //                     {...register(`answers.${index}.score`, { valueAsNumber: true })}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
// // //                     min="0"
// // //                     step="0.5"
// // //                   />
// // //                   {errors.answers?.[index]?.score && (
// // //                     <p className="mt-1 text-sm text-red-600">
// // //                       {errors.answers[index].score.message}
// // //                     </p>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             ))}

// // //             {errors.answers && (
// // //               <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* Explanation */}
// // //         {/* <div>
// // //           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //             Penjelasan (Opsional)
// // //           </label>
// // //           <TextEditor
// // //             value={watch('explanation') || ''}
// // //             onChange={(content) => setValue('explanation', content)}
// // //             placeholder="Tambahkan penjelasan jawaban di sini..."
// // //             height={150}
// // //           />
// // //         </div> */}

// // //         {/* Submit Button */}
// // //         <div className="flex justify-end pt-4">
// // //           <button
// // //             type="submit"
// // //             disabled={uploading}
// // //             className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// // //           >
// // //             <FaSave className="mr-2" />
// // //             {uploading ? 'Menyimpan...' : 'Simpan Pertanyaan'}
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // // export default QuestionAdd;

// // // import { useState } from 'react';
// // // import { useForm, useFieldArray } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { questionSchema } from './schemas/question_schemas';
// // // import supabase from '../../../services/database-server';
// // // import TextWithUploadImgCkeditor from './components/TextWithUploadImgCkeditor';
// // // import EditorWithGallery from '../../../components/Input/TextEditor';
// // // import TextEditor from './components/TextEditor';

// // // function QuestionAdd () {
// // //   const [uploading, setUploading] = useState(false);
// // //   const [questionType, setQuestionType] = useState("")
// // //   const [previewUrls, setPreviewUrls] = useState({
// // //     question: null,
// // //     answers: Array(4).fill(null)
// // //   });

// // //   const {
// // //     register,
// // //     control,
// // //     handleSubmit,
// // //     setValue,
// // //     watch,
// // //     formState: { errors },
// // //   } = useForm({
// // //     resolver: zodResolver(questionSchema),
// // //     defaultValues: {
// // //       questionType: '',
// // //       questionText: '',
// // //       questionImage: '',
// // //       answers: Array(4).fill({
// // //         text: '',
// // //         score: 0,
// // //         isCorrect: false,
// // //         image: ''
// // //       }),
// // //       explanation: ''
// // //     }
// // //   });

// // //   const { fields } = useFieldArray({
// // //     control,
// // //     name: "answers"
// // //   });

// // //   const handleImageUpload = async (file, type, index = null) => {
// // //     if (!file) return;
    
// // //     setUploading(true);
// // //     const fileExt = file.name.split('.').pop();
// // //     const fileName = `${Math.random()}.${fileExt}`;
// // //     const filePath = `${fileName}`;

// // //     try {
// // //       const { error: uploadError } = await supabase.storage
// // //         .from('exams/uploads/questions')
// // //         .upload(filePath, file);

// // //       if (uploadError) throw uploadError;

// // //       const { data: { publicUrl } } = supabase.storage
// // //         .from('exams/uploads/questions')
// // //         .getPublicUrl(filePath);

// // //       if (type === 'question') {
// // //         setValue('questionImage', publicUrl);
// // //         setPreviewUrls(prev => ({ ...prev, question: URL.createObjectURL(file) }));
// // //       } else {
// // //         setValue(`answers.${index}.image`, publicUrl);
// // //         setPreviewUrls(prev => {
// // //           const newAnswers = [...prev.answers];
// // //           newAnswers[index] = URL.createObjectURL(file);
// // //           return { ...prev, answers: newAnswers };
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error('Error uploading image:', error);
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   const onSubmit = (data) => {
// // //     console.log('Form data:', data);
// // //     // Submit to your API here
// // //   };

// // //   return (
// // //     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
// // //       <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
      
// // //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// // //         {/* Question Text */}
// // //         <div className="mt-4">
// // //                     <label htmlFor="media" className="block text-sm font-medium text-gray-900">Media</label>
// // //                     <select 
// // //                         id="question_type" 
// // //                         name="question_type" 
// // //                         value={questionType} 
// // //                         onChange={(e) => setQuestionType(e.target.value)}
// // //                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //                         required
// // //                         {...register('question_type')}
// // //                     >
// // //                         <option value="">-Pilih Tipe-</option>
// // //                         <option value="upload">Upload</option>
// // //                         <option value="mc">Pilihan Ganda</option>
// // //                     </select>
                    
// // //                 </div>
// // //           {questionType == 'upload' && (
// // //             <>
// // //               <div>
                  
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                   Pertanyaan
// // //                 </label>
// // //                 <TextEditor>

// // //                 </TextEditor>
// // //                 {/* <EditorWithGallery
// // //                   value={watch('questionText') || ''}
// // //                   onChange={(content) => setValue('questionText', content)}
// // //                   onBlur={() => {}}
// // //                 /> */}
// // //                 {errors.questionText && (
// // //                   <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
// // //                 )}
// // //               </div>
// // //             </>

// // //           )}
// // //           {questionType == 'mc' && ( 
// // //             <>
// // //               <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                 Pertanyaan
// // //               </label>
// // //               <TextEditor
// // //                 value={watch('questionText') || ''}
// // //                 onChange={(content) => setValue('questionText', content)}
// // //               >

// // //               </TextEditor>
// // //               {/* <EditorWithGallery
// // //                 value={watch('questionText') || ''}
// // //                 onChange={(content) => setValue('questionText', content)}
// // //                 onBlur={() => {}}
// // //               /> */}
// // //               {errors.questionText && (
// // //                 <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
// // //               )}
// // //             </div>

// // //             <div className="p-4 border border-gray-200 rounded-md">

// // //                   <div className="mb-2">
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                       Score *
// // //                     </label>
// // //                     <input
// // //                       type="number"
// // //                       {...register(`answers.${index}.score`, { valueAsNumber: true })}
// // //                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                     />
// // //                     {errors.answers?.[index]?.score && (
// // //                       <p className="mt-1 text-sm text-red-600">
// // //                         {errors.answers[index].score.message}
// // //                       </p>
// // //                     )}
// // //                   </div>

// // //                   <div>
// // //                   </div>
// // //                 </div>

// // //             {/* Question Image Upload */}
// // //             <div>
// // //               {/* <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                 Question Image (Optional)
// // //               </label> */}
// // //               {/* <input
// // //                 type="file"
// // //                 accept="image/*"
// // //                 onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
// // //                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// // //                 disabled={uploading}
// // //               />
// // //               {previewUrls.question && (
// // //                 <div className="mt-2">
// // //                   <img 
// // //                     src={previewUrls.question} 
// // //                     alt="Question preview" 
// // //                     className="h-32 object-contain"
// // //                   />
// // //                 </div>
// // //               )} */}
// // //             </div>

// // //             {/* Answers */}
// // //             <div className="space-y-4">
// // //               <h2 className="text-lg font-medium text-gray-900">Pilihan Jawaban (Pilih satu jawaban benar)</h2>
              
// // //               {fields.map((field, index) => (
// // //                 <div key={field.id} className="p-4 border border-gray-200 rounded-md">
// // //                   <div className="flex items-center mb-2">
// // //                     <input
// // //                       type="radio"
// // //                       checked={watch(`answers.${index}.isCorrect`)}
// // //                       onChange={() => {
// // //                         // Set all other answers to false
// // //                         for (let i = 0; i < 4; i++) {
// // //                           setValue(`answers.${i}.isCorrect`, i === index);
// // //                         }
// // //                       }}
// // //                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
// // //                     />
// // //                     <label className="ml-2 block text-sm font-medium text-gray-700">
// // //                       Jawaban Benar
// // //                     </label>
// // //                   </div>

// // //                   <div className="mb-2">
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                       Jawaban
// // //                     </label>
// // //                     <TextEditor></TextEditor>
// // //                     {/* <EditorWithGallery
// // //                       value={watch(`answers.${index}.text`) || ''}
// // //                       onChange={(content) => setValue(`answers.${index}.text`, content)}
// // //                       onBlur={() => {}}
// // //                     /> */}
// // //                     {errors.answers?.[index]?.text && (
// // //                       <p className="mt-1 text-sm text-red-600">
// // //                         {errors.answers[index].text.message}
// // //                       </p>
// // //                     )}
// // //                   </div>

// // //                   <div className="mb-2">
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                       Score *
// // //                     </label>
// // //                     <input
// // //                       type="number"
// // //                       {...register(`answers.${index}.score`, { valueAsNumber: true })}
// // //                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                     />
// // //                     {errors.answers?.[index]?.score && (
// // //                       <p className="mt-1 text-sm text-red-600">
// // //                         {errors.answers[index].score.message}
// // //                       </p>
// // //                     )}
// // //                   </div>

// // //                   <div>
// // //                     {/* <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                       Answer Image (Optional)
// // //                     </label>
// // //                     <input
// // //                       type="file"
// // //                       accept="image/*"
// // //                       onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
// // //                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// // //                       disabled={uploading}
// // //                     />
// // //                     {previewUrls.answers[index] && (
// // //                       <div className="mt-2">
// // //                         <img 
// // //                           src={previewUrls.answers[index]} 
// // //                           alt={`Answer ${index + 1} preview`} 
// // //                           className="h-32 object-contain"
// // //                         />
// // //                       </div>
// // //                     )} */}
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               {/* {errors.answers && typeof errors.answers.message === 'string' && (
// // //                 <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
// // //               )} */}
// // //             </div>
// // //             </>
        
// // //         )}
// // //         {/* Explanation */}
// // //         {/* // <div>
// // //         //   <label className="block text-sm font-medium text-gray-700 mb-1">
// // //         //     Explanation (Optional)
// // //         //   </label>
// // //         //   <textarea
// // //             {...register('explanation')}
// // //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //             rows={3}
// // //           />
// // //         </div> */}

// // //         {/* Submit Button */}
// // //         <div className="flex justify-end">
// // //           <button
// // //             type="submit"
// // //             disabled={uploading}
// // //             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             {uploading ? 'Uploading...' : 'Save Question'}
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   )
// // // }

// // // export default QuestionAdd

// // // // import { useState } from 'react';
// // // // import { useForm, useFieldArray } from 'react-hook-form';
// // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // import { questionSchema } from './schemas/question_schemas';
// // // // // import { supabase } from './/supabase';
// // // // import supabase from '../../../services/database-server';
// // // // import RichTextEditor from './components/EditorWithGallery';

// // // // const QuestionAdd = () => {
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [previewUrls, setPreviewUrls] = useState({
// // // //     question: null,
// // // //     answers: Array(4).fill(null)
// // // //   });
// // // // //   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
// // // // //     resolver: zodResolver(questionSchema),
// // // // //   });

// // // //   const {
// // // //     register,
// // // //     control,
// // // //     handleSubmit,
// // // //     setValue,
// // // //     watch,
// // // //     formState: { errors },
// // // //   } = useForm({
// // // //     resolver: zodResolver(questionSchema),
// // // //     defaultValues: {
// // // //       questionText: '',
// // // //       questionImage: '',
// // // //       answers: Array(4).fill({
// // // //         text: '',
// // // //         score: 0,
// // // //         isCorrect: false,
// // // //         image: ''
// // // //       }),
// // // //       explanation: ''
// // // //     }
// // // //   });

// // // //   const { fields } = useFieldArray({
// // // //     control,
// // // //     name: "answers"
// // // //   });

// // // //   const handleImageUpload = async (file, type, index = null) => {
// // // //     if (!file) return;
    
// // // //     setUploading(true);
// // // //     const fileExt = file.name.split('.').pop();
// // // //     const fileName = `${Math.random()}.${fileExt}`;
// // // //     const filePath = `${fileName}`;

// // // //     try {
// // // //       const { error: uploadError } = await supabase.storage
// // // //         .from('question-images')
// // // //         .upload(filePath, file);

// // // //       if (uploadError) throw uploadError;

// // // //       const { data: { publicUrl } } = supabase.storage
// // // //         .from('question-images')
// // // //         .getPublicUrl(filePath);

// // // //       if (type === 'question') {
// // // //         setValue('questionImage', publicUrl);
// // // //         setPreviewUrls(prev => ({ ...prev, question: URL.createObjectURL(file) }));
// // // //       } else {
// // // //         setValue(`answers.${index}.image`, publicUrl);
// // // //         setPreviewUrls(prev => {
// // // //           const newAnswers = [...prev.answers];
// // // //           newAnswers[index] = URL.createObjectURL(file);
// // // //           return { ...prev, answers: newAnswers };
// // // //         });
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error uploading image:', error);
// // // //     } finally {
// // // //       setUploading(false);
// // // //     }
// // // //   };

// // // //   const onSubmit = (data) => {
// // // //     console.log('Form data:', data);
// // // //     // Submit to your API here
// // // //   };

// // // //   return (
// // // //     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
// // // //       <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
      
// // // //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// // // //         {/* Question Text */}
// // // //         <div>
// // // //           <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //             Question Text *
// // // //           </label>
// // // //           <EditorWithGallery
// // // //           value={watch('content') || ''}
// // // //           onChange={(content) => setValue('content', content)}
// // // //           onBlur={() => {}}
// // // //         />
// // // //           {/* <textarea
// // // //             {...register('questionText')}
// // // //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // // //             rows={3}
// // // //           /> */}
// // // //           {errors.questionText && (
// // // //             <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
// // // //           )}
// // // //         </div>

// // // //         {/* Question Image Upload */}
// // // //         {/* <div>
// // // //           <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //             Question Image (Optional)
// // // //           </label>
// // // //           <input
// // // //             type="file"
// // // //             accept="image/*"
// // // //             onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
// // // //             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// // // //             disabled={uploading}
// // // //           />
// // // //           {previewUrls.question && (
// // // //             <div className="mt-2">
// // // //               <img 
// // // //                 src={previewUrls.question} 
// // // //                 alt="Question preview" 
// // // //                 className="h-32 object-contain"
// // // //               />
// // // //             </div>
// // // //           )}
// // // //         </div> */}

// // // //         {/* Answers */}
// // // //         <div className="space-y-4">
// // // //           <h2 className="text-lg font-medium text-gray-900">Answers (Select one correct answer)</h2>
          
// // // //           {fields.map((field, index) => (
// // // //             <div key={field.id} className="p-4 border border-gray-200 rounded-md">
// // // //               <div className="flex items-center mb-2">
// // // //                 <input
// // // //                   type="radio"
// // // //                   {...register(`answers.${index}.isCorrect`)}
// // // //                   onChange={() => {
// // // //                     // Set all other answers to false
// // // //                     for (let i = 0; i < 4; i++) {
// // // //                       setValue(`answers.${i}.isCorrect`, i === index);
// // // //                     }
// // // //                   }}
// // // //                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
// // // //                 />
// // // //                 <label className="ml-2 block text-sm font-medium text-gray-700">
// // // //                   Correct Answer
// // // //                 </label>
// // // //               </div>

// // // //               <div className="mb-2">
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                   Answer Text *
// // // //                 </label>
// // // //                 <RichTextEditor
// // // //                     value={watch('content') || ''}
// // // //                     onChange={(content) => setValue('content', content)}
// // // //                     onBlur={() => {}}
// // // //                 />
// // // //                 {/* <input
// // // //                   {...register(`answers.${index}.text`)}
// // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // // //                 /> */}
// // // //                 {errors.answers?.[index]?.text && (
// // // //                   <p className="mt-1 text-sm text-red-600">
// // // //                     {errors.answers[index].text.message}
// // // //                   </p>
// // // //                 )}
// // // //               </div>

// // // //               <div className="mb-2">
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                   Score *
// // // //                 </label>
// // // //                 <input
// // // //                   type="number"
// // // //                   {...register(`answers.${index}.score`, { valueAsNumber: true })}
// // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // // //                 />
// // // //                 {errors.answers?.[index]?.score && (
// // // //                   <p className="mt-1 text-sm text-red-600">
// // // //                     {errors.answers[index].score.message}
// // // //                   </p>
// // // //                 )}
// // // //               </div>

// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                   Answer Image (Optional)
// // // //                 </label>
// // // //                 {/* <input
// // // //                   type="file"
// // // //                   accept="image/*"
// // // //                   onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
// // // //                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// // // //                   disabled={uploading}
// // // //                 />
// // // //                 {previewUrls.answers[index] && (
// // // //                   <div className="mt-2">
// // // //                     <img 
// // // //                       src={previewUrls.answers[index]} 
// // // //                       alt={`Answer ${index + 1} preview`} 
// // // //                       className="h-32 object-contain"
// // // //                     />
// // // //                   </div>
// // // //                 )} */}
// // // //               </div>
// // // //             </div>
// // // //           ))}

// // // //           {errors.answers && typeof errors.answers.message === 'string' && (
// // // //             <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
// // // //           )}
// // // //         </div>

// // // //         {/* Explanation */}
// // // //         <div>
// // // //           <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //             Explanation (Optional)
// // // //           </label>
// // // //           <textarea
// // // //             {...register('explanation')}
// // // //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // // //             rows={3}
// // // //           />
// // // //         </div>

// // // //         {/* Submit Button */}
// // // //         <div className="flex justify-end">
// // // //           <button
// // // //             type="submit"
// // // //             disabled={uploading}
// // // //             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //           >
// // // //             {uploading ? 'Uploading...' : 'Save Question'}
// // // //           </button>
// // // //         </div>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default QuestionAdd;