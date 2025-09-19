import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import {addQuestion} from "../../../services/api/questions"
// import { addNewLead } from "../leadSlice"
import { openModal } from "../../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'
// import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import FileUploads from "./FileUploads"
// import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil"
import { useNavigate } from "react-router-dom"
import supabase from "../../../services/database-server"

// const INITIAL_PARTICIPANT_OBJ = {
//     phone_number : "",
//     regist_number : "",
//     school : ""
//     // bank_code : ""
// }
// INITIAL_PARTICIPANT_OBJ
function ImportQuestionModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    // const [question, setquestion] = useState({})
    const [options, setOptions] = useState([])
    const [schedule, setSchedule] = useState({})
    const { type, index, sid } = extraObject
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([]);
      const [file, setFile] = useState(null);
      const [error, setError] = useState("")
      const [dataImport, setDataImport] = useState([])
      const [i, setIndex] = useState(0)
      let lengthPart = questions.length

    //   let i
    //   let dataImport

    useEffect(() =>{
        // if(status){

//         // }
//         console.log(sid)
//         if(sid){
// // console.log('masuk')
//             // getScheduleMax(sid)
//         }
//         if(dataImport){
//             setQuestions(dataImport)
//         }
    },[])

    const getScheduleMax = async (sid) => {
        const {data: sch , err } = await supabase.from('exam_schedules')
                        .select('*')
                        .eq('id', sid)
        if(!err){
            console.log('sch', sch[0])
            setSchedule(sch[0])
            console.log('schedule', schedule)
        }
    }

    

  const fetchTodos = async (query = "")=> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("fetched todos");

//   const filteredTodos = todos.filter((todo) =>
//     todo.title.toLowerCase().includes(query.toLowerCase())
//   );

  // Uncomment the line below to trigger an error
  // throw new Error();

//   return [...filteredTodos];
};

const { data: questionsI, isLoading } = useQuery({
                            queryKey: ["questions", { search, questions, lengthPart, i }],
                            queryFn: () => addQuestion({search, questions: questions, options: options, lengthPart: questions.length , i: i}),
                            staleTime: Infinity,
                            cacheTime: 0,
                        });
                        //   : question, lengthPart: questions.length, i: index

                        const { mutateAsync: addTodoMutation } = useMutation({
                            mutationFn: addQuestion,
                            onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["questions", { search, questions, options,lengthPart, i }] });
                            },
                        });
    const saveImport = (data) => {
        console.log('in save', data)
        // setData(questions)

        // const saveNewquestions = async (questions) => {
            // const max_questions = 
            // if(!dataImport || dataImport.length == 0){
            //     dispatch(showNotification({message : "Gagal Import Data Peserta. Data tidak valid.", status : 0}))
            //     closeModal()
            // }
            setTimeout(() => {
              setQuestions(data)
              
            }, 500);
            // const newDataImport = removeDuplicates(dataImport)
            // setQuestions(newDataImport)
            
            console.log('questions', questions, dataImport)
            if(data.length == 0){
                // dispatch(showNotification({message : "Jumlah peserta melebihi batas maksimal. Mohon periksa batas maksimal peserta pada jadwal ini.", status : 0}))
                // closeModal()
                dispatch(showNotification({message : "Gagal Import Data Pertanyaan. Data tidak valid.", status : 0}))
                closeModal()
                setError(true)
            }else{
                // set
                        let total_imported = 0
                        let final_res = {}
                        let invalidData = []
                        let importedData = []
                        let options_ = []
                          if(!error){
                              setTimeout(() => {
                                data.forEach((question, index) => {
                                    // setQuestions(question)
                                    setIndex(index)
                                    // question.OPTION_`${index+1}` 
                                    // Object.entries(([key, value]) => ())
                                      // const newQuestion =  Array.prototype.map(question => {return {exam_test_id: index, question: question.QUESTION, answer: question.ANSWER, score: question.SCORE, bank_core: question.BANK_CODE, type: question.TYPE }})
                                      const {OPTION_1, OPTION_2, OPTION_3, OPTION_4, OPTION_5, OPTION_ANSWER, ...newData} = question
                                      const newQuestion = Object.fromEntries(Object.entries(newData).map(([key, value]) => {
                                        // if (key === "") {
                                          //   return ["newKey1", value]; // Rename oldKey1 to newKey1
                                          // }
                                          return [key.toLowerCase(), value]; // Keep other keys as they are
                                        }))
                                        if(OPTION_ANSWER ==1){
                                          OPTION_ANSWER = OPTION_1
                                        }
                                        if(OPTION_ANSWER ==2){
                                          OPTION_ANSWER = OPTION_2
                                        }
                                        if(OPTION_ANSWER ==3){
                                          OPTION_ANSWER = OPTION_3
                                        }
                                        if(OPTION_ANSWER ==4){
                                          OPTION_ANSWER = OPTION_4
                                        }
                                        if(OPTION_ANSWER ==5){
                                          OPTION_ANSWER = OPTION_5
                                        }
                                      // const newQuestion = newData.
                                        setQuestions({...newQuestion, answer: OPTION_ANSWER, exam_test_id: index})
                                        // for (let index = 0; index < array.length; index++) {
                                          //   const element = array[index];
                                          // question.
                                          // }
                                          
                                          // question.forEach(e => {
                                            
                                            options.push(OPTION_1)
                                            options.push(OPTION_2)
                                            options.push(OPTION_3)
                                            options.push(OPTION_4)
                                            options.push(OPTION_5)
                                            // });
                                            
                                            
                                            const newOptions = options.map(e => {
                                              return {
                                                // exam_test_content_id: 
                                                option: e,
                                                type: 'MC'
                                              }
                                            })
                                            setOptions(newOptions)
                                            // if(question.questions.trim() === "")return '' 
                                            console.log('question', question, questions, options)
                    //   props.setErrorMessage("Pertanyaan is required!")
                    //   else if(question.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
                    //   else if(question.score.trim() === "")return setErrorMessage("Email id is required!")
                    //   else if(question.bank_code.trim() === "")return setErrorMessage("Email id is required!")
                      // else if(question.email.trim() === "")return setErrorMessage("Email id is required!")
                      // else if(question.email.trim() === "")return setErrorMessage("Email id is required!")
                      // else{
                          // let newquestion = {
                          //     "id": 7,
                          //     "email": question.email,
                          //     "first_name": question.first_name,
                          //     "last_name": question.last_name,
                          //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
                          // }
                              // console.log(question)
                              // const options = question.option+ '_'+ index
                              // const {NO_WA, NO_REGISTRASI, NAMA, JENJANG} = question
                              // const newquestion = {
                              //   phone_number: NO_WA,
                                
                              // }
            
                            //   const response = addquestions({questions: question, lengthPart: questions.length, i: index})
                            // onClick={async () => {
                            
                try {
                addTodoMutation({ questions: questions, options: options, lengthPart: questions.length, i: index});
                  setDataImport("");
                  console.log('questionsI', questionsI)
                  if(questionsI.error!==true){
                    console.log( 'inv',questionsI.data.invalidData[0].parts)
                    console.log( 'imp', questionsI.data.importedData[0].parts)
                    invalidData.push(questionsI.data.invalidData[0].parts)
                    importedData.push(questionsI.data.importedData[0].parts)
                    total_imported++
                  }
                            //   // console.log('message', message)
                    final_res = questionsI
                } catch (e) {
                  console.log(e);
                }
            //   }}
                            
                                      // const {error, message, data} = await addExam({exam})
                            //   console.log('response', questionsI)
                              
                              // dispatch(addNewLead({newquestion}))
                              // dispatch(showNotification({message : "New Lead Added!", status : 1}))
                            // }
                            
                        });
                              }, 3000);

                          }
              
                          if(questions.length > 0 && questionsI){
            if(!questionsI || questionsI==null || questionsI.error===true){
                console.log(questionsI)
                              // dispatch(showNotification({message : "Gagal Import Data Peserta", status : 0}))
                              setTimeout(() => {
                                
                                if(total_imported>0){
                                    dispatch(openModal({title : "Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
                                        extraObject : {message : "Total data : "+ (total_imported==0?importedData.length:total_imported) + (invalidData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(invalidData.map((val)=> val.parts).join(', ')) + (importedData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(importedData.map((val)=> val.parts).join(', ')) : ""): "")
                                          , 
                                          type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_SUCCESS, index: index}
                                      }))
                                }else{
                                    dispatch(openModal({title : "Gagal", bodyType : MODAL_BODY_TYPES.MODAL_ERROR, size: 'sm',
                                        extraObject : {message : "Pesan error: "+ questionsI.message + ", Total data : "+ (total_imported==0?importedData.length:total_imported) + (invalidData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(invalidData.map((val)=> val.parts).join(', ')) + (importedData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(importedData.map((val)=> val.parts).join(', ')) : ""): "")
                                          , 
                                          type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_ERROR, index: index}
                                      }))
                                }
                                    setStatus(false)
                                    setQuestions([])
                                    setQuestions([])
                              }, 3000);
                          }else if(questionsI.error === false) {
                              console.log("masuk")
                              // total_imported++
                              // dispatch(showNotification({message : response.message, status : 1}))
                              dispatch(openModal({title : "Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
                                  extraObject : {message : total_imported==0?importedData.length:total_imported+" total Data Peserta berhasil diimport", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_SUCCESS, index: index}
                                }))
                              setStatus(true)
                              setQuestions([])
                              setQuestions([])
                            //   closeModal()
                          }else{
                            console.log(questionsI)
                              dispatch(showNotification({message : "Gagal Import Data Peserta.", status : 0}))
                              closeModal()
                          }
        }
            }
        
            // getMax
            // const data = questions
            // console.log('max participant', schedule.max_questions)
        //     if(questions.length == 1){
        //       dispatch(openModal({title : "Import Gagal", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
        //     extraObject : {message : "Jumlah peserta melebihi batas maksimal. Mohon periksa batas maksimal peserta pada jadwal ini.", type: CONFIRMATION_MODAL_CLOSE_TYPES.PARTIC_ADD_SUCCESS}
        //   }))
        //     }else{
        
              // const response = addquestions({questions: questions})
                                  // const {error, message, data} = await addExam({exam})
                          // console.log('response', response)
                          // console.log('message', message)
                          // if(!response || response==null || response.error){
                          //     dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
                          // }else if(!response.error) {
                          //     console.log("masuk")
                          //     dispatch(showNotification({message : response.message, status : 1}))
                          //   //   closeModal()
                          // }else{
                          //     dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
                          // }
                          
        
                          
        
                    
            // }
          
            //   }
        // if(question.question.trim() === "")return setErrorMessage("Pertanyaan is required!")
        // else if(question.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
        // else if(question.score.trim() === "")return setErrorMessage("Email id is required!")
        // else if(question.bank_code.trim() === "")return setErrorMessage("Email id is required!")
        // // else if(question.email.trim() === "")return setErrorMessage("Email id is required!")
        // // else if(question.email.trim() === "")return setErrorMessage("Email id is required!")
        // else{
        //     // let newquestion = {
        //     //     "id": 7,
        //     //     "email": question.email,
        //     //     "first_name": question.first_name,
        //     //     "last_name": question.last_name,
        //     //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
        //     // }
        //     question.forEach((question, index) => {
        //         console.log(question)
        //         const options = question.option+ '_'+ index
        //         const {option_1, option_2, option_3, option_4, option_5, ...newQuestion} = question
        //         const response = addquestions({question: newQuestion, options})
        //                 // const {error, message, data} = await addExam({exam})
        //         console.log('response', response)
        //         // console.log('message', message)
        //         if(!response || response==null || response.error){
        //             dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
        //         }else if(!response.error) {
        //             console.log("masuk")
        //             dispatch(showNotification({message : response.message, status : 1}))
        //             // closeModal()
        //         }else{
        //             dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
        //         }
        //     });
        //     // dispatch(addNewLead({newquestion}))
        //     // dispatch(showNotification({message : "New Lead Added!", status : 1}))
        // }
    }

    const removeDuplicates = (questions) => {
        const uniqueStrings = [...new Set(questions.map(obj => JSON.stringify(obj)))];
    const uniqueObjects = uniqueStrings.map(str => JSON.parse(str));
    return uniqueObjects
//     console.log('uni',uniqueObjects)
// //     const uniqueArray = questions.filter((obj, index, self) =>
// //   index === self.findIndex((item) => (item.NO_WA === obj.NO_WA) || (item.NO_REGISTRASI === obj.NO_REGISTRASI))
// // );
// setQuestions(uniqueObjects)
// if(uniqueObjects.length < uniqueArray.length){
//     setQuestions(uniqueObjects)
// }else{
//     setQuestions(uniqueArray)
// }
// uniqueObjects.length<uniqueArray.length?console.log(uniqueObjects.length):setQuestions(uniqueArray)

// console.log('uni',uniqueArray)
    // setQuestions(uniqueObjects)
    // setQuestions(prevData => {
    //   const wa = new Set();
    //   const reg = new Set();
      
    //   return prevData.filter(item => {
    //     // Check if either NO_WA or NO_REGIST is duplicated
    //     const isWADuplicate = wa.has(item.NO_WA);
    //     const isRegistDuplicate = reg.has(item.NO_REGISTRASI);
        
    //     // Add to sets if not duplicates
    //     if (!isWADuplicate) wa.add(item.NO_WA);
    //     if (!isRegistDuplicate) reg.add(item.NO_REGISTRASI);
        
    //     // Keep only if both are unique
    //     return !isWADuplicate && !isRegistDuplicate;
    //   });
    // });
    // console.log('after rem', questions)
  };

    

    const handleImport = (data) => {
        console.log(data)
        // if(data){
            setDataImport(prev => [...prev, ...data])
        // }
        console.log('in handleIm')
        console.log('dataImport', dataImport)
    }
    // const saveNewLead = () => {
    //     if(leadObj.first_name.trim() === "")return setErrorMessage("First Name is required!")
    //     else if(leadObj.email.trim() === "")return setErrorMessage("Email id is required!")
    //     else{
    //         let newLeadObj = {
    //             "id": 7,
    //             "email": leadObj.email,
    //             "first_name": leadObj.first_name,
    //             "last_name": leadObj.last_name,
    //             "avatar": "https://reqres.in/img/faces/1-image.jpg"
    //         }
    //         // dispatch(addNewLead({newLeadObj}))
    //         dispatch(showNotification({message : "New Lead Added!", status : 1}))
    //         closeModal()
    //     }
    // }

    // const updateFormValue = ({updateType, value}) => {
    //     setErrorMessage("")
    //     setLeadObj({...leadObj, [updateType] : value})
    // }

    return(
        <>

            <div className="flex flex-col justify-center items-center p-2 mt-5">
{/* save={handleImport} */}
                <FileUploads save={saveImport} id={index} ></FileUploads>
            </div>
{/* 
            <InputText type="text" defaultValue={leadObj.first_name} updateType="first_name" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue}/>

            <InputText type="text" defaultValue={leadObj.last_name} updateType="last_name" containerStyle="mt-4" labelTitle="Last Name" updateFormValue={updateFormValue}/>

            <InputText type="email" defaultValue={leadObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue}/> */}


            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className={`btn bg-green-700 text-gray-300 hover:bg-green-600 hover:text-gray-500 px-6` } {...dataImport.length>0 && isLoading?"disabled": ""} > {dataImport.length>0 && isLoading?"Menyiapkan data...": 
                "Simpan"} </button>
                {/* onClick={() => saveImport()} */}
            </div>
        </>
    )
}

export default ImportQuestionModalBody
// import { useState } from "react"
// import { useDispatch } from "react-redux"
// import InputText from '../../../components/Input/InputText'
// import ErrorText from '../../../components/Typography/ErrorText'
// import { showNotification } from "../../common/headerSlice"
// import {addQuestion} from "../../../services/api/questions"
// // import { addNewLead } from "../leadSlice"

// import FileUploads from "./FileUploads"

// const INITIAL_QUESTION_OBJ = {
//     question : "",
//     answer : "",
//     score : "",
//     bank_code : ""
// }



// function ImportQuestionModalBody({closeModal, extraObject}){
//     const dispatch = useDispatch()
//     const [loading, setLoading] = useState(false)
//     const [errorMessage, setErrorMessage] = useState("")
//     const [question, setquestion] = useState(INITIAL_QUESTION_OBJ)
//     const { type, index } = extraObject


//     const saveNewQuestion = async () => {

//         if(question.question.trim() === "")return setErrorMessage("Pertanyaan is required!")
//         else if(question.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
//         else if(question.score.trim() === "")return setErrorMessage("Email id is required!")
//         else if(question.bank_code.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(question.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(question.email.trim() === "")return setErrorMessage("Email id is required!")
//         else{
//             // let newquestion = {
//             //     "id": 7,
//             //     "email": question.email,
//             //     "first_name": question.first_name,
//             //     "last_name": question.last_name,
//             //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
//             // }
//             question.forEach((question, index) => {
//                 console.log(question)
//                 const options = question.option+ '_'+ index
//                 const {option_1, option_2, option_3, option_4, option_5, ...newQuestion} = question
//                 const response = addQuestion({question: newQuestion, options})
//                         // const {error, message, data} = await addExam({exam})
//                 console.log('response', response)
//                 // console.log('message', message)
//                 if(!response || response==null || response.error){
//                     dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
//                 }else if(!response.error) {
//                     console.log("masuk")
//                     dispatch(showNotification({message : response.message, status : 1}))
//                     // closeModal()
//                 }else{
//                     dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
//                 }
//             });
//             // dispatch(addNewLead({newquestion}))
//             // dispatch(showNotification({message : "New Lead Added!", status : 1}))
//         }
//     }
//     const handleImport = ( ) => {

//     }
//     // const saveNewLead = () => {
//     //     if(leadObj.first_name.trim() === "")return setErrorMessage("First Name is required!")
//     //     else if(leadObj.email.trim() === "")return setErrorMessage("Email id is required!")
//     //     else{
//     //         let newLeadObj = {
//     //             "id": 7,
//     //             "email": leadObj.email,
//     //             "first_name": leadObj.first_name,
//     //             "last_name": leadObj.last_name,
//     //             "avatar": "https://reqres.in/img/faces/1-image.jpg"
//     //         }
//     //         // dispatch(addNewLead({newLeadObj}))
//     //         dispatch(showNotification({message : "New Lead Added!", status : 1}))
//     //         closeModal()
//     //     }
//     // }

//     // const updateFormValue = ({updateType, value}) => {
//     //     setErrorMessage("")
//     //     setLeadObj({...leadObj, [updateType] : value})
//     // }

//     return(
//         <>
//             <FileUploads save={saveNewQuestion} setStatus={handleImport} id={index}></FileUploads>
// {/* 
//             <InputText type="text" defaultValue={leadObj.first_name} updateType="first_name" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue}/>

//             <InputText type="text" defaultValue={leadObj.last_name} updateType="last_name" containerStyle="mt-4" labelTitle="Last Name" updateFormValue={updateFormValue}/>

//             <InputText type="email" defaultValue={leadObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue}/> */}


//             <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
//             <div className="modal-action">
//                 <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
//                 <button  className="btn btn-primary px-6" onClick={() => saveNewQuestion()}>Save</button>
//             </div>
//         </>
//     )
// }

// export default ImportQuestionModalBody