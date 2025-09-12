import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionSchema } from './schemas/question_schemas';
import supabase from '../../../services/database-server';
import TextWithUploadImgCkeditor from './components/TextWithUploadImgCkeditor';
import EditorWithGallery from '../../../components/Input/TextEditor';
import TextEditor from './components/TextEditor';

function QuestionAdd () {
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({
    question: null,
    answers: Array(4).fill(null)
  });

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
      questionText: '',
      questionImage: '',
      answers: Array(4).fill({
        text: '',
        score: 0,
        isCorrect: false,
        image: ''
      }),
      explanation: ''
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "answers"
  });

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
        setPreviewUrls(prev => ({ ...prev, question: URL.createObjectURL(file) }));
      } else {
        setValue(`answers.${index}.image`, publicUrl);
        setPreviewUrls(prev => {
          const newAnswers = [...prev.answers];
          newAnswers[index] = URL.createObjectURL(file);
          return { ...prev, answers: newAnswers };
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    // Submit to your API here
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text *
          </label>
          <TextEditor>

          </TextEditor>
          {/* <EditorWithGallery
            value={watch('questionText') || ''}
            onChange={(content) => setValue('questionText', content)}
            onBlur={() => {}}
          /> */}
          {errors.questionText && (
            <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
          )}
        </div>

        {/* Question Image Upload */}
        <div>
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Image (Optional)
          </label> */}
          {/* <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={uploading}
          />
          {previewUrls.question && (
            <div className="mt-2">
              <img 
                src={previewUrls.question} 
                alt="Question preview" 
                className="h-32 object-contain"
              />
            </div>
          )} */}
        </div>

        {/* Answers */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Pilihan Jawaban (Select one correct answer)</h2>
          
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  checked={watch(`answers.${index}.isCorrect`)}
                  onChange={() => {
                    // Set all other answers to false
                    for (let i = 0; i < 4; i++) {
                      setValue(`answers.${i}.isCorrect`, i === index);
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label className="ml-2 block text-sm font-medium text-gray-700">
                  Correct Answer
                </label>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer Text *
                </label>
                <TextEditor></TextEditor>
                {/* <EditorWithGallery
                  value={watch(`answers.${index}.text`) || ''}
                  onChange={(content) => setValue(`answers.${index}.text`, content)}
                  onBlur={() => {}}
                /> */}
                {errors.answers?.[index]?.text && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.answers[index].text.message}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score *
                </label>
                <input
                  type="number"
                  {...register(`answers.${index}.score`, { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.answers?.[index]?.score && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.answers[index].score.message}
                  </p>
                )}
              </div>

              <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  disabled={uploading}
                />
                {previewUrls.answers[index] && (
                  <div className="mt-2">
                    <img 
                      src={previewUrls.answers[index]} 
                      alt={`Answer ${index + 1} preview`} 
                      className="h-32 object-contain"
                    />
                  </div>
                )} */}
              </div>
            </div>
          ))}

          {/* {errors.answers && typeof errors.answers.message === 'string' && (
            <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
          )} */}
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explanation (Optional)
          </label>
          <textarea
            {...register('explanation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QuestionAdd

// import { useState } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { questionSchema } from './schemas/question_schemas';
// // import { supabase } from './/supabase';
// import supabase from '../../../services/database-server';
// import RichTextEditor from './components/EditorWithGallery';

// const QuestionAdd = () => {
//   const [uploading, setUploading] = useState(false);
//   const [previewUrls, setPreviewUrls] = useState({
//     question: null,
//     answers: Array(4).fill(null)
//   });
// //   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
// //     resolver: zodResolver(questionSchema),
// //   });

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
//         .from('question-images')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase.storage
//         .from('question-images')
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
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Question Text *
//           </label>
//           <EditorWithGallery
//           value={watch('content') || ''}
//           onChange={(content) => setValue('content', content)}
//           onBlur={() => {}}
//         />
//           {/* <textarea
//             {...register('questionText')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             rows={3}
//           /> */}
//           {errors.questionText && (
//             <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
//           )}
//         </div>

//         {/* Question Image Upload */}
//         {/* <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Question Image (Optional)
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//             disabled={uploading}
//           />
//           {previewUrls.question && (
//             <div className="mt-2">
//               <img 
//                 src={previewUrls.question} 
//                 alt="Question preview" 
//                 className="h-32 object-contain"
//               />
//             </div>
//           )}
//         </div> */}

//         {/* Answers */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-medium text-gray-900">Answers (Select one correct answer)</h2>
          
//           {fields.map((field, index) => (
//             <div key={field.id} className="p-4 border border-gray-200 rounded-md">
//               <div className="flex items-center mb-2">
//                 <input
//                   type="radio"
//                   {...register(`answers.${index}.isCorrect`)}
//                   onChange={() => {
//                     // Set all other answers to false
//                     for (let i = 0; i < 4; i++) {
//                       setValue(`answers.${i}.isCorrect`, i === index);
//                     }
//                   }}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                 />
//                 <label className="ml-2 block text-sm font-medium text-gray-700">
//                   Correct Answer
//                 </label>
//               </div>

//               <div className="mb-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Answer Text *
//                 </label>
//                 <RichTextEditor
//                     value={watch('content') || ''}
//                     onChange={(content) => setValue('content', content)}
//                     onBlur={() => {}}
//                 />
//                 {/* <input
//                   {...register(`answers.${index}.text`)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 /> */}
//                 {errors.answers?.[index]?.text && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.answers[index].text.message}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Score *
//                 </label>
//                 <input
//                   type="number"
//                   {...register(`answers.${index}.score`, { valueAsNumber: true })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 {errors.answers?.[index]?.score && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.answers[index].score.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Answer Image (Optional)
//                 </label>
//                 {/* <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e.target.files[0], 'answer', index)}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                   disabled={uploading}
//                 />
//                 {previewUrls.answers[index] && (
//                   <div className="mt-2">
//                     <img 
//                       src={previewUrls.answers[index]} 
//                       alt={`Answer ${index + 1} preview`} 
//                       className="h-32 object-contain"
//                     />
//                   </div>
//                 )} */}
//               </div>
//             </div>
//           ))}

//           {errors.answers && typeof errors.answers.message === 'string' && (
//             <p className="mt-1 text-sm text-red-600">{errors.answers.message}</p>
//           )}
//         </div>

//         {/* Explanation */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Explanation (Optional)
//           </label>
//           <textarea
//             {...register('explanation')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             rows={3}
//           />
//         </div>

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
//   );
// };

// export default QuestionAdd;