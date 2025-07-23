import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import {addParticipants} from "../../../services/api/exams"
// import { addNewLead } from "../leadSlice"
import { openModal } from "../../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'
// import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import FileUploads from "./FileUploads"
// import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil"
import { useNavigate } from "react-router-dom"
import supabase from "../../../services/database-server"

const INITIAL_PARTICIPANT_OBJ = {
    phone_number : "",
    regist_number : "",
    school : ""
    // bank_code : ""
}

function ManualParticipantModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [participantObj, setParticipantObj] = useState(INITIAL_PARTICIPANT_OBJ)
    const [schedule, setSchedule] = useState({})
    const { type, index, sid } = extraObject
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    const [participants, setParticipants] = useState([]);
    //   const dispatch = useDispatch()
      const [file, setFile] = useState(null);
      const [error, setError] = useState("")
      const [dataImport, setDataImport] = useState([])
      const [i, setIndex] = useState(0)
      let lengthPart = participantObj.length

    //   let i
    //   let dataImport

    useEffect(() =>{
        // if(status){

        // }
        console.log(sid)
        if(sid){
// console.log('masuk')
            getScheduleMax(sid)
        }
        if(dataImport){
            setParticipants(dataImport)
        }
    },[sid, dataImport])

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

    const { data: participantsI, isLoading } = useQuery({
    queryKey: ["participants", { search, participants, lengthPart, i }],
    queryFn: () => addParticipants({search, participants: participantObj, lengthPart: participants.length , i: i}),
    staleTime: Infinity,
    cacheTime: 0,
  });
//   : participantObj, lengthPart: participants.length, i: index

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: addParticipants,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });

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
    const saveImport = async () => {
        console.log('in save')
        // setData(participants)
        // const saveNewParticipants = async (participants) => {
            // const max_participants = 
            console.log('participants', dataImport)
            // removeDuplicates(participants)
            // getMax
            // const data = participants
            console.log(schedule.max_participants)
        //     if(participants.length == 1){
        //       dispatch(openModal({title : "Import Gagal", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
        //     extraObject : {message : "Jumlah peserta melebihi batas maksimal. Mohon periksa batas maksimal peserta pada jadwal ini.", type: CONFIRMATION_MODAL_CLOSE_TYPES.PARTIC_ADD_SUCCESS}
        //   }))
        //     }else{
        
              // const response = addParticipants({participants: participants})
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
        
                          let total_imported = 0
                          let final_res = {}
                          setTimeout(() => {
                            dataImport.forEach((participantObj, index) => {
                                setParticipantObj(participantObj)
                                setIndex(index)
                  // if(participantObj.participants.trim() === "")return '' 
                //   props.setErrorMessage("Pertanyaan is required!")
                //   else if(questionObj.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
                //   else if(questionObj.score.trim() === "")return setErrorMessage("Email id is required!")
                //   else if(questionObj.bank_code.trim() === "")return setErrorMessage("Email id is required!")
                  // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
                  // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
                  // else{
                      // let newquestionObj = {
                      //     "id": 7,
                      //     "email": questionObj.email,
                      //     "first_name": questionObj.first_name,
                      //     "last_name": questionObj.last_name,
                      //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
                      // }
                          console.log(participantObj)
                          // const options = participantObj.option+ '_'+ index
                          const {NO_WA, NO_REGISTRASI, NAMA, JENJANG} = participantObj
                          // const newparticipantObj = {
                          //   phone_number: NO_WA,
                            
                          // }
        
                        //   const response = addParticipants({participants: participantObj, lengthPart: participants.length, i: index})
                        // onClick={async () => {
            try {
            addTodoMutation({ participants: participantObj, lengthPart: participants.length, i: index});
              setDataImport("");
              console.log('participantsI', participantsI)
            } catch (e) {
              console.log(e);
            }
        //   }}
                        
                                  // const {error, message, data} = await addExam({exam})
                        //   console.log('response', participantsI)
                          if(participantsI.error!==true)total_imported++
                        //   // console.log('message', message)
                          final_res = participantsI
                          // dispatch(addNewLead({newquestionObj}))
                          // dispatch(showNotification({message : "New Lead Added!", status : 1}))
                        // }
                        
                    });
                          }, 3000);
              
        
        
                    if(!final_res || final_res==null || final_res.error===true){
                              // dispatch(showNotification({message : "Gagal Import Data Peserta", status : 0}))
                              dispatch(openModal({title : "Gagal Import Data Peserta", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
                                  extraObject : {message : "Pesan error: "+ final_res.message + (final_res.data.invalidData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(final_res.data.invalidData.inv.map((val)=> val.part).join(', ')) : ""), type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_ERROR}
                                }))
                          }else if(final_res.error === false) {
                              console.log("masuk")
                              // total_imported++
                              // dispatch(showNotification({message : response.message, status : 1}))
                              dispatch(openModal({title : "Import Data Peserta Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
                                  extraObject : {message : total_imported +" total Data Peserta berhasil diimport", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_SUCCESS, index: index}
                                }))
                              setStatus(true)
                            //   closeModal()
                          }else{
                              dispatch(showNotification({message : "Gagal Import Data Peserta", status : 0}))
                          }
            // }
          
            //   }
        // if(participantObj.question.trim() === "")return setErrorMessage("Pertanyaan is required!")
        // else if(participantObj.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
        // else if(participantObj.score.trim() === "")return setErrorMessage("Email id is required!")
        // else if(participantObj.bank_code.trim() === "")return setErrorMessage("Email id is required!")
        // // else if(participantObj.email.trim() === "")return setErrorMessage("Email id is required!")
        // // else if(participantObj.email.trim() === "")return setErrorMessage("Email id is required!")
        // else{
        //     // let newparticipantObj = {
        //     //     "id": 7,
        //     //     "email": participantObj.email,
        //     //     "first_name": participantObj.first_name,
        //     //     "last_name": participantObj.last_name,
        //     //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
        //     // }
        //     participantObj.forEach((question, index) => {
        //         console.log(question)
        //         const options = question.option+ '_'+ index
        //         const {option_1, option_2, option_3, option_4, option_5, ...newQuestion} = question
        //         const response = addParticipants({question: newQuestion, options})
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
        //     // dispatch(addNewLead({newparticipantObj}))
        //     // dispatch(showNotification({message : "New Lead Added!", status : 1}))
        // }
    }

    const removeDuplicates = (participants) => {
        const uniqueStrings = [...new Set(participants.map(obj => JSON.stringify(obj)))];
    const uniqueObjects = uniqueStrings.map(str => JSON.parse(str));
    setParticipants(uniqueObjects)
    // setData(prevData => {
    //   const wa = new Set();
    //   const reg = new Set();
      
    //   return participants.filter(item => {
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

                <FileUploads save={handleImport} id={index} sid={sid}></FileUploads>
            </div>
{/* 
            <InputText type="text" defaultValue={leadObj.first_name} updateType="first_name" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue}/>

            <InputText type="text" defaultValue={leadObj.last_name} updateType="last_name" containerStyle="mt-4" labelTitle="Last Name" updateFormValue={updateFormValue}/>

            <InputText type="email" defaultValue={leadObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue}/> */}


            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn bg-green-700 text-gray-300 hover:bg-green-600 hover:text-gray-500 px-6" onClick={() => saveImport()}>Save</button>
            </div>
        </>
    )
}

export default ManualParticipantModalBody