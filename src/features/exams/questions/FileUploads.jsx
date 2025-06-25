// src/FileInput.js

import React from 'react';
import * as XLSX from 'xlsx';
import {addQuestion} from "../../../services/api/questions"
import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"

function FileUploads({save}) {
  const [data, setData] = React.useState(null);
  const dispatch = useDispatch()

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      setData(sheetData);
    };

    
    saveNewQuestion(data)
    reader.readAsBinaryString(file);

  };
  const saveNewQuestion = async (questions) => {
  
      questions.forEach((questionObj, index) => {
          if(questionObj.question.trim() === "")return '' 
        //   props.setErrorMessage("Pertanyaan is required!")
        //   else if(questionObj.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
        //   else if(questionObj.score.trim() === "")return setErrorMessage("Email id is required!")
        //   else if(questionObj.bank_code.trim() === "")return setErrorMessage("Email id is required!")
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
                  console.log(questionObj)
                  const options = questionObj.option+ '_'+ index
                  const {option_1, option_2, option_3, option_4, option_5, ...newQuestion} = questionObj
                  const response = addQuestion({question: newQuestion, options})
                          // const {error, message, data} = await addExam({exam})
                  console.log('response', response)
                  // console.log('message', message)
                  if(!response || response==null || response.error){
                      dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
                  }else if(!response.error) {
                      console.log("masuk")
                      dispatch(showNotification({message : response.message, status : 1}))
                    //   closeModal()
                  }else{
                      dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
                  }
                  // dispatch(addNewLead({newquestionObj}))
                  // dispatch(showNotification({message : "New Lead Added!", status : 1}))
                }
            });
      }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {data && (
        <div>
          <h2>Imported Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FileUploads;