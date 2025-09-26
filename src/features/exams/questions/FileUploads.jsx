// src/FileInput.js

import React from 'react';
import * as XLSX from 'xlsx';
import {addParticipants} from "../../../services/api/exams"
import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { openModal } from "../../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'
import { useEffect } from 'react';
// import fs from 'fs';
// import path from 'path';

import ExcelJS from 'exceljs';
// import { fi } from 'date-fns/locale';

function FileUploads({save, setStatus, id, sid}) {
  const [data, setData] = useState(null);
  const dispatch = useDispatch()
  const [file, setFile] = useState(null);
  const [error, setError] = useState("")

  useEffect(()=> {

      // if(clicked)
      //   save
  }, [save])

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setFile(file)
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      console.log('sheetData', sheetData)
      
      setTimeout(() => {
        
        save(sheetData)
      }, 1000);
      
      setData(sheetData)
      // console.log(save(sheetData))
      // if(sheetData){
      //   save(sheetData)

      // }
      // saveNewParticipants(sheetData)
    };

    
    reader.readAsBinaryString(file);

  };

  // const handleFileUploadImg = async (e) => {

  // // const filePath = './test.xlsx';
  // const file = e.target.files[0];
  // console.log(file)
  //   // const readExcelFile = async (filePath) => {
  // const workbook = new ExcelJS.Workbook();
  // await workbook.xlsx.readFile(file);

  // workbook.eachSheet((sheet, sheetId) => {
  //   console.log(`Reading Sheet: ${sheet.name}`);

  //   sheet.getImages().forEach((image) => {
  //     const imageData = workbook.model.media[image.imageId];
  //     const imageExtension = imageData.extension;
  //     const imageBuffer = imageData.buffer;
  //     console.log(imageBuffer);

  //     // Extract row and column information
  //     const topLeftCell = image.range.tl;
  //     const bottomRightCell = image.range.br;
  //     const topLeft = `Row: ${topLeftCell.row}, Column: ${topLeftCell.col}`;
  //     const bottomRight = `Row: ${bottomRightCell.row}, Column: ${bottomRightCell.col}`;

  //     console.log(`Image found at: Top-Left (${topLeft}), Bottom-Right (${bottomRight})`);

  //     // Save image to file
  //     const outputImagePath = path.join(
  //       `output_image_${sheetId}_${topLeftCell.row}_${topLeftCell.col}.${imageExtension}`,
  //     );
  //     // fs.writeFileSync(outputImagePath, imageBuffer);

  //     console.log(`Saved image to ${outputImagePath}`);
  //   });
  // });
// }

// Path to the XLSX file


// Call the function to read the file
// readExcelFile(filePath).catch(console.error);
  // }
// Function to read and extract images from the XLSX file


  // const removeDuplicates = (participants) => {
  //   setData(prevData => {
  //     const wa = new Set();
  //     const reg = new Set();
      
  //     return prevData.filter(item => {
  //       // Check if either NO_WA or NO_REGIST is duplicated
  //       const isWADuplicate = wa.has(item.NO_WA);
  //       const isRegistDuplicate = reg.has(item.NO_REGISTRASI);
        
  //       // Add to sets if not duplicates
  //       if (!isWADuplicate) wa.add(item.NO_WA);
  //       if (!isRegistDuplicate) reg.add(item.NO_REGISTRASI);
        
  //       // Keep only if both are unique
  //       return !isWADuplicate && !isRegistDuplicate;
  //     });
  //   });
  // };

  

  return (
    <div>
      <div className='flex flex-row justify-center items-center'>
        <div className='flex '>
          <label
          className={`flex items-center ${
            error ? "border-red-400" : "border-black-600"
          } bg-green-600 hover:bg-green-400 border w-300px cursor-pointer rounded-lg mb-2`}
        >

          <span className={`flex-grow pl-4 ${error ? "text-red-500" : ""}`}>
              Upload
            </span>
            
        <input type="file" hidden onChange={handleFileUpload} className='rounded-sm text-green-100' />
        <input
              type="text"
              placeholder={file ? file.name : "Upload data Pertanyaan"}
              value={file && file?.name}
              disabled={!file}
              className={`border ${
                error ? "border-none text-red-400" : "border-gray-400"
              } bg-white p-2 ml-4 flex-grow rounded-r-lg border-r-0 border-top-0 border-bottom-0`}
            />
        </label>
        {error && (
          <p className="text-red-400 italic">
            *Error: File tidak valid
          </p>
        )}
        </div>
        <div className='flex flex-row justify-end items-end '>
          <a className='ml-2 flex-grow rounded-r-lg border-r-0 border-top-0 border-bottom-0 ' href='https://cnpcpmdrblvjfzzeqoau.supabase.co/storage/v1/object/public/exams/uploads/templates/TemplateImportPesertaUjian.xlsx' download>
          
            <span className='flex text-sm items-center text-center hover:text-green-400'>Download Template</span>

          </a>
        </div>
      </div>
      
        
      {/* {data && (
        <div>
          <h2>Imported Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}

export default FileUploads;
// // src/FileInput.js

// import React from 'react';
// import * as XLSX from 'xlsx';
// import {addQuestion} from "../../../services/api/questions"
// import { useState } from "react"
// import { useDispatch } from "react-redux"
// import InputText from '../../../components/Input/InputText'
// import ErrorText from '../../../components/Typography/ErrorText'
// import { showNotification } from "../../common/headerSlice"

// function FileUploads({save}) {
//   const [data, setData] = React.useState(null);
//   const dispatch = useDispatch()

//   const quetionObj = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const workbook = XLSX.read(event.target.result, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const sheetData = XLSX.utils.sheet_to_json(sheet);

//       setData(sheetData);
//     };

    
//     saveNewQuestion(data)
//     reader.readAsBinaryString(file);

//   };
//   const saveNewQuestion = async (questions) => {
  
//       questions.forEach((questionObj, index) => {
//           if(questionObj.question.trim() === "")return '' 
//         //   props.setErrorMessage("Pertanyaan is required!")
//         //   else if(questionObj.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
//         //   else if(questionObj.score.trim() === "")return setErrorMessage("Email id is required!")
//         //   else if(questionObj.bank_code.trim() === "")return setErrorMessage("Email id is required!")
//           // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
//           // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
//           else{
//               // let newquestionObj = {
//               //     "id": 7,
//               //     "email": questionObj.email,
//               //     "first_name": questionObj.first_name,
//               //     "last_name": questionObj.last_name,
//               //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
//               // }
//                   console.log(questionObj)
//                   const options = questionObj.option+ '_'+ index
//                   const {option_1, option_2, option_3, option_4, option_5, ...newQuestion} = questionObj
//                   const response = addQuestion({question: newQuestion, options})
//                           // const {error, message, data} = await addExam({exam})
//                   console.log('response', response)
//                   // console.log('message', message)
//                   if(!response || response==null || response.error){
//                       dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
//                   }else if(!response.error) {
//                       console.log("masuk")
//                       dispatch(showNotification({message : response.message, status : 1}))
//                     //   closeModal()
//                   }else{
//                       dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
//                   }
//                   // dispatch(addNewLead({newquestionObj}))
//                   // dispatch(showNotification({message : "New Lead Added!", status : 1}))
//                 }
//             });
//       }

//   return (
//     <div>
//       <input type="file" onChange={handleFileUpload} className='rounded-sm text-green-100' />
//       {/* {data && (
//         <div>
//           <h2>Imported Data:</h2>
//           <pre>{JSON.stringify(data, null, 2)}</pre>
//         </div>
//       )} */}
//     </div>
//   );
// }

// export default FileUploads;