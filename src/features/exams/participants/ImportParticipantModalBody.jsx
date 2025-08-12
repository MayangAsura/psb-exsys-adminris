import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import { addParticipants } from "../../../services/api/exams";
// import { addNewLead } from "../leadSlice"
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
// import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import FileUploads from "./FileUploads";
// import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil"
import { useNavigate } from "react-router-dom";
import supabase from "../../../services/database-server";

const INITIAL_PARTICIPANT_OBJ = {
  phone_number: "",
  regist_number: "",
  school: "",
  // bank_code : ""
};

function ImportParticipantModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [participantObj, setParticipantObj] = useState(INITIAL_PARTICIPANT_OBJ);
  const [schedule, setSchedule] = useState({});
  const { type, index, sid } = extraObject;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  //   const dispatch = useDispatch()
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dataImport, setDataImport] = useState([]);
  const [i, setIndex] = useState(0);
  let lengthPart = participantObj.length;

  //   let i
  //   let dataImport

  useEffect(() => {
    // if(status){

    // }
    console.log(sid);
    if (sid) {
      // console.log('masuk')
      getScheduleMax(sid);
    }
    if (dataImport) {
      setParticipants(dataImport);
    }
  }, [sid, dataImport]);

  const getScheduleMax = async (sid) => {
    const { data: sch, err } = await supabase
      .from("exam_schedules")
      .select("*")
      .eq("id", sid);
    if (!err) {
      console.log("sch", sch[0]);
      setSchedule(sch[0]);
      console.log("schedule", schedule);
    }
  };

  const fetchTodos = async (query = "") => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("fetched todos");

    //   const filteredTodos = todos.filter((todo) =>
    //     todo.title.toLowerCase().includes(query.toLowerCase())
    //   );

    // Uncomment the line below to trigger an error
    // throw new Error();

    //   return [...filteredTodos];
  };

//   const { data: participantsI, isLoading } = useQuery({
//     queryKey: ["participants", { search, participants, lengthPart, i }],
//     queryFn: () =>
//       addParticipants({
//         search,
//         participants: participantObj,
//         lengthPart: participants.length,
//         i: i,
//       }),
//     staleTime: Infinity,
//     cacheTime: 0,
//   });
  //   : participantObj, lengthPart: participants.length, i: index

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: addParticipants,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", { search, participants, lengthPart, i }],
      });
      console.log('data', data)
    },
    onError: (error) => {
        console.log('error', error)
    }
  });
  const saveImport = () => {
    console.log("in save");
    // setData(participants)
    // const saveNewParticipants = async (participants) => {
    // const max_participants =
    if (!dataImport || dataImport.length == 0) {
      dispatch(
        showNotification({
          message: "Gagal Import Data Peserta. Data tidak valid.",
          status: 0,
        })
      );
      closeModal();
    }
    // setParticipants(dataImport)

    const newDataImport = removeDuplicates(dataImport);
    setParticipants(newDataImport);

    console.log("participants", participants, dataImport);
    if (participants.length > schedule.max_participants) {
      dispatch(
        showNotification({
          message:
            "Jumlah peserta melebihi batas maksimal. Mohon periksa batas maksimal peserta pada jadwal ini.",
          status: 0,
        })
      );
      closeModal();
      setError(true);
    } else {
      // set
      let total_imported = 0;
      let final_res = {};
      let invalidData = [];
      let importedData = [];
      if (!error) {
        setTimeout(async () => {
          participants.forEach(async (participantObj, index) => {
            setParticipantObj(participantObj);
            setIndex(index);
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
            console.log(participantObj);
            // const options = participantObj.option+ '_'+ index
            const { NO_WA, NO_REGISTRASI, NAMA, JENJANG } = participantObj;
            // const newparticipantObj = {
            //   phone_number: NO_WA,

            // }

            //   const response = addParticipants({participants: participantObj, lengthPart: participants.length, i: index})
            // onClick={async () => {

            try {
              await addTodoMutation({
                participants: participantObj,
                lengthPart: participants.length,
                i: index,
              });

            //   if (false) {
            //     setDataImport("");
            //     console.log("participantsI", participantsI);
            //     if (participantsI.error != true) {
            //       total_imported++;
            //       console.log(total_imported);
            //     }
            //     console.log("masuk", participantsI);
            //     console.log("inv", participantsI.data.invalidData[0].parts);
            //     console.log("imp", participantsI.data.importedData[0].parts);
            //     invalidData.push(participantsI.data.invalidData[0].parts);
            //     importedData.push(participantsI.data.importedData[0].parts);
            //     //   // console.log('message', message)
            //     final_res = participantsI;
            //   } else {
            //     console.log("participantsI NULL");
            //   }
            } catch (e) {
              console.log(e);
            }
            //   }}

            // const {error, message, data} = await addExam({exam})
            //   console.log('response', participantsI)

            // dispatch(addNewLead({newquestionObj}))
            // dispatch(showNotification({message : "New Lead Added!", status : 1}))
            // }
          });
        }, 3000);
      }

    //   if (participants.length > 0 && participantsI) {
    //     if (
    //       !participantsI ||
    //       participantsI == null ||
    //       participantsI.error === true
    //     ) {
    //       console.log("participantsI", participantsI);
    //       // dispatch(showNotification({message : "Gagal Import Data Peserta", status : 0}))
    //       setTimeout(() => {
    //         if (total_imported > 0) {
    //           dispatch(
    //             openModal({
    //               title: "Berhasil",
    //               bodyType: MODAL_BODY_TYPES.MODAL_SUCCESS,
    //               size: "sm",
    //               extraObject: {
    //                 message:
    //                   "Total " +
    //                   (total_imported == 0
    //                     ? importedData.length
    //                     : total_imported) +
    //                   " data berhasil diimport." +
    //                   (invalidData.length > 0
    //                     ? ", Data Peserta tidak valid: " +
    //                       JSON.stringify(
    //                         invalidData.map((val) => val.parts).join(", ")
    //                       ) +
    //                       (importedData.length > 0
    //                         ? ", Data Peserta tidak valid: " +
    //                           JSON.stringify(
    //                             importedData.map((val) => val.parts).join(", ")
    //                           )
    //                         : "")
    //                     : ""),
    //                 type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_SUCCESS,
    //                 index: index,
    //               },
    //             })
    //           );
    //         } else {
    //           dispatch(
    //             openModal({
    //               title: "Gagal",
    //               bodyType: MODAL_BODY_TYPES.MODAL_ERROR,
    //               size: "sm",
    //               extraObject: {
    //                 message:
    //                   "Pesan error: " +
    //                   participantsI.message +
    //                   ", Total data : " +
    //                   (total_imported == 0
    //                     ? importedData.length
    //                     : total_imported) +
    //                   (invalidData.length > 0
    //                     ? ", Data Peserta tidak valid: " +
    //                       JSON.stringify(
    //                         invalidData.map((val) => val.parts).join(", ")
    //                       ) +
    //                       (importedData.length > 0
    //                         ? ", Data Peserta tidak valid: " +
    //                           JSON.stringify(
    //                             importedData.map((val) => val.parts).join(", ")
    //                           )
    //                         : "")
    //                     : ""),
    //                 type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_ERROR,
    //                 index: index,
    //               },
    //             })
    //           );
    //         }
    //         setStatus(false);
    //         setParticipants([]);
    //         setParticipantObj([]);
    //       }, 3000);
    //     } else if (participantsI.error === false) {
    //       console.log("masuk");
    //       // total_imported++
    //       // dispatch(showNotification({message : response.message, status : 1}))
    //       dispatch(
    //         openModal({
    //           title: "Berhasil",
    //           bodyType: MODAL_BODY_TYPES.MODAL_SUCCESS,
    //           size: "sm",
    //           extraObject: {
    //             message:
    //               participants.length + " total Data Peserta berhasil diimport",
    //             type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_SUCCESS,
    //             index: index,
    //           },
    //         })
    //       );
    //       // total_imported==0?importedData.length:total_imported
    //       setStatus(true);
    //       setParticipants([]);
    //       setParticipantObj([]);
    //       //   closeModal()
    //     } else {
    //       console.log(participantsI);
    //       dispatch(
    //         showNotification({
    //           message: "Gagal Import Data Peserta.",
    //           status: 0,
    //         })
    //       );
    //       closeModal();
    //     }
    //   }
    }

    // getMax
    // const data = participants
    console.log("max participant", schedule.max_participants);
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
  };

  const removeDuplicates = (participants) => {
    const uniqueStrings = [
      ...new Set(participants.map((obj) => JSON.stringify(obj))),
    ];
    const uniqueObjects = uniqueStrings.map((str) => JSON.parse(str));
    return uniqueObjects;
    //     console.log('uni',uniqueObjects)
    // //     const uniqueArray = participants.filter((obj, index, self) =>
    // //   index === self.findIndex((item) => (item.NO_WA === obj.NO_WA) || (item.NO_REGISTRASI === obj.NO_REGISTRASI))
    // // );
    // setParticipants(uniqueObjects)
    // if(uniqueObjects.length < uniqueArray.length){
    //     setParticipants(uniqueObjects)
    // }else{
    //     setParticipants(uniqueArray)
    // }
    // uniqueObjects.length<uniqueArray.length?console.log(uniqueObjects.length):setParticipants(uniqueArray)

    // console.log('uni',uniqueArray)
    // setParticipants(uniqueObjects)
    // setParticipants(prevData => {
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
    console.log("after rem", participants);
  };

  const handleImport = (data) => {
    console.log(data);
    // if(data){
    setDataImport((prev) => [...prev, ...data]);
    // }
    console.log("in handleIm");
    console.log("dataImport", dataImport);
  };
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

  return (
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
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className={`btn bg-green-700 text-gray-300 hover:bg-green-600 hover:text-gray-500 px-6`}
        //   {...(dataImport.length > 0 ? "disabled" : "")}
          onClick={() => saveImport()}
        >
          {" "}
          {dataImport.length > 0 
            ? "Menyiapkan data..."
            : "Simpan"}{" "}
        </button>
      </div>
    </>
  );
}

export default ImportParticipantModalBody;
