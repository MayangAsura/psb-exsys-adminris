import React, { useState, useEffect } from 'react';

const QuestionForm = ({ 
  initialData = null, 
  questionsBank = [], 
  categories = [], 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    id: '',
    uuid: '',
    question: '',
    answer: '',
    type: '',
    score: '',
    bank_code: '',
    category_id: '',
    parent_id: '',
    options: [{ id: 1, text: '', is_correct: false }]
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Filter out current question from parent options
  const parentOptions = questionsBank.filter(question => 
    question.uuid !== formData.uuid
  );

  useEffect(() => {
    if (initialData) {
      // If initial data has options, use them, otherwise set default
      const dataWithOptions = initialData.options 
        ? initialData 
        : { ...initialData, options: [{ id: 1, text: '', is_correct: false }] };
      
      setFormData(dataWithOptions);
      setIsEditing(true);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOptionChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === id 
          ? { ...option, [field]: field === 'is_correct' ? value === 'true' : value }
          : field === 'is_correct' ? { ...option, is_correct: false } : option
      )
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { 
        id: Math.max(...prev.options.map(o => o.id)) + 1, 
        text: '', 
        is_correct: false 
      }]
    }));
  };

  const removeOption = (id) => {
    if (formData.options.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== id)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Pertanyaan wajib diisi';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Tipe wajib diisi';
    }

    if (!formData.score || isNaN(formData.score) || formData.score <= 0) {
      newErrors.score = 'Score harus berupa angka positif';
    }

    if (!formData.bank_code.trim()) {
      newErrors.bank_code = 'Kode bank wajib diisi';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Kategori wajib dipilih';
    }

    // Validate options for multiple choice
    if (formData.type === 'multiple_choice') {
      if (formData.options.length < 2) {
        newErrors.options = 'Minimal 2 opsi diperlukan untuk pilihan ganda';
      } else {
        const hasEmptyOption = formData.options.some(opt => !opt.text.trim());
        if (hasEmptyOption) {
          newErrors.options = 'Semua opsi harus diisi';
        }
        
        const correctOptions = formData.options.filter(opt => opt.is_correct);
        if (correctOptions.length === 0) {
          newErrors.options = 'Pilih setidaknya satu jawaban yang benar';
        }
      }
    } else if (!formData.answer.trim()) {
      // For non-multiple choice questions
      newErrors.answer = 'Jawaban wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // For multiple choice, set answer to the correct option(s)
      let submissionData = { ...formData };
      
      if (formData.type === 'multiple_choice') {
        const correctAnswers = formData.options
          .filter(opt => opt.is_correct)
          .map(opt => opt.text);
        
        submissionData.answer = correctAnswers.join('|');
      }
      
      onSubmit(submissionData);
    }
  };

  const handleReset = () => {
    setFormData(initialData || {
      id: '',
      uuid: '',
      question: '',
      answer: '',
      type: '',
      score: '',
      bank_code: '',
      category_id: '',
      parent_id: '',
      options: [{ id: 1, text: '', is_correct: false }]
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Soal' : 'Tambah Soal Baru'}
        </h2>
        <p className="text-gray-600">Kelola data soal bank pertanyaan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question */}
          <div className="md:col-span-2">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Masukkan pertanyaan..."
              rows="4"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.question ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
          </div>

          {/* Question Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Pertanyaan <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Tipe</option>
              <option value="multiple_choice">Pilihan Ganda</option>
              <option value="essay">Essay</option>
              <option value="true_false">Benar/Salah</option>
              <option value="fill_blank">Isian</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Answer (for non-multiple choice) */}
          {formData.type !== 'multiple_choice' && (
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Jawaban <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Masukkan jawaban..."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.answer ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
            </div>
          )}

          {/* Score */}
          <div>
            <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
              Score <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="score"
              name="score"
              value={formData.score}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.5"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.score ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.score && <p className="mt-1 text-sm text-red-600">{errors.score}</p>}
          </div>

          {/* Bank Code */}
          <div>
            <label htmlFor="bank_code" className="block text-sm font-medium text-gray-700 mb-1">
              Kode Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bank_code"
              name="bank_code"
              value={formData.bank_code}
              onChange={handleChange}
              placeholder="Contoh: BNK001"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bank_code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bank_code && <p className="mt-1 text-sm text-red-600">{errors.bank_code}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Kategori</option>
              {categories.map(category => (
                <option key={category.uuid} value={category.uuid}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
          </div>

          {/* Parent Question */}
          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
              Soal Induk (Opsional)
            </label>
            <select
              id="parent_id"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tidak ada induk</option>
              {parentOptions.map(question => (
                <option key={question.uuid} value={question.uuid}>
                  {question.bank_code} - {question.question.substring(0, 50)}...
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Pilih soal yang menjadi induk (exclude diri sendiri)</p>
          </div>

          {/* Options for Multiple Choice */}
          {formData.type === 'multiple_choice' && (
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Opsi Jawaban <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                >
                  + Tambah Opsi
                </button>
              </div>
              
              {errors.options && <p className="mt-1 text-sm text-red-600 mb-2">{errors.options}</p>}
              
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct_option"
                      value={option.id}
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(option.id, 'is_correct', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                      placeholder={`Opsi ${index + 1}`}
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.options && !option.text ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      disabled={formData.options.length <= 1}
                      className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden fields for id and uuid */}
          <input type="hidden" name="id" value={formData.id} />
          <input type="hidden" name="uuid" value={formData.uuid} />

          {/* Form Actions */}
          <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Update Soal' : 'Simpan Soal'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
// import React, { useState, useEffect } from 'react';
// import './custom-styles/style.css';

// const QuestionForm = ({ 
//   initialData = null, 
//   questionsBank = [], 
//   categories = [], 
//   onSubmit, 
//   onCancel 
// }) => {
//   const [formData, setFormData] = useState({
//     id: '',
//     uuid: '',
//     question: '',
//     answer: '',
//     type: '',
//     score: '',
//     bank_code: '',
//     category_id: '',
//     parent_id: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isEditing, setIsEditing] = useState(false);

//   // Filter out current question from parent options
//   const parentOptions = questionsBank.filter(question => 
//     question.uuid !== formData.uuid
//   );

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//       setIsEditing(true);
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Clear error when field is changed
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.question.trim()) {
//       newErrors.question = 'Pertanyaan wajib diisi';
//     }

//     if (!formData.answer.trim()) {
//       newErrors.answer = 'Jawaban wajib diisi';
//     }

//     if (!formData.type.trim()) {
//       newErrors.type = 'Tipe wajib diisi';
//     }

//     if (!formData.score || isNaN(formData.score) || formData.score <= 0) {
//       newErrors.score = 'Score harus berupa angka positif';
//     }

//     if (!formData.bank_code.trim()) {
//       newErrors.bank_code = 'Kode bank wajib diisi';
//     }

//     if (!formData.category_id) {
//       newErrors.category_id = 'Kategori wajib dipilih';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       onSubmit(formData);
//     }
//   };

//   const handleReset = () => {
//     setFormData(initialData || {
//       id: '',
//       uuid: '',
//       question: '',
//       answer: '',
//       type: '',
//       score: '',
//       bank_code: '',
//       category_id: '',
//       parent_id: ''
//     });
//     setErrors({});
//   };

//   return (
//     <div className="question-form-container">
//       <div className="form-header">
//         <h2>{isEditing ? 'Edit Soal' : 'Tambah Soal Baru'}</h2>
//         <p>Kelola data soal bank pertanyaan</p>
//       </div>

//       <form onSubmit={handleSubmit} className="question-form">
//         <div className='grid grid-cols-2 md:grid-cols-2 gap-6'>
//             <div className="form-row">
//             <div className="form-control w-full">
//                 <label className='label' htmlFor="question">
//                     <span className="label-text text-base-content">
//                         Pertanyaan <span className='text-red-500'>*</span>
//                     </span>
//                 </label>
//                 <textarea
//                 id="question"
//                 name="question"
//                 value={formData.question}
//                 onChange={handleChange}
//                 placeholder="Masukkan pertanyaan..."
//                 rows="4"
//                 className={'input input-bordered w-full '+ errors.question ? 'error' : ''}
//                 />
//                 {errors.question && <span className="error-message">{errors.question}</span>}
//             </div>
//             </div>

//             <div className="form-row">
//             <div className="form-control w-full">
//                 <label className='label label-text text-base-content' htmlFor="answer">Jawaban <span className='text-red-500 '>*</span>
//                 </label>
//                 <input
//                 type="text"
//                 id="answer"
//                 name="answer"
//                 value={formData.answer}
//                 onChange={handleChange}
//                 placeholder="Masukkan jawaban..."
//                 className={'form-input input-bordered w-full ' + errors.answer ? 'error' : ''}
//                 />
//                 {errors.answer && <span className="text-xs text-red-500">{errors.answer}</span>}
//             </div>

//             <div className="form-group">
//                 <label htmlFor="type">Tipe Pertanyaan *</label>
//                 <select
//                 id="type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className={errors.type ? 'error' : ''}
//                 >
//                 <option value="">Pilih Tipe</option>
//                 <option value="multiple_choice">Pilihan Ganda</option>
//                 <option value="essay">Essay</option>
//                 <option value="true_false">Benar/Salah</option>
//                 <option value="fill_blank">Isian</option>
//                 </select>
//                 {errors.type && <span className="error-message">{errors.type}</span>}
//             </div>
//             </div>

//             <div className="form-row">
//             <div className="form-group">
//                 <label htmlFor="score">Score *</label>
//                 <input
//                 type="number"
//                 id="score"
//                 name="score"
//                 value={formData.score}
//                 onChange={handleChange}
//                 placeholder="0"
//                 min="0"
//                 step="0.5"
//                 className={errors.score ? 'error' : ''}
//                 />
//                 {errors.score && <span className="error-message">{errors.score}</span>}
//             </div>

//             <div className="form-group">
//                 <label htmlFor="bank_code">Kode Bank *</label>
//                 <input
//                 type="text"
//                 id="bank_code"
//                 name="bank_code"
//                 value={formData.bank_code}
//                 onChange={handleChange}
//                 placeholder="Contoh: BNK001"
//                 className={errors.bank_code ? 'error' : ''}
//                 />
//                 {errors.bank_code && <span className="error-message">{errors.bank_code}</span>}
//             </div>
//             </div>

//             <div className="form-row">
//             <div className="form-group">
//                 <label htmlFor="category_id">Kategori *</label>
//                 <select
//                 id="category_id"
//                 name="category_id"
//                 value={formData.category_id}
//                 onChange={handleChange}
//                 className={errors.category_id ? 'error' : ''}
//                 >
//                 <option value="">Pilih Kategori</option>
//                 {categories.map(category => (
//                     <option key={category.uuid} value={category.uuid}>
//                     {category.name}
//                     </option>
//                 ))}
//                 </select>
//                 {errors.category_id && <span className="error-message">{errors.category_id}</span>}
//             </div>

//             <div className="form-group">
//                 <label htmlFor="parent_id">Soal Induk (Opsional)</label>
//                 <select
//                 id="parent_id"
//                 name="parent_id"
//                 value={formData.parent_id}
//                 onChange={handleChange}
//                 >
//                 <option value="">Tidak ada induk</option>
//                 {parentOptions.map(question => (
//                     <option key={question.uuid} value={question.uuid}>
//                     {question.bank_code} - {question.question.substring(0, 50)}...
//                     </option>
//                 ))}
//                 </select>
//                 <span className="help-text">Pilih soal yang menjadi induk (exclude diri sendiri)</span>
//             </div>
//             </div>

//             {/* Hidden fields for id and uuid */}
//             <input type="hidden" name="id" value={formData.id} />
//             <input type="hidden" name="uuid" value={formData.uuid} />

//             <div className="form-actions">
//             <button type="button" onClick={onCancel} className="btn-secondary">
//                 Batal
//             </button>
//             <button type="button" onClick={handleReset} className="btn-reset">
//                 Reset
//             </button>
//             <button type="submit" className="btn-primary">
//                 {isEditing ? 'Update Soal' : 'Simpan Soal'}
//             </button>
//             </div>
//         </div>
        
//       </form>
//     </div>
//   );
// };

// export default QuestionForm;
// // import moment from "moment"
// // import { useEffect, useState } from "react"
// // import { useDispatch, useSelector } from "react-redux"
// // import TitleCard from "../../components/Cards/TitleCard"
// // import { showNotification } from '../common/headerSlice'
// // import InputText from '../../components/Input/InputText'
// // import InputTextRadio from '../../components/Input/InputTextRadio'
// // import SelectBox from "../../components/Input/SelectBox"
// // import TextAreaInput from '../../components/Input/TextAreaInput'
// // import ToogleInput from '../../components/Input/ToogleInput'
// // import InputDateTime from "../../components/Input/InputDateTime"
// // import { useForm } from "react-hook-form"

// // import './custom-styles/style.css'

// // import supabase from "../../services/database-server"
// // import {addExam} from "../../services/api/exams"

// // import DateTimePicker from 'react-datetime-picker'
// // import { useParams } from "react-router-dom"
// // import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// // // import DatePicker from 'rsuite/DatePicker';
// // // import 'rsuite/DatePicker/styles/index.css';
// // // importing styling datepicker
// // // import "./css/react-datepicker/react-datepicker.css"

// // import axios from "axios"
// // import schools from "../../services/api/schools"
// // // import supabase from "../services/database"

// // // type ValuePiece = Date | null

// // // type Value = ValuePiece | [ValuePiece, ValuePiece]

// // function QuestionBankCreate(){

// //     const dispatch = useDispatch()
// //     const [value, onChange] = useState(new Date())
    
// //     const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" })
// //     // exam_category_id: "",
// //     // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
// //     const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
// //     const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
// //     const [selectedOption, setSelectedOption] = useState(null);
// //     const checked = false
// //     // const {register, handleSubmit} = useForm()
// //     // const {id} = useParams()


// //     useEffect( () => {
// //         // getSchoolsOptions()
// //         // getSchedule()
// //         // console.log(id)
// //         console.log(exam)
// //     },[])

// //     const QuestionForm = ({ 
// //         initialData = null, 
// //         questionsBank = [], 
// //         categories = [], 
// //         onSubmit, 
// //         onCancel 
// //         }) => {
// //         const [formData, setFormData] = useState({
// //             id: '',
// //             uuid: '',
// //             question: '',
// //             answer: '',
// //             type: '',
// //             score: '',
// //             bank_code: '',
// //             category_id: '',
// //             parent_id: ''
// //         });

// //         const [errors, setErrors] = useState({});
// //         const [isEditing, setIsEditing] = useState(false);

// //         // Filter out current question from parent options
// //         const parentOptions = questionsBank.filter(question => 
// //             question.uuid !== formData.uuid
// //         );

// //         useEffect(() => {
// //             if (initialData) {
// //             setFormData(initialData);
// //             setIsEditing(true);
// //             }
// //         }, [initialData]);

// //         const handleChange = (e) => {
// //             const { name, value } = e.target;
// //             setFormData(prev => ({
// //             ...prev,
// //             [name]: value
// //             }));

// //             // Clear error when field is changed
// //             if (errors[name]) {
// //             setErrors(prev => ({
// //                 ...prev,
// //                 [name]: ''
// //             }));
// //             }
// //         };

// //         const validateForm = () => {
// //             const newErrors = {};

// //             if (!formData.question.trim()) {
// //             newErrors.question = 'Pertanyaan wajib diisi';
// //             }

// //             if (!formData.answer.trim()) {
// //             newErrors.answer = 'Jawaban wajib diisi';
// //             }

// //             if (!formData.type.trim()) {
// //             newErrors.type = 'Tipe wajib diisi';
// //             }

// //             if (!formData.score || isNaN(formData.score) || formData.score <= 0) {
// //             newErrors.score = 'Score harus berupa angka positif';
// //             }

// //             if (!formData.bank_code.trim()) {
// //             newErrors.bank_code = 'Kode bank wajib diisi';
// //             }

// //             if (!formData.category_id) {
// //             newErrors.category_id = 'Kategori wajib dipilih';
// //             }

// //             setErrors(newErrors);
// //             return Object.keys(newErrors).length === 0;
// //         };

// //         const handleSubmit = (e) => {
// //             e.preventDefault();
            
// //             if (validateForm()) {
// //             onSubmit(formData);
// //             }
// //         };

// //         const handleReset = () => {
// //             setFormData(initialData || {
// //             id: '',
// //             uuid: '',
// //             question: '',
// //             answer: '',
// //             type: '',
// //             score: '',
// //             bank_code: '',
// //             category_id: '',
// //             parent_id: ''
// //             });
// //             setErrors({});
// //         };


// //     // Call API to update profile settings changes
// //     const updateExam = async (e) => {
// //         // e.preventDefault()
// //         console.log(exam)
// //         // const {school_id, ...newSchedule} = exa
// //         const response = await addExam({exam})
// //         // const {error, message, data} = await addExam({exam})
// //         console.log('response', response)
// //         // console.log('message', message)
// //         if(!response || response==null || response.error){
// //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
// //         }else if(!response.error) {
// //             console.log("masuk")
// //             dispatch(showNotification({message : response.message, status : 1}))
// //         }else{
// //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
// //         }
// //     }
 
// //     // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
// //     //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
// //     //     // console.log(updateType)
// //     // }
// //     const updateFormValue = ({updateType, nameInput, value}) => {
// //         console.log('nameInput', nameInput, value)
// //         exam[nameInput] = value
// //         console.log('exam>', exam)
// //         // setSchedule( (data) =>  ({...data, [nameInput]: value}))

// //         // console.log(updateType)
// //     }

// //     const getSchoolsOptions = async () => {
// //         let { data: schools, error } = await supabase
// //             .from('schools')
// //             .select('*')
// //             console.log(schools)
// //             if(!error){
// //                 // setSchoolOptions(schools)
// //                 // schools.map((e)=>(
// //                 //         // setScheduleOptions( e => {
// //                 //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
// //                 //     ))
// //                     // console.log(schoolOptions)
// //             // //     // schedulesOptions e.name

// //             // }))
// //             // name: schedule
// //             // setScheduleOptions(schedule => {.})
// //         }
// //     }

// //     // const handledSubmit = (e) => {
// //     //     e.preventDefault()


// //     // }



// //     const schedulesOptions2 = [
// //         {name : "Today", value : "TODAY"},
// //         {name : "Yesterday", value : "YESTERDAY"},
// //         {name : "This Week", value : "THIS_WEEK"},
// //         {name : "Last Week", value : "LAST_WEEK"},
// //         {name : "This Month", value : "THIS_MONTH"},
// //         {name : "Last Month", value : "LAST_MONTH"},
// //     ]

// //     return(
// //         <>
            
// //             <TitleCard title="Tambah Soal" topMargin="mt-2">

// //                 <form onSubmit={handleSubmit} className="question-form">
// //                     <div className="form-row">
// //                     <div className="form-group">
// //                         <label htmlFor="question">Pertanyaan *</label>
// //                         <textarea
// //                         id="question"
// //                         name="question"
// //                         value={formData.question}
// //                         onChange={handleChange}
// //                         placeholder="Masukkan pertanyaan..."
// //                         rows="4"
// //                         className={errors.question ? 'error' : ''}
// //                         />
// //                         {errors.question && <span className="error-message">{errors.question}</span>}
// //                     </div>
// //                     </div>

// //                     <div className="form-row">
// //                     <div className="form-group">
// //                         <label htmlFor="answer">Jawaban *</label>
// //                         <input
// //                         type="text"
// //                         id="answer"
// //                         name="answer"
// //                         value={formData.answer}
// //                         onChange={handleChange}
// //                         placeholder="Masukkan jawaban..."
// //                         className={errors.answer ? 'error' : ''}
// //                         />
// //                         {errors.answer && <span className="error-message">{errors.answer}</span>}
// //                     </div>

// //                     <div className="form-group">
// //                         <label htmlFor="type">Tipe Pertanyaan *</label>
// //                         <select
// //                         id="type"
// //                         name="type"
// //                         value={formData.type}
// //                         onChange={handleChange}
// //                         className={errors.type ? 'error' : ''}
// //                         >
// //                         <option value="">Pilih Tipe</option>
// //                         <option value="multiple_choice">Pilihan Ganda</option>
// //                         <option value="essay">Essay</option>
// //                         <option value="true_false">Benar/Salah</option>
// //                         <option value="fill_blank">Isian</option>
// //                         </select>
// //                         {errors.type && <span className="error-message">{errors.type}</span>}
// //                     </div>
// //                     </div>

// //                     <div className="form-row">
// //                     <div className="form-group">
// //                         <label htmlFor="score">Score *</label>
// //                         <input
// //                         type="number"
// //                         id="score"
// //                         name="score"
// //                         value={formData.score}
// //                         onChange={handleChange}
// //                         placeholder="0"
// //                         min="0"
// //                         step="0.5"
// //                         className={errors.score ? 'error' : ''}
// //                         />
// //                         {errors.score && <span className="error-message">{errors.score}</span>}
// //                     </div>

// //                     <div className="form-group">
// //                         <label htmlFor="bank_code">Kode Bank *</label>
// //                         <input
// //                         type="text"
// //                         id="bank_code"
// //                         name="bank_code"
// //                         value={formData.bank_code}
// //                         onChange={handleChange}
// //                         placeholder="Contoh: BNK001"
// //                         className={errors.bank_code ? 'error' : ''}
// //                         />
// //                         {errors.bank_code && <span className="error-message">{errors.bank_code}</span>}
// //                     </div>
// //                     </div>

// //                     <div className="form-row">
// //                     <div className="form-group">
// //                         <label htmlFor="category_id">Kategori *</label>
// //                         <select
// //                         id="category_id"
// //                         name="category_id"
// //                         value={formData.category_id}
// //                         onChange={handleChange}
// //                         className={errors.category_id ? 'error' : ''}
// //                         >
// //                         <option value="">Pilih Kategori</option>
// //                         {categories.map(category => (
// //                             <option key={category.uuid} value={category.uuid}>
// //                             {category.name}
// //                             </option>
// //                         ))}
// //                         </select>
// //                         {errors.category_id && <span className="error-message">{errors.category_id}</span>}
// //                     </div>

// //                     <div className="form-group">
// //                         <label htmlFor="parent_id">Soal Induk (Opsional)</label>
// //                         <select
// //                         id="parent_id"
// //                         name="parent_id"
// //                         value={formData.parent_id}
// //                         onChange={handleChange}
// //                         >
// //                         <option value="">Tidak ada induk</option>
// //                         {parentOptions.map(question => (
// //                             <option key={question.uuid} value={question.uuid}>
// //                             {question.bank_code} - {question.question.substring(0, 50)}...
// //                             </option>
// //                         ))}
// //                         </select>
// //                         <span className="help-text">Pilih soal yang menjadi induk (exclude diri sendiri)</span>
// //                     </div>
// //                     </div>

// //                     {/* Hidden fields for id and uuid */}
// //                     <input type="hidden" name="id" value={formData.id} />
// //                     <input type="hidden" name="uuid" value={formData.uuid} />

// //                     <div className="form-actions">
// //                     <button type="button" onClick={onCancel} className="btn-secondary">
// //                         Batal
// //                     </button>
// //                     <button type="button" onClick={handleReset} className="btn-reset">
// //                         Reset
// //                     </button>
// //                     <button type="submit" className="btn-primary">
// //                         {isEditing ? 'Update Soal' : 'Simpan Soal'}
// //                     </button>
// //                     </div>
// //                 </form>
// //                 {/* <form onSubmit={handleSubmit(updateExam)}>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
// //                     <InputText labelTitle="Nama" nameInput="name" defaultValue={exam.name} updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Deskripsi" nameInput="subtitle" defaultValue={exam.subtitle} updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/>
// //                     <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/>
// //                     <SelectBox
// //                         nameInput="scheme"
// //                         options={schemeOptions}
// //                         labelTitle="Skema Ujian"
// //                         placeholder="Pilih Skema"
// //                         containerStyle="w-72"
// //                         labelStyle="hidden"
// //                         defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     />
// //                     <InputTextRadio labelTitle="Tipe" nameInput="question_type" type="radio" options={typeOptions} defaultValue={exam.type?exam.type:'MC'} updateFormValue={updateFormValue}/>
// //                     <SelectBox 
// //                     options={schedulesOptions}
// //                     labelTitle="Period"
// //                     placeholder="Select date range"
// //                     containerStyle="w-72"
// //                     labelStyle="hidden"
// //                     // defaultValue="TODAY"
// //                     updateFormValue={updateSelectBoxValue}
// //                 />
// //                     <InputDateTimePicker labelTitle="Waktu Mulai" nameInput="started_at" updateFormValue={updateFormValue}/>
// //                     <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" updateFormValue={updateFormValue}/>
                    
// //                     <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Lokasi" nameInput="location" defaultValue={exam.location} updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Ruangan" nameInput="room" defaultValue={exam.room} updateFormValue={updateFormValue}/>
// //                     <ToogleInput updateType="randomQuestion" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
// //                     <ToogleInput updateType="randomAnswer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Acak Soal" type="radio" defaultValue={exam.is_random_question} updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue}/>
// //                     <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/>
// //                 </div>
// //                 <div className="divider" ></div>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                     <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
// //                     <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
// //                     </div>

// //                 <div className="mt-16"><button className="btn btn-primary float-right" type="submit" >Simpan</button></div>
// //                 </form>
// //                 onClick={() => updateSchedules()} */}
// //             </TitleCard>
            
// //         </>
// //     )
// // }
// // }


// // export default QuestionBankCreate