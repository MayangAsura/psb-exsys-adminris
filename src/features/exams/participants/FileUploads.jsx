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
      console.log(save(sheetData))
      
      setData(sheetData)
      // if(sheetData){
      //   save(sheetData)

      // }
      // saveNewParticipants(sheetData)
    };

    
    reader.readAsBinaryString(file);

  };

  const removeDuplicates = (participants) => {
    setData(prevData => {
      const wa = new Set();
      const reg = new Set();
      
      return prevData.filter(item => {
        // Check if either NO_WA or NO_REGIST is duplicated
        const isWADuplicate = wa.has(item.NO_WA);
        const isRegistDuplicate = reg.has(item.NO_REGISTRASI);
        
        // Add to sets if not duplicates
        if (!isWADuplicate) wa.add(item.NO_WA);
        if (!isRegistDuplicate) reg.add(item.NO_REGISTRASI);
        
        // Keep only if both are unique
        return !isWADuplicate && !isRegistDuplicate;
      });
    });
  };

  

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
              placeholder={file ? file.name : "Upload data Peserta"}
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