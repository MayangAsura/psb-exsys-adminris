import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../../components/Input/InputText'
import ErrorText from '../../../../components/Typography/ErrorText'
import SelectBox from "../../../../components/Input/SelectBox"
import InputDateTimePicker from "../../../../components/Input/InputDateTimePicker"
import ToogleInput from "../../../../components/Input/ToogleInput"
import { showNotification } from "../../../common/headerSlice"
import { addAdmissionSchool } from "../../../../services/api/admissions"
import supabase from "../../../../services/database-server"

const INITIAL_ADMISSION_SCHOOL = {
    admission_id : "",
    school_id : "",
    started_at : "",
    ended_at : "",
    admission_status : "",
    admission_fee : "",
    quota : ""
}

function DetailExamResponseModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [admissionSchool, setAdmissionSchool] = useState(INITIAL_ADMISSION_SCHOOL)
    const [responseData, setResponseData] = useState(null)
    const [questions, setQuestions] = useState([])
    const [schoolOptions, setSchoolOptions] = useState([])
    const { id, index } = extraObject

    useEffect(() => {
        getSchoolsOptions()
        if(index && id){
            getResponse(index)
        }
    }, [index, id])

    // Fixed: Complete getResponse function
    const getResponse = async (_id) => {
        setLoading(true)
        try {
            let { data: exam_responses, error } = await supabase
                .from('exam_test_responses')
                .select(`
                    *,
                    exam_tests(
                        name,
                        exam_test_contents(*),
                        exam_schedule_tests(
                            exam_schedules(
                                exam_schedule_schools(
                                    schools(school_name)
                                )
                            )
                        )
                    ),
                    exam_profiles(full_name, regist_number)
                `)
                .eq('exam_test_id', id)
                .eq('id', _id)

            if(error) throw error

            if(exam_responses && exam_responses.length > 0){
                const response = exam_responses[0]
                setResponseData(response)

                // Get questions with options and student responses
                if(response.exam_tests?.exam_test_contents) {
                    const questionsWithDetails = await Promise.all(
                        response.exam_tests.exam_test_contents.map(async (content) => {
                            const options = await getOptions(content.id)
                            const userResponse = await getUserResponse(content.id, _id)
                            
                            return {
                                ...content,
                                options: options,
                                user_answer: userResponse,
                                is_correct: userResponse === content.exam_content_option_id,
                                score: userResponse === content.exam_content_option_id ? content.score : 0
                            }
                        })
                    )
                    setQuestions(questionsWithDetails)
                }
            }
        } catch (error) {
            console.error('Error fetching response:', error)
            setErrorMessage("Gagal memuat data ujian")
        } finally {
            setLoading(false)
        }
    }

    // Fixed: getUserResponse function
    const getUserResponse = async (contentId, responseId) => {
        try {
            let { data: response_details, error } = await supabase
                .from('exam_test_response_details')
                .select('exam_content_option_id')
                .eq('exam_test_content_id', contentId)
                .eq('exam_test_response_id', responseId)
                .single()

            if(error) {
                console.log('No response found for question:', contentId)
                return null
            }
            
            return response_details?.exam_content_option_id
        } catch (error) {
            console.error('Error fetching user response:', error)
            return null
        }
    }

    // Fixed: getOptions function
    const getOptions = async (contentId) => {
        try {
            const { data: options, error } = await supabase
                .from('exam_test_content_options')
                .select('*')
                .eq('exam_test_content_id', contentId)
                .order('order', { ascending: true })

            if(error) throw error
            return options || []
        } catch (error) {
            console.error('Error loading options:', error)
            return []
        }
    }

    const getSchoolsOptions = async () => {
        try {
            let { data: schools, error } = await supabase
                .from('schools')
                .select('*')
            
            if(!error && schools){
                const options = schools.map(school => ({
                    name: school.school_id,
                    value: school.school_name
                }))
                setSchoolOptions(options)
            }
        } catch (error) {
            console.error('Error fetching schools:', error)
        }
    }

    const saveAdmissionSchool = async () => {
        try {
            setLoading(true)
            const response = await addAdmissionSchool({newAdmissionSchool: admissionSchool})
            
            if(response.error){
                dispatch(showNotification({message : "Gagal Menambahkan Jenjang PSB!", status : 0}))
            } else {
                dispatch(showNotification({message : "Berhasil Menambahkan Jenjang PSB!", status : 1}))
            }
            closeModal()
        } catch (error) {
            console.error('Error saving admission school:', error)
            dispatch(showNotification({message : "Terjadi kesalahan!", status : 0}))
        } finally {
            setLoading(false)
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    }

    const updateFormValue = ({updateType, nameInput=null, value}) => {
        setErrorMessage("")
        setAdmissionSchool({...admissionSchool, [updateType] : value})
    }

    const formatDateTime = (dateString) => {
        if(!dateString) return '-'
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    // Calculate total score
    // const totalScore = questions.reduce((sum, question) => sum + (question.is_correct ? question.score : 0), 0)

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Memuat data ujian...</span>
            </div>
        )
    }

    if (!responseData) {
        return (
            <div className="text-center py-8">
                <ErrorText>Data ujian tidak ditemukan</ErrorText>
            </div>
        )
    }

    return(
        <div className="max-h-96 overflow-y-auto">
            <div className="p-4">
                {/* <div className="exam-header mb-6"> */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Hasil Ujian Siswa</h1>
                    {/* <div className="student-info bg-gray-50 p-4 rounded-lg"> */}
                        <div className="flex flex-col justify-center items-start md:grid-cols-1  gap-4">
                            <div className="flex flex-row items-center">
                                <span className="label font-semibold text-gray-700">Nama Siswa:</span>
                                <span className=" ml-2 text-gray-900">{responseData.exam_profiles?.full_name || '-'}</span>
                            </div>
                            <div className="flex flex-row items-center">
                                <span className="label font-medium text-gray-700">No. Registrasi:</span>
                                <span className="value ml-2 text-gray-900">{responseData.exam_profiles?.regist_number || '-'}</span>
                            </div>
                            <div className="flex flex-row items-center">
                                <span className="label font-medium text-gray-700">Jenjang:</span>
                                <span className="value ml-2 text-gray-900">
                                    {responseData.exam_tests?.exam_schedule_tests?.[0]?.exam_schedules?.exam_schedule_schools?.[0]?.schools?.school_name || '-'}
                                </span>
                            </div>
                            <div className="flex flex-row items-center">
                                <span className="label font-medium text-gray-700">Total Skor:</span>
                                <span className="value ml-2 font-bold text-green-600 score-total">{responseData.user_score}</span>
                            </div>
                            <div className="flex flex-row items-center md:col-span-2">
                                <span className="label font-medium text-gray-700">Waktu Submit:</span>
                                <span className="value ml-2 text-gray-900">{formatDateTime(responseData.submit_at)}</span>
                            </div>
                        </div>
                    {/* </div> */}
                {/* </div> */}

                <div className="section my-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Jawaban</h2>
                    {questions.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            Tidak ada soal yang ditemukan
                        </div>
                    ) : (
                      <div className="question-item mb-6 p-4 border border-gray-200 rounded-lg">
                        {
                          questions.map((question, index) => (
                            <div key={question.id || index} className="mb-3">
                                <div className="question-header flex justify-between items-center mb-3">
                                    <span className="question-number font-medium text-gray-700">Soal {index + 1}</span>
                                    {/* <span className={`question-score px-2 py-1 rounded text-sm font-medium ${
                                        question.answer 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        Skor: /{question.score}
                                    </span> */}
                                </div>
                                
                                <div 
                                    className="question-text mb-4 text-gray-800" 
                                    dangerouslySetInnerHTML={{ __html: question.question }}
                                />
                                
                                <div className="options-list space-y-2">
                                    {question.options?.map((option, optIndex) => {
                                        const isCorrectAnswer = option.id === question.exam_content_option_id
                                        const isStudentAnswer = option.id === question.user_answer
                                        let optionClass = 'option p-2 rounded border '
                                        
                                        if (isCorrectAnswer && isStudentAnswer) {
                                            optionClass += 'bg-green-50 border-green-200 text-green-800'
                                        } else if (isCorrectAnswer) {
                                            optionClass += 'bg-green-50 border-green-200 text-green-800'
                                        } else if (isStudentAnswer) {
                                            optionClass += 'bg-red-50 border-red-200 text-red-800'
                                        } else {
                                            optionClass += 'bg-gray-50 border-gray-200 text-gray-700'
                                        }

                                        return (
                                            <div key={option.id || optIndex} className={optionClass}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <span className="option-letter font-medium mr-3">{option.order}.</span>
                                                        <span 
                                                            className="option-text"
                                                            dangerouslySetInnerHTML={{ __html: option.option }}
                                                        />
                                                    </div>
                                                    <div className="answer-indicators flex space-x-2">
                                                        {isCorrectAnswer && (
                                                            <span className="text-green-600 text-sm font-medium">✓ Jawaban Benar</span>
                                                        )}
                                                        {isStudentAnswer && !isCorrectAnswer && (
                                                            <span className="text-red-600 text-sm font-medium">✗ Jawaban Salah (0) </span>
                                                        )}
                                                        {isCorrectAnswer && isStudentAnswer && (
                                                            <span className="text-green-600 text-sm font-medium">✓ Benar {question.score} </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))
                        }
                      </div>
                        
                    )}
                </div>

                {errorMessage && (
                    <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
                )}

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                        className="btn btn-ghost hover:bg-gray-100"
                        onClick={closeModal}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetailExamResponseModalBody
// import { useEffect, useState } from "react"
// import { useDispatch } from "react-redux"
// import InputText from '../../../../components/Input/InputText'
// import ErrorText from '../../../../components/Typography/ErrorText'
// import SelectBox from "../../../../components/Input/SelectBox"
// import InputDateTimePicker from "../../../../components/Input/InputDateTimePicker"
// import ToogleInput from "../../../../components/Input/ToogleInput"
// import { showNotification } from "../../../common/headerSlice"
// import { addAdmissionSchool } from "../../../../services/api/admissions"
// import supabase from "../../../../services/database-server"
// // import { addNewLead } from "../leadSlice"

// const INITIAL_ADMISSION_SCHOOL = {
//     admission_id : "",
//     school_id : "",
//     started_at : "",
//     ended_at : "",
//     admission_status : "",
//     admission_fee : "",
//     quota : ""
// }

// function DetailExamResponseModalBody({closeModal, extraObject}){
//     const dispatch = useDispatch()
//     const [loading, setLoading] = useState(false)
//     const [errorMessage, setErrorMessage] = useState("")
//     const [admissionSchool, setAdmissionSchool] = useState(INITIAL_ADMISSION_SCHOOL)
//     const [responseData, setResponseData] = useState({})
//     const [questions, setQuestions] = useState([])
//     const [schoolOptions, setSchoolOptions] = useState([])
//     const { id, index } = extraObject

//     useEffect(() => {
//         getSchoolsOptions()
//         getResponse(index)
//         getExamQuestion(id)
//         console.log(index)
//         if(index){
//             setAdmissionSchool({...addAdmissionSchool, admission_id: index})
//         }
//     }, [index])

//     const getExamQuestion = async(id) => {
//       let { data: exam_responses, error } = await supabase
//             .from('exam_test_contents')
//             .select('*')
//             .eq('exam_test_id', id)
//             .is('deleted_at', null)

//         if(!error){
//         // setQuestions(prev => [...prev: exam_responses])
//         const responseData = exam_responses.map(async (value) => ({
//           ...value,
//           user_response: await getUserResponse(value.id)
//         }))

//         setQuestions(responseData)
//         }
//     }

//     const getUserResponse = async (id_) => {
//       let { data: exam_responses, error } = await supabase
//             .from('exam_test_response_details')
//             .select('*')
//             .eq('exam_test_content_id', id_)
//             .eq('exam_test_response_id', index)

//             console.log('exam_responses', exam_responses)

//         if(!error){
//           return exam_responses[1]?.exam_content_option_id
//           // return exam_responses[0].exam_test_response_details[0]?.exam_test_content_option_id
//         }
//     }

//     const getResponse = async (_id) => {
//       let { data: exam_responses, error } = await supabase
//             .from('exam_test_responses')
//             .select('*, exam_tests(name, exam_test_contents(*), exam_schedule_tests(exam_schedules(exam_schedule_schools(schools(school_name)) ) )), exam_profiles(full_name, regist_number)')
//             .eq('exam_test_id', id)
//             .eq('id', _id)

//         if(!error && exam_responses && exam_responses.length>0){
//         setResponseData(exam_responses[0])
//         const questionsWithOptions = await 
//           exam_responses[0].exam_test_contents?.map(async (content) => ({
//             ...content,
//             options: await getOptions(content.id),
//             num: questions.indexOf(content) + 1,
//           }))
//         // );
        
//         setResponseData( exam_responses[0]?.map(value => {return {
//           ...value, questions: questionsWithOptions
//         }} ));
//         }
//     }
//     const getOptions = async (contentId) => {
//     try {
//       const { data: options, error } = await supabase
//         .from('exam_test_content_options')
//         .select('*')
//         .eq('exam_test_content_id', contentId);
//       return error ? [] : options;
//     } catch (error) {
//       console.error('Error loading options:', error);
//       return [];
//     }
//   };
//     const saveAdmissionSchool = async () => {
//         // if(admissionSchool.school_id.trim() === "")return setErrorMessage("First Name is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else{
//             // let newAdmissionSchool = {
//             //     "id": 7,
//             //     "email": admissionSchool.email,
//             //     "first_name": admissionSchool.first_name,
//             //     "last_name": admissionSchool.last_name,
//             //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
//             // }
//             // setAdmissionSchool({...admissionSchool, admission_id: index})
//             console.log(admissionSchool)
            
//             const response = await addAdmissionSchool({newAdmissionSchool: admissionSchool})
//             console.log(response)
//             if(response.error){
//                 dispatch(showNotification({message : "Gagal Menambahkan Jenjang PSB!", status : 0}))

//             }else{
//                 dispatch(showNotification({message : "Berhasil Menambahkan Jenjang PSB!", status : 1}))
//             }
//             closeModal()
//         // }
//     }

//     const getSchoolsOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('schools')
//             .select('*')
//             console.log(schools)
//             if(!error){
//                 setSchoolOptions(schools)
//                 schools.map((e)=>(
//                         // setScheduleOptions( e => {
//                         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
//                     ))
//                     console.log(schoolOptions)
//             // //     // schedulesOptions e.name

//             // }))
//             // name: schedule
//             // setScheduleOptions(schedule => {.})
//         }
//     }

//     const updateFormValue = ({updateType, nameInput=null, value}) => {
//         setErrorMessage("")
//         setAdmissionSchool({...admissionSchool, [updateType] : value})
//         console.log(admissionSchool)
//     }

//     const formatDateTime = (dateString) => {
//       const date = new Date(dateString);
//       const options = {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         timeZone: 'Asia/Jakarta'
//       };
//       return date.toLocaleDateString('id-ID', options);
//     };

//     // if (!responseData) {
//     //   return <div>Loading data ujian...</div>;
//     // }

//     // const {
//     //   full_name,
//     //   school_name,
//     //   questions,
//     //   total_score,
//     //   submit_at
//     // } = responseData;
  
//     return(
//         <>

//           <div className="exam-results-container">
//             <div className="exam-header">
//               <h1>Hasil Ujian Siswa</h1>
//               <div className="student-info">
//                 <div className="info-row">
//                   <span className="label">Nama Siswa:</span>
//                   <span className="value">{responseData.exam_profiles?.full_name}</span>
//                 </div>
//                 <div className="info-row">
//                   <span className="label">Jenjang:</span>
//                   <span className="value">{responseData.exam_tests?.exam_schedule_tests[0]?.exam_schedules.exam_schedule_schools[0]?.schools?.school_name}</span>
//                 </div>
//                 <div className="info-row">
//                   <span className="label">Total Skor:</span>
//                   <span className="value score-total">{responseData.score}</span>
//                 </div>
//                 <div className="info-row">
//                   <span className="label">Waktu Submit:</span>
//                   <span className="value">{formatDateTime(responseData.submit_at)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="questions-list">
//               <h2>Detail Jawaban</h2>
//               {questions.map((question, index) => (
//                 <div key={question.id || index} className="question-item">
//                   <div className="question-header">
//                     <span className="question-number">Soal {index + 1}</span>
//                     <span className={`question-score ${question.answer ? 'Benar' : 'Salah'}`}>
//                       Skor: {question.score}
//                     </span>
//                   </div>
                  
//                   <p className="question-text">{question.question}</p>
                  
//                   <div className="options-list">
//                     {question.options?.map((option, optIndex) => {
//                       const isCorrectAnswer = option.id === question.exam_content_option_id;
//                       const isStudentAnswer = option.option === question.user_answer;
//                       let optionClass = 'option';
                      
//                       if (isCorrectAnswer && isStudentAnswer) {
//                         optionClass += ' correct-answer';
//                       } else if (isCorrectAnswer) {
//                         optionClass += ' correct-answer';
//                       } else if (isStudentAnswer) {
//                         optionClass += ' student-answer';
//                       }

//                       return (
//                         <div key={optIndex} className={optionClass}>
//                           <span className="option-letter">{option.order}.</span>
//                           <span className="option-text">{option.text}</span>
//                           {isCorrectAnswer && !isStudentAnswer && (
//                             <span className="answer-indicator">(Jawaban Benar)</span>
//                           )}
//                           {isStudentAnswer && !isCorrectAnswer && (
//                             <span className="answer-indicator">(Salah)</span>
//                           )}
//                           {isCorrectAnswer && isStudentAnswer && (
//                             <span className="answer-indicator">(Benar)</span>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
            
//         </>
//     )
// }

// export default DetailExamResponseModalBody

// // import React from 'react';
// // import '../../../test-result.css'

// // const ExamResults = ({ responseData }) => {
// //   // Format date to Indonesian format
// //   const formatDateTime = (dateString) => {
// //     const date = new Date(dateString);
// //     const options = {
// //       weekday: 'long',
// //       year: 'numeric',
// //       month: 'long',
// //       day: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       timeZone: 'Asia/Jakarta'
// //     };
// //     return date.toLocaleDateString('id-ID', options);
// //   };

// //   if (!responseData) {
// //     return <div>Loading data ujian...</div>;
// //   }

// //   const {
// //     full_name,
// //     school_name,
// //     questions,
// //     total_score,
// //     submit_at
// //   } = responseData;

// //   return (
// //     <div className="exam-results-container">
// //       <div className="exam-header">
// //         <h1>Hasil Ujian Siswa</h1>
// //         <div className="student-info">
// //           <div className="info-row">
// //             <span className="label">Nama Siswa:</span>
// //             <span className="value">{full_name}</span>
// //           </div>
// //           <div className="info-row">
// //             <span className="label">Sekolah:</span>
// //             <span className="value">{school_name}</span>
// //           </div>
// //           <div className="info-row">
// //             <span className="label">Total Score:</span>
// //             <span className="value score-total">{total_score}</span>
// //           </div>
// //           <div className="info-row">
// //             <span className="label">Waktu Submit:</span>
// //             <span className="value">{formatDateTime(submit_at)}</span>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="questions-list">
// //         <h2>Detail Jawaban</h2>
// //         {questions.map((question, index) => (
// //           <div key={question.id || index} className="question-item">
// //             <div className="question-header">
// //               <span className="question-number">Soal {index + 1}</span>
// //               <span className={`question-score ${question.is_correct ? 'correct' : 'wrong'}`}>
// //                 Score: {question.score}
// //               </span>
// //             </div>
            
// //             <p className="question-text">{question.text}</p>
            
// //             <div className="options-list">
// //               {question.options.map((option, optIndex) => {
// //                 const isCorrectAnswer = option.letter === question.correct_answer;
// //                 const isStudentAnswer = option.letter === question.student_answer;
// //                 let optionClass = 'option';
                
// //                 if (isCorrectAnswer && isStudentAnswer) {
// //                   optionClass += ' correct-answer';
// //                 } else if (isCorrectAnswer) {
// //                   optionClass += ' correct-answer';
// //                 } else if (isStudentAnswer) {
// //                   optionClass += ' student-answer';
// //                 }

// //                 return (
// //                   <div key={optIndex} className={optionClass}>
// //                     <span className="option-letter">{option.letter}.</span>
// //                     <span className="option-text">{option.text}</span>
// //                     {isCorrectAnswer && !isStudentAnswer && (
// //                       <span className="answer-indicator">(Jawaban Benar)</span>
// //                     )}
// //                     {isStudentAnswer && !isCorrectAnswer && (
// //                       <span className="answer-indicator">(Jawaban Siswa)</span>
// //                     )}
// //                     {isCorrectAnswer && isStudentAnswer && (
// //                       <span className="answer-indicator">(Benar)</span>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // // Example data structure for props
// // ExamResults.defaultProps = {
// //   responseData: {
// //     siswa_full_name: "Ahmad Rizky",
// //     school_name: "SMA Negeri 1 Jakarta",
// //     total_score: 85,
// //     submit_at: "2024-01-15T14:30:00Z",
// //     questions: [
// //       {
// //         id: 1,
// //         text: "Apa ibukota Indonesia?",
// //         score: 10,
// //         correct_answer: "C",
// //         student_answer: "C",
// //         options: [
// //           { letter: "A", text: "Surabaya" },
// //           { letter: "B", text: "Bandung" },
// //           { letter: "C", text: "Jakarta" },
// //           { letter: "D", text: "Medan" }
// //         ]
// //       },
// //       {
// //         id: 2,
// //         text: "Planet terdekat dengan matahari adalah?",
// //         score: 0,
// //         correct_answer: "A",
// //         student_answer: "B",
// //         options: [
// //           { letter: "A", text: "Merkurius" },
// //           { letter: "B", text: "Venus" },
// //           { letter: "C", text: "Bumi" },
// //           { letter: "D", text: "Mars" }
// //         ]
// //       },
// //       {
// //         id: 3,
// //         text: "2 + 2 x 2 = ?",
// //         score: 10,
// //         correct_answer: "D",
// //         student_answer: "D",
// //         options: [
// //           { letter: "A", text: "6" },
// //           { letter: "B", text: "8" },
// //           { letter: "C", text: "10" },
// //           { letter: "D", text: "6 (dengan operasi yang benar)" }
// //         ]
// //       }
// //     ]
// //   }
// // };

// // export default ExamResults;