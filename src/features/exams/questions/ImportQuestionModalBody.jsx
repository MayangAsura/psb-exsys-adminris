import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import {addQuestion} from "../../../services/api/questions"
// import { addNewLead } from "../leadSlice"

import FileUploads from "./FileUploads"

const INITIAL_QUESTION_OBJ = {
    question : "",
    answer : "",
    score : "",
    bank_code : ""
}

function ImportQuestionModalBody({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [questionObj, setQuestionObj] = useState(INITIAL_QUESTION_OBJ)


    const saveNewQuestion = async () => {

        if(questionObj.question.trim() === "")return setErrorMessage("Pertanyaan is required!")
        else if(questionObj.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
        else if(questionObj.score.trim() === "")return setErrorMessage("Email id is required!")
        else if(questionObj.bank_code.trim() === "")return setErrorMessage("Email id is required!")
        // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
        // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
        else{
            // let newquestionObj = {
            //     "id": 7,
            //     "email": questionObj.email,
            //     "first_name": questionObj.first_name,
            //     "last_name": questionObj.last_name,
            //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
            // }
            questionObj.forEach((question, index) => {
                console.log(question)
                const options = question.option+ '_'+ index
                const {option_1, option_2, option_3, option_4, option_5, ...newQuestion} = question
                const response = addQuestion({question: newQuestion, options})
                        // const {error, message, data} = await addExam({exam})
                console.log('response', response)
                // console.log('message', message)
                if(!response || response==null || response.error){
                    dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
                }else if(!response.error) {
                    console.log("masuk")
                    dispatch(showNotification({message : response.message, status : 1}))
                    // closeModal()
                }else{
                    dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
                }
            });
            // dispatch(addNewLead({newquestionObj}))
            // dispatch(showNotification({message : "New Lead Added!", status : 1}))
        }
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

            <FileUploads save={saveNewQuestion}></FileUploads>
{/* 
            <InputText type="text" defaultValue={leadObj.first_name} updateType="first_name" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue}/>

            <InputText type="text" defaultValue={leadObj.last_name} updateType="last_name" containerStyle="mt-4" labelTitle="Last Name" updateFormValue={updateFormValue}/>

            <InputText type="email" defaultValue={leadObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue}/> */}


            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewQuestion()}>Save</button>
            </div>
        </>
    )
}

export default ImportQuestionModalBody