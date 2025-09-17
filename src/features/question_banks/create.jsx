import React, { useState, useEffect } from 'react';
// import './QuestionForm.css';

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
    parent_id: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Filter out current question from parent options
  const parentOptions = questionsBank.filter(question => 
    question.uuid !== formData.uuid
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Pertanyaan wajib diisi';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Jawaban wajib diisi';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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
      parent_id: ''
    });
    setErrors({});
  };

  return (
    <div className="question-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Soal' : 'Tambah Soal Baru'}</h2>
        <p>Kelola data soal bank pertanyaan</p>
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="question">Pertanyaan *</label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Masukkan pertanyaan..."
              rows="4"
              className={errors.question ? 'error' : ''}
            />
            {errors.question && <span className="error-message">{errors.question}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="answer">Jawaban *</label>
            <input
              type="text"
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Masukkan jawaban..."
              className={errors.answer ? 'error' : ''}
            />
            {errors.answer && <span className="error-message">{errors.answer}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipe Pertanyaan *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? 'error' : ''}
            >
              <option value="">Pilih Tipe</option>
              <option value="multiple_choice">Pilihan Ganda</option>
              <option value="essay">Essay</option>
              <option value="true_false">Benar/Salah</option>
              <option value="fill_blank">Isian</option>
            </select>
            {errors.type && <span className="error-message">{errors.type}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="score">Score *</label>
            <input
              type="number"
              id="score"
              name="score"
              value={formData.score}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.5"
              className={errors.score ? 'error' : ''}
            />
            {errors.score && <span className="error-message">{errors.score}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="bank_code">Kode Bank *</label>
            <input
              type="text"
              id="bank_code"
              name="bank_code"
              value={formData.bank_code}
              onChange={handleChange}
              placeholder="Contoh: BNK001"
              className={errors.bank_code ? 'error' : ''}
            />
            {errors.bank_code && <span className="error-message">{errors.bank_code}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category_id">Kategori *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={errors.category_id ? 'error' : ''}
            >
              <option value="">Pilih Kategori</option>
              {categories.map(category => (
                <option key={category.uuid} value={category.uuid}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <span className="error-message">{errors.category_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="parent_id">Soal Induk (Opsional)</label>
            <select
              id="parent_id"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleChange}
            >
              <option value="">Tidak ada induk</option>
              {parentOptions.map(question => (
                <option key={question.uuid} value={question.uuid}>
                  {question.bank_code} - {question.question.substring(0, 50)}...
                </option>
              ))}
            </select>
            <span className="help-text">Pilih soal yang menjadi induk (exclude diri sendiri)</span>
          </div>
        </div>

        {/* Hidden fields for id and uuid */}
        <input type="hidden" name="id" value={formData.id} />
        <input type="hidden" name="uuid" value={formData.uuid} />

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Batal
          </button>
          <button type="button" onClick={handleReset} className="btn-reset">
            Reset
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Soal' : 'Simpan Soal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
// import moment from "moment"
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import TitleCard from "../../components/Cards/TitleCard"
// import { showNotification } from '../common/headerSlice'
// import InputText from '../../components/Input/InputText'
// import InputTextRadio from '../../components/Input/InputTextRadio'
// import SelectBox from "../../components/Input/SelectBox"
// import TextAreaInput from '../../components/Input/TextAreaInput'
// import ToogleInput from '../../components/Input/ToogleInput'
// import InputDateTime from "../../components/Input/InputDateTime"
// import { useForm } from "react-hook-form"

// import './custom-styles/style.css'

// import supabase from "../../services/database-server"
// import {addExam} from "../../services/api/exams"

// import DateTimePicker from 'react-datetime-picker'
// import { useParams } from "react-router-dom"
// import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// // import DatePicker from 'rsuite/DatePicker';
// // import 'rsuite/DatePicker/styles/index.css';
// // importing styling datepicker
// // import "./css/react-datepicker/react-datepicker.css"

// import axios from "axios"
// import schools from "../../services/api/schools"
// // import supabase from "../services/database"

// // type ValuePiece = Date | null

// // type Value = ValuePiece | [ValuePiece, ValuePiece]

// function QuestionBankCreate(){

//     const dispatch = useDispatch()
//     const [value, onChange] = useState(new Date())
    
//     const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" })
//     // exam_category_id: "",
//     // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
//     const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
//     const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
//     const [selectedOption, setSelectedOption] = useState(null);
//     const checked = false
//     // const {register, handleSubmit} = useForm()
//     // const {id} = useParams()


//     useEffect( () => {
//         // getSchoolsOptions()
//         // getSchedule()
//         // console.log(id)
//         console.log(exam)
//     },[])

//     const QuestionForm = ({ 
//         initialData = null, 
//         questionsBank = [], 
//         categories = [], 
//         onSubmit, 
//         onCancel 
//         }) => {
//         const [formData, setFormData] = useState({
//             id: '',
//             uuid: '',
//             question: '',
//             answer: '',
//             type: '',
//             score: '',
//             bank_code: '',
//             category_id: '',
//             parent_id: ''
//         });

//         const [errors, setErrors] = useState({});
//         const [isEditing, setIsEditing] = useState(false);

//         // Filter out current question from parent options
//         const parentOptions = questionsBank.filter(question => 
//             question.uuid !== formData.uuid
//         );

//         useEffect(() => {
//             if (initialData) {
//             setFormData(initialData);
//             setIsEditing(true);
//             }
//         }, [initialData]);

//         const handleChange = (e) => {
//             const { name, value } = e.target;
//             setFormData(prev => ({
//             ...prev,
//             [name]: value
//             }));

//             // Clear error when field is changed
//             if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//             }
//         };

//         const validateForm = () => {
//             const newErrors = {};

//             if (!formData.question.trim()) {
//             newErrors.question = 'Pertanyaan wajib diisi';
//             }

//             if (!formData.answer.trim()) {
//             newErrors.answer = 'Jawaban wajib diisi';
//             }

//             if (!formData.type.trim()) {
//             newErrors.type = 'Tipe wajib diisi';
//             }

//             if (!formData.score || isNaN(formData.score) || formData.score <= 0) {
//             newErrors.score = 'Score harus berupa angka positif';
//             }

//             if (!formData.bank_code.trim()) {
//             newErrors.bank_code = 'Kode bank wajib diisi';
//             }

//             if (!formData.category_id) {
//             newErrors.category_id = 'Kategori wajib dipilih';
//             }

//             setErrors(newErrors);
//             return Object.keys(newErrors).length === 0;
//         };

//         const handleSubmit = (e) => {
//             e.preventDefault();
            
//             if (validateForm()) {
//             onSubmit(formData);
//             }
//         };

//         const handleReset = () => {
//             setFormData(initialData || {
//             id: '',
//             uuid: '',
//             question: '',
//             answer: '',
//             type: '',
//             score: '',
//             bank_code: '',
//             category_id: '',
//             parent_id: ''
//             });
//             setErrors({});
//         };


//     // Call API to update profile settings changes
//     const updateExam = async (e) => {
//         // e.preventDefault()
//         console.log(exam)
//         // const {school_id, ...newSchedule} = exa
//         const response = await addExam({exam})
//         // const {error, message, data} = await addExam({exam})
//         console.log('response', response)
//         // console.log('message', message)
//         if(!response || response==null || response.error){
//             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
//         }else if(!response.error) {
//             console.log("masuk")
//             dispatch(showNotification({message : response.message, status : 1}))
//         }else{
//             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
//         }
//     }
 
//     // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
//     //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
//     //     // console.log(updateType)
//     // }
//     const updateFormValue = ({updateType, nameInput, value}) => {
//         console.log('nameInput', nameInput, value)
//         exam[nameInput] = value
//         console.log('exam>', exam)
//         // setSchedule( (data) =>  ({...data, [nameInput]: value}))

//         // console.log(updateType)
//     }

//     const getSchoolsOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('schools')
//             .select('*')
//             console.log(schools)
//             if(!error){
//                 // setSchoolOptions(schools)
//                 // schools.map((e)=>(
//                 //         // setScheduleOptions( e => {
//                 //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
//                 //     ))
//                     // console.log(schoolOptions)
//             // //     // schedulesOptions e.name

//             // }))
//             // name: schedule
//             // setScheduleOptions(schedule => {.})
//         }
//     }

//     // const handledSubmit = (e) => {
//     //     e.preventDefault()


//     // }



//     const schedulesOptions2 = [
//         {name : "Today", value : "TODAY"},
//         {name : "Yesterday", value : "YESTERDAY"},
//         {name : "This Week", value : "THIS_WEEK"},
//         {name : "Last Week", value : "LAST_WEEK"},
//         {name : "This Month", value : "THIS_MONTH"},
//         {name : "Last Month", value : "LAST_MONTH"},
//     ]

//     return(
//         <>
            
//             <TitleCard title="Tambah Soal" topMargin="mt-2">

//                 <form onSubmit={handleSubmit} className="question-form">
//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="question">Pertanyaan *</label>
//                         <textarea
//                         id="question"
//                         name="question"
//                         value={formData.question}
//                         onChange={handleChange}
//                         placeholder="Masukkan pertanyaan..."
//                         rows="4"
//                         className={errors.question ? 'error' : ''}
//                         />
//                         {errors.question && <span className="error-message">{errors.question}</span>}
//                     </div>
//                     </div>

//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="answer">Jawaban *</label>
//                         <input
//                         type="text"
//                         id="answer"
//                         name="answer"
//                         value={formData.answer}
//                         onChange={handleChange}
//                         placeholder="Masukkan jawaban..."
//                         className={errors.answer ? 'error' : ''}
//                         />
//                         {errors.answer && <span className="error-message">{errors.answer}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="type">Tipe Pertanyaan *</label>
//                         <select
//                         id="type"
//                         name="type"
//                         value={formData.type}
//                         onChange={handleChange}
//                         className={errors.type ? 'error' : ''}
//                         >
//                         <option value="">Pilih Tipe</option>
//                         <option value="multiple_choice">Pilihan Ganda</option>
//                         <option value="essay">Essay</option>
//                         <option value="true_false">Benar/Salah</option>
//                         <option value="fill_blank">Isian</option>
//                         </select>
//                         {errors.type && <span className="error-message">{errors.type}</span>}
//                     </div>
//                     </div>

//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="score">Score *</label>
//                         <input
//                         type="number"
//                         id="score"
//                         name="score"
//                         value={formData.score}
//                         onChange={handleChange}
//                         placeholder="0"
//                         min="0"
//                         step="0.5"
//                         className={errors.score ? 'error' : ''}
//                         />
//                         {errors.score && <span className="error-message">{errors.score}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="bank_code">Kode Bank *</label>
//                         <input
//                         type="text"
//                         id="bank_code"
//                         name="bank_code"
//                         value={formData.bank_code}
//                         onChange={handleChange}
//                         placeholder="Contoh: BNK001"
//                         className={errors.bank_code ? 'error' : ''}
//                         />
//                         {errors.bank_code && <span className="error-message">{errors.bank_code}</span>}
//                     </div>
//                     </div>

//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="category_id">Kategori *</label>
//                         <select
//                         id="category_id"
//                         name="category_id"
//                         value={formData.category_id}
//                         onChange={handleChange}
//                         className={errors.category_id ? 'error' : ''}
//                         >
//                         <option value="">Pilih Kategori</option>
//                         {categories.map(category => (
//                             <option key={category.uuid} value={category.uuid}>
//                             {category.name}
//                             </option>
//                         ))}
//                         </select>
//                         {errors.category_id && <span className="error-message">{errors.category_id}</span>}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="parent_id">Soal Induk (Opsional)</label>
//                         <select
//                         id="parent_id"
//                         name="parent_id"
//                         value={formData.parent_id}
//                         onChange={handleChange}
//                         >
//                         <option value="">Tidak ada induk</option>
//                         {parentOptions.map(question => (
//                             <option key={question.uuid} value={question.uuid}>
//                             {question.bank_code} - {question.question.substring(0, 50)}...
//                             </option>
//                         ))}
//                         </select>
//                         <span className="help-text">Pilih soal yang menjadi induk (exclude diri sendiri)</span>
//                     </div>
//                     </div>

//                     {/* Hidden fields for id and uuid */}
//                     <input type="hidden" name="id" value={formData.id} />
//                     <input type="hidden" name="uuid" value={formData.uuid} />

//                     <div className="form-actions">
//                     <button type="button" onClick={onCancel} className="btn-secondary">
//                         Batal
//                     </button>
//                     <button type="button" onClick={handleReset} className="btn-reset">
//                         Reset
//                     </button>
//                     <button type="submit" className="btn-primary">
//                         {isEditing ? 'Update Soal' : 'Simpan Soal'}
//                     </button>
//                     </div>
//                 </form>
//                 {/* <form onSubmit={handleSubmit(updateExam)}>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                     <InputText labelTitle="Nama" nameInput="name" defaultValue={exam.name} updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Deskripsi" nameInput="subtitle" defaultValue={exam.subtitle} updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/>
//                     <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/>
//                     <SelectBox
//                         nameInput="scheme"
//                         options={schemeOptions}
//                         labelTitle="Skema Ujian"
//                         placeholder="Pilih Skema"
//                         containerStyle="w-72"
//                         labelStyle="hidden"
//                         defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     />
//                     <InputTextRadio labelTitle="Tipe" nameInput="question_type" type="radio" options={typeOptions} defaultValue={exam.type?exam.type:'MC'} updateFormValue={updateFormValue}/>
//                     <SelectBox 
//                     options={schedulesOptions}
//                     labelTitle="Period"
//                     placeholder="Select date range"
//                     containerStyle="w-72"
//                     labelStyle="hidden"
//                     // defaultValue="TODAY"
//                     updateFormValue={updateSelectBoxValue}
//                 />
//                     <InputDateTimePicker labelTitle="Waktu Mulai" nameInput="started_at" updateFormValue={updateFormValue}/>
//                     <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" updateFormValue={updateFormValue}/>
                    
//                     <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Lokasi" nameInput="location" defaultValue={exam.location} updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Ruangan" nameInput="room" defaultValue={exam.room} updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="randomQuestion" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="randomAnswer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Acak Soal" type="radio" defaultValue={exam.is_random_question} updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue}/>
//                     <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/>
//                 </div>
//                 <div className="divider" ></div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
//                     </div>

//                 <div className="mt-16"><button className="btn btn-primary float-right" type="submit" >Simpan</button></div>
//                 </form>
//                 onClick={() => updateSchedules()} */}
//             </TitleCard>
            
//         </>
//     )
// }
// }


// export default QuestionBankCreate