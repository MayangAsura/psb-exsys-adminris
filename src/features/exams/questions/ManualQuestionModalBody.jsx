// import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import {addQuestion} from "../../../services/api/questions"
// import { addNewLead } from "../leadSlice"
import CustomUploadAdapterPlugin from "./CustomUpload";
import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
// import CustomUploadAdapterPlugin from "./CustomUpload.js";
import FileUploads from "./FileUploads"
import SelectBox from "../../../components/Input/SelectBox"
import supabase from "../../../services/database-server"
import { openModal } from "../../common/modalSlice"
// import ConfirmationModalBody from "../../common/components/ConfirmationModalBody"
import { MODAL_BODY_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil"

const INITIAL_QUESTION_OBJ = {
    question : "",
    answer : "",
    score : "",
    bank_code : ""
}



function ManualQuestionModalBody({closeModal, extraObject}){
    const { id, appl_id } = extraObject
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [questionObj, setQuestionObj] = useState(INITIAL_QUESTION_OBJ)
    const [editorData, setEditorData] = useState();
    const [questions, setQuestions] = useState([{question: "", point: 0}, {question: "", point: ""}, {question: "", point: ""}   ]);
    const [question_type, setQueType] = useState();
    const [options, setOptions] = useState([{name: "Jawaban Singkat", value: "sa"},{name: "Pilihan Ganda", value: "mc"}])

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

    const updateFormValueQueType = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        // questions[nameInput] = value
        // set
        setQueType(value)
        // console.log('exam>', exam)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }
    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        // questions[nameInput] = value
        // set
        // setQuestions()
        setQueType(value)
        // console.log('exam>', exam)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }



    const handleSave = async () => {
        // e.preventDefautl()

        const queData = questions.map( (value, k) => ({
            exam_test_id: id,                                         
            // question: value[].question_`${k+1}`,
            bank_code: value.bank_code,
            exam_question_bank_id : '',              
            score: value.point_`${k+1}`,
            question_type: 'SE',
            order: parseInt(value.order)
        }))
        
        const { data, error } = await supabase
        .from('exam_test_contents')
        .insert([
            queData
        ])
        .select()

        if(error){
            console.log('err')
            dispatch(openModal({title : "Login Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_ERROR, size: 'sm',
                extraObject : {message : "Redirecting..", type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_ERROR}
            }))
        }else{
            console.log('suc')
            dispatch(openModal({title : "Login Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
                extraObject : {message : "Redirecting..", type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_SUCCESS}
            }))
        }
          
    }
    return(
        <>

            <div className="">
                <SelectBox
                    nameInput="question_type"
                    options={options}
                    labelTitle="Tipe Soal"
                    placeholder="Pilih Tipe Soal"
                    containerStyle="w-72"
                    // labelStyle="hidden"
                    // defaultValue="TODAY"
                    updateFormValue={updateFormValueQueType}
                />
            </div>
            {question_type=='SE'?(
                <><div className="">
                <label className="label">
                    <span className={"label-text text-base-content "}>Soal</span>
                     {/* + labelStyle */}
                </label>
            </div>
            <div>
                <div className="grid grid-cols-3">
                    <div className="">No</div>
                    <div></div>
                    <div></div>
                </div>
                <form action="" onSubmit={handleSave}>
                    <div className="grid grid-cols-3">
                    <div className="">
                        <InputText labelTitle="" nameInput="question_1" defaultValue={questions.question_1} updateFormValue={updateFormValue}/>
                    </div>
                    <div className=""><CKEditor
                editor={ClassicEditor}
                data={editorData}
                onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                    console.log(editorData)
                }}
                onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                }}
                config={{
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                        ]
                    },
                    extraPlugins: [CustomUploadAdapterPlugin],
                }}
            /></div>
                    <div className="">
                        <InputText labelTitle="" nameInput="point_1" defaultValue={questions.point_1} updateFormValue={updateFormValue}/>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <div className="">
                        <InputText labelTitle="" nameInput="question_2" defaultValue={questions.question_2} updateFormValue={updateFormValue}/>
                    </div>
                    <div className="">
                        {/* <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                    console.log(editorData)
                }}
                onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                }}
                config={{
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                        ]
                    },
                    extraPlugins: [CustomUploadAdapterPlugin],
                }}
            /> */}
            </div>
                    <div className="">
                        <InputText labelTitle="" nameInput="point_2" defaultValue={questions.point_2} updateFormValue={updateFormValue}/>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <div className="">
                        <InputText labelTitle="" nameInput="question_3" defaultValue={questions.question_3} updateFormValue={updateFormValue}/>
                    </div>
                    <div className=""><CKEditor
                editor={ClassicEditor}
                data={editorData}
                onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                    console.log(editorData)
                }}
                onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                }}
                config={{
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                        ]
                    },
                    extraPlugins: [CustomUploadAdapterPlugin],
                }}
            /></div>
                    <div className="">
                        <InputText labelTitle="" nameInput="point_3" defaultValue={questions.point_3} updateFormValue={updateFormValue}/>
                    </div>
                </div>
                </form>
                
            </div>
            
            
                </>
                
            ):(
                <div></div>
            )}
            {/* <FileUploads save={saveNewQuestion}></FileUploads> */}
            <div className="">
                <label className="label">
                    <span className={"label-text text-base-content "}>Soal</span>
                     {/* + labelStyle */}
                </label>
            </div>
            <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                    console.log(editorData)
                }}
                onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                }}
                config={{
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                        ]
                    },
                    extraPlugins: [CustomUploadAdapterPlugin],
                }}
            />
            <InputText type="text" defaultValue="" updateType="question" containerStyle="mt-4" labelTitle="" updateFormValue={updateFormValue}/>
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

export default ManualQuestionModalBody