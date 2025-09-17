import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionSchema } from './schemas/question_schemas';
import TextEditor from './components/TextEditor';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
// import TextEditor from './components/TextEditor';

import supabase from '../../../services/database-server';

function QuestionAdd() {
  const [uploading, setUploading] = useState(false);
  const [questionType, setQuestionType] = useState('');
  
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionType: '',
      questionText: '',
      questionImage: '',
      answers: [
        {
          text: '',
          score: 0,
          isCorrect: false,
          image: ''
        }
      ],
      explanation: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers"
  });

  const addAnswerOption = () => {
    append({
      text: '',
      score: 0,
      isCorrect: false,
      image: ''
    });
  };

  const removeAnswerOption = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleImageUpload = async (file, type, index = null) => {
    if (!file) return;
    
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('exams/uploads/questions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('exams/uploads/questions')
        .getPublicUrl(filePath);

      if (type === 'question') {
        setValue('questionImage', publicUrl);
      } else {
        setValue(`answers.${index}.image`, publicUrl);
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    // Submit to your API here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Pertanyaan Baru</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Question Type Selection */}
        <div>
          <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Pertanyaan *
          </label>
          <select 
            id="question_type" 
            value={questionType} 
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            required
          >
            <option value="">-Pilih Tipe-</option>
            <option value="text">Teks</option>
            <option value="upload">Upload Gambar</option>
            <option value="mc">Pilihan Ganda</option>
          </select>
        </div>

        {/* Question Text/Content */}
        {questionType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pertanyaan *
            </label>
            <TextEditor
              value={watch('questionText') || ''}
              onChange={(content) => setValue('questionText', content)}
              placeholder="Tulis pertanyaan di sini..."
              height={200}
            />
            {errors.questionText && (
              <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
            )}
          </div>
        )}

        {/* Multiple Choice Options */}
        {questionType === 'mc' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Pilihan Jawaban</h2>
              <button
                type="button"
                onClick={addAnswerOption}
                className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                <FaPlus className="mr-2" /> Tambah Opsi
              </button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50">
                <button
                  type="button"
                  onClick={() => removeAnswerOption(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                  disabled={fields.length <= 1}
                >
                  <FaTrash />
                </button>

                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    {...register(`answers.${index}.isCorrect`)}
                    onChange={() => {
                      fields.forEach((_, i) => {
                        setValue(`answers.${i}.isCorrect`, i === index);
                      });
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Jawaban Benar
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teks Jawaban *
                  </label>
                  <TextEditor
                    value={watch(`answers.${index}.text`) || ''}
                    onChange={(content) => setValue(`answers.${index}.text`, content)}
                    placeholder="Tulis jawaban di sini..."
                    compact={true}
                    height={120}
                    className="bg-white"
                  />
                  {errors.answers?.[index]?.text && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.answers[index].text.message}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score *
                  </label>
                  <input
                    type="number"
                    {...register(`answers.${index}.score`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    min="0"
                    step="0.5"
                  />
                  {errors.answers?.[index]?.score && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.answers[index].score.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {errors.answers && (
              <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
            )}
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Penjelasan (Opsional)
          </label>
          <TextEditor
            value={watch('explanation') || ''}
            onChange={(content) => setValue('explanation', content)}
            placeholder="Tambahkan penjelasan jawaban di sini..."
            height={150}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FaSave className="mr-2" />
            {uploading ? 'Menyimpan...' : 'Simpan Pertanyaan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuestionAdd;

// import { useState } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { questionSchema } from './schemas/question_schemas';
// import supabase from '../../../services/database-server';
// import TextWithUploadImgCkeditor from './components/TextWithUploadImgCkeditor';
// import EditorWithGallery from '../../../components/Input/TextEditor';
// import TextEditor from './components/TextEditor';

// function QuestionAdd () {
//   const [uploading, setUploading] = useState(false);
//   const [questionType, setQuestionType] = useState("")
//   const [previewUrls, setPreviewUrls] = useState({
//     question: null,
//     answers: Array(4).fill(null)
//   });

//   const {
//     register,
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(questionSchema),
//     defaultValues: {
//       questionType: '',
//       questionText: '',
//       questionImage: '',
//       answers: Array(4).fill({
//         text: '',
//         score: 0,
//         isCorrect: false,
//         image: ''
//       }),
//       explanation: ''
//     }
//   });

//   const { fields } = useFieldArray({
//     control,
//     name: "answers"
//   });

//   const handleImageUpload = async (file, type, index = null) => {
//     if (!file) return;
    
//     setUploading(true);
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const filePath = `${fileName}`;

//     try {
//       const { error: uploadError } = await supabase.storage
//         .from('exams/uploads/questions')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase.storage
//         .from('exams/uploads/questions')
//         .getPublicUrl(filePath);

//       if (type === 'question') {
//         setValue('questionImage', publicUrl);
//         setPreviewUrls(prev => ({ ...prev, question: URL.createObjectURL(file) }));
//       } else {
//         setValue(`answers.${index}.image`, publicUrl);
//         setPreviewUrls(prev => {
//           const newAnswers = [...prev.answers];
//           newAnswers[index] = URL.createObjectURL(file);
//           return { ...prev, answers: newAnswers };
//         });
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const onSubmit = (data) => {
//     console.log('Form data:', data);
//     // Submit to your API here
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
      
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Question Text */}
//         <div className="mt-4">
//                     <label htmlFor="media" className="block text-sm font-medium text-gray-900">Media</label>
//                     <select 
//                         id="question_type" 
//                         name="question_type" 
//                         value={questionType} 
//                         onChange={(e) => setQuestionType(e.target.value)}
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                         {...register('question_type')}
//                     >
//                         <option value="">-Pilih Tipe-</option>
//                         <option value="upload">Upload</option>
//                         <option value="mc">Pilihan Ganda</option>
//                     </select>
                    
//                 </div>
//           {questionType == 'upload' && (
//             <>
//               <div>
                  
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Pertanyaan
//                 </label>
//                 <TextEditor>

//                 </TextEditor>
//                 {/* <EditorWithGallery
//                   value={watch('questionText') || ''}
//                   onChange={(content) => setValue('questionText', content)}
//                   onBlur={() => {}}
//                 /> */}
//                 {errors.questionText && (
//                   <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
//                 )}
//               </div>
//             </>

//           )}
//           {questionType == 'mc' && ( 
//             <>
//               <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Pertanyaan
//               </label>
//               <TextEditor
//                 value={watch('questionText') || ''}
//                 onChange={(content) => setValue('questionText', content)}
//               >

//               </TextEditor>
//               {/* <EditorWithGallery
//                 value={watch('questionText') || ''}
//                 onChange={(content) => setValue('questionText', content)}
//                 onBlur={() => {}}
//               /> */}
//               {errors.questionText && (
//                 <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
//               )}
//             </div>

//             <div className="p-4 border border-gray-200 rounded-md">

//                   <div className="mb-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Score *
//                     </label>
//                     <input
//                       type="number"
//                       {...register(`answers.${index}.score`, { valueAsNumber: true })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     {errors.answers?.[index]?.score && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.answers[index].score.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                   </div>
//                 </div>

//             {/* Question Image Upload */}
//             <div>
//               {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Question Image (Optional)
//               </label> */}
//               {/* <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                 disabled={uploading}
//               />
//               {previewUrls.question && (
//                 <div className="mt-2">
//                   <img 
//                     src={previewUrls.question} 
//                     alt="Question preview" 
//                     className="h-32 object-contain"
//                   />
//                 </div>
//               )} */}
//             </div>

//             {/* Answers */}
//             <div className="space-y-4">
//               <h2 className="text-lg font-medium text-gray-900">Pilihan Jawaban (Pilih satu jawaban benar)</h2>
              
//               {fields.map((field, index) => (
//                 <div key={field.id} className="p-4 border border-gray-200 rounded-md">
//                   <div className="flex items-center mb-2">
//                     <input
//                       type="radio"
//                       checked={watch(`answers.${index}.isCorrect`)}
//                       onChange={() => {
//                         // Set all other answers to false
//                         for (let i = 0; i < 4; i++) {
//                           setValue(`answers.${i}.isCorrect`, i === index);
//                         }
//                       }}
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                     />
//                     <label className="ml-2 block text-sm font-medium text-gray-700">
//                       Jawaban Benar
//                     </label>
//                   </div>

//                   <div className="mb-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Jawaban
//                     </label>
//                     <TextEditor></TextEditor>
//                     {/* <EditorWithGallery
//                       value={watch(`answers.${index}.text`) || ''}
//                       onChange={(content) => setValue(`answers.${index}.text`, content)}
//                       onBlur={() => {}}
//                     /> */}
//                     {errors.answers?.[index]?.text && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.answers[index].text.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="mb-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Score *
//                     </label>
//                     <input
//                       type="number"
//                       {...register(`answers.${index}.score`, { valueAsNumber: true })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     {errors.answers?.[index]?.score && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.answers[index].score.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Answer Image (Optional)
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                       disabled={uploading}
//                     />
//                     {previewUrls.answers[index] && (
//                       <div className="mt-2">
//                         <img 
//                           src={previewUrls.answers[index]} 
//                           alt={`Answer ${index + 1} preview`} 
//                           className="h-32 object-contain"
//                         />
//                       </div>
//                     )} */}
//                   </div>
//                 </div>
//               ))}

//               {/* {errors.answers && typeof errors.answers.message === 'string' && (
//                 <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
//               )} */}
//             </div>
//             </>
        
//         )}
//         {/* Explanation */}
//         {/* // <div>
//         //   <label className="block text-sm font-medium text-gray-700 mb-1">
//         //     Explanation (Optional)
//         //   </label>
//         //   <textarea
//             {...register('explanation')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             rows={3}
//           />
//         </div> */}

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={uploading}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {uploading ? 'Uploading...' : 'Save Question'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default QuestionAdd

// // import { useState } from 'react';
// // import { useForm, useFieldArray } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { questionSchema } from './schemas/question_schemas';
// // // import { supabase } from './/supabase';
// // import supabase from '../../../services/database-server';
// // import RichTextEditor from './components/EditorWithGallery';

// // const QuestionAdd = () => {
// //   const [uploading, setUploading] = useState(false);
// //   const [previewUrls, setPreviewUrls] = useState({
// //     question: null,
// //     answers: Array(4).fill(null)
// //   });
// // //   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
// // //     resolver: zodResolver(questionSchema),
// // //   });

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
// //       questionText: '',
// //       questionImage: '',
// //       answers: Array(4).fill({
// //         text: '',
// //         score: 0,
// //         isCorrect: false,
// //         image: ''
// //       }),
// //       explanation: ''
// //     }
// //   });

// //   const { fields } = useFieldArray({
// //     control,
// //     name: "answers"
// //   });

// //   const handleImageUpload = async (file, type, index = null) => {
// //     if (!file) return;
    
// //     setUploading(true);
// //     const fileExt = file.name.split('.').pop();
// //     const fileName = `${Math.random()}.${fileExt}`;
// //     const filePath = `${fileName}`;

// //     try {
// //       const { error: uploadError } = await supabase.storage
// //         .from('question-images')
// //         .upload(filePath, file);

// //       if (uploadError) throw uploadError;

// //       const { data: { publicUrl } } = supabase.storage
// //         .from('question-images')
// //         .getPublicUrl(filePath);

// //       if (type === 'question') {
// //         setValue('questionImage', publicUrl);
// //         setPreviewUrls(prev => ({ ...prev, question: URL.createObjectURL(file) }));
// //       } else {
// //         setValue(`answers.${index}.image`, publicUrl);
// //         setPreviewUrls(prev => {
// //           const newAnswers = [...prev.answers];
// //           newAnswers[index] = URL.createObjectURL(file);
// //           return { ...prev, answers: newAnswers };
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error uploading image:', error);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const onSubmit = (data) => {
// //     console.log('Form data:', data);
// //     // Submit to your API here
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
// //       <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
      
// //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //         {/* Question Text */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Question Text *
// //           </label>
// //           <EditorWithGallery
// //           value={watch('content') || ''}
// //           onChange={(content) => setValue('content', content)}
// //           onBlur={() => {}}
// //         />
// //           {/* <textarea
// //             {...register('questionText')}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// //             rows={3}
// //           /> */}
// //           {errors.questionText && (
// //             <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
// //           )}
// //         </div>

// //         {/* Question Image Upload */}
// //         {/* <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Question Image (Optional)
// //           </label>
// //           <input
// //             type="file"
// //             accept="image/*"
// //             onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
// //             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// //             disabled={uploading}
// //           />
// //           {previewUrls.question && (
// //             <div className="mt-2">
// //               <img 
// //                 src={previewUrls.question} 
// //                 alt="Question preview" 
// //                 className="h-32 object-contain"
// //               />
// //             </div>
// //           )}
// //         </div> */}

// //         {/* Answers */}
// //         <div className="space-y-4">
// //           <h2 className="text-lg font-medium text-gray-900">Answers (Select one correct answer)</h2>
          
// //           {fields.map((field, index) => (
// //             <div key={field.id} className="p-4 border border-gray-200 rounded-md">
// //               <div className="flex items-center mb-2">
// //                 <input
// //                   type="radio"
// //                   {...register(`answers.${index}.isCorrect`)}
// //                   onChange={() => {
// //                     // Set all other answers to false
// //                     for (let i = 0; i < 4; i++) {
// //                       setValue(`answers.${i}.isCorrect`, i === index);
// //                     }
// //                   }}
// //                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
// //                 />
// //                 <label className="ml-2 block text-sm font-medium text-gray-700">
// //                   Correct Answer
// //                 </label>
// //               </div>

// //               <div className="mb-2">
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Answer Text *
// //                 </label>
// //                 <RichTextEditor
// //                     value={watch('content') || ''}
// //                     onChange={(content) => setValue('content', content)}
// //                     onBlur={() => {}}
// //                 />
// //                 {/* <input
// //                   {...register(`answers.${index}.text`)}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// //                 /> */}
// //                 {errors.answers?.[index]?.text && (
// //                   <p className="mt-1 text-sm text-red-600">
// //                     {errors.answers[index].text.message}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="mb-2">
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Score *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   {...register(`answers.${index}.score`, { valueAsNumber: true })}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// //                 />
// //                 {errors.answers?.[index]?.score && (
// //                   <p className="mt-1 text-sm text-red-600">
// //                     {errors.answers[index].score.message}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Answer Image (Optional)
// //                 </label>
// //                 {/* <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
// //                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// //                   disabled={uploading}
// //                 />
// //                 {previewUrls.answers[index] && (
// //                   <div className="mt-2">
// //                     <img 
// //                       src={previewUrls.answers[index]} 
// //                       alt={`Answer ${index + 1} preview`} 
// //                       className="h-32 object-contain"
// //                     />
// //                   </div>
// //                 )} */}
// //               </div>
// //             </div>
// //           ))}

// //           {errors.answers && typeof errors.answers.message === 'string' && (
// //             <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
// //           )}
// //         </div>

// //         {/* Explanation */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Explanation (Optional)
// //           </label>
// //           <textarea
// //             {...register('explanation')}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// //             rows={3}
// //           />
// //         </div>

// //         {/* Submit Button */}
// //         <div className="flex justify-end">
// //           <button
// //             type="submit"
// //             disabled={uploading}
// //             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {uploading ? 'Uploading...' : 'Save Question'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default QuestionAdd;