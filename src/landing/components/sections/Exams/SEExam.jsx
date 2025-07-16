import React, { useEffect, useState } from 'react'
// import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NumberItem from './NumberItem';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import TextAreaInput from '../../../../components/Input/TextAreaInput'
import { openModal } from "../../../../features/common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../../utils/globalConstantUtil'

import supabase from '../../../../services/database-server';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';



const SEExam = ({id, appl_id, started_at}) => {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState("")
  const [responseDetailValues, setResponseDetailValues] = useState([])
  const res = []
  const dispatch = useDispatch()
  // const id = useParams().id

  const steps = [
  {
    label: 'Soal 1',
    description: `Bagaimana Ananda di rumah?`,
  },
  {
    label: 'Soal 2',
    description:
      'Apakah Ananda pernah bercerita tentang cita-citanya?',
  },
  {
    label: 'Soal 3',
    description: `Apakah Ananda pernah merokok?`,
  },
];

useEffect(() => {
  console.log('id', id)
  getQuestions(id)
  console.log('questions', questions)
}, [id])



  const getQuestions = async (id) => {
    console.log(id)
  let { data: exam_test_contents, error } = await supabase
    .from('exam_test_contents')
    .select('*, (exam_tests(exam_test_participants(appl_id))) ')
    .eq('exam_test_id', id)
    .eq('exam_tests.exam_test_participants.appl_id', appl_id)

    console.log('getq', exam_test_contents, error);
    if(error){
      openErrorModal()
    }else{
      console.log(exam_test_contents);
      const data_questions = exam_test_contents.map((e, key) => ({
        id: e.id,
        order: e.order,
        label: `Soal ${key + 1}`,
        description: e.question
      })
       
      // setQuestions([...questions, {label: `Soal `+key+1, description: e.question }])
      // {
        // questions.push({label: `Soal `+key+1, description: e.question })
        // setQuestions((question) => ({label: `Soal `+ key+1, description: e.question }))
        // }
      )
      setQuestions(data_questions)
      Object.keys(exam_test_contents).map(function(key){
        // obj = [key, {labe}];
      });
      console.log('questions', questions)
    }
    function convertObjectToList(obj) {
  
}

  
  }
  const addRes = (qid) => {
    res.push(qid)    
  }
  const openErrorModal = () => {
    dispatch(openModal({title : "Data Tidak ditemukan", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS}))
  }
  // const openSuccessModal = () => {
  //   dispatch(openModal({title : "Login Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_ERROR}))
  // }


  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = questions.length;

  const handleNext = () => {
    if(questions[activeStep].id) {
      handleSubmit()
      addRes()

    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSubmit = async (qid) => {
    // e.preventDefault()
    console.log("submit")

    // quedata.forEach(element => {
    //   values.map((e) => ( element.answer == e.a? setScores(scores + parseInt(e.scores))&&{...e, score: element.score}: {...e, score: 0}))
    // });
    // setAnswers(values)
    console.log(appl_id)
    const responseValues = {exam_test_id: id, appl_id: appl_id, start_at: started_at, created_by: appl_id }
    const responseValues_ = {id: qid, exam_test_id: id, appl_id: appl_id, start_at: started_at, created_by: appl_id }
    if(qid){
    const { data, error } = await supabase
    .from('exam_test_responses')
    .upsert([
      responseValues_
    ])
    .select()

    if(!error){
      
      dispatch(openModal({title : "Ujian Tersimpan", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : 'Anda telah menyelesaikan ujian'}}))
      }else{
        dispatch(openModal({title : "Gagal", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
          extraObject : { message : 'Data ujian gagal tersimpan'}}))
        }
        
    answers.map((value) => (setResponseDetailValues([...responseDetailValues, {exam_test_response_id: data.id, exam_test_content_id: value.name, answer:value.answer}])))
    
    const { data2, error2 } = await supabase
      .from('exam_test_response_details')
      .upsert([
        responseDetailValues
      ])
      .select()

      if(!error2){
        
        dispatch(openModal({title : "Ujian Tersimpan", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Anda telah menyelesaikan ujian'}}))
      }else{
        dispatch(openModal({title : "Gagal Menyimpan Ujian", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Data ujian gagal tersimpan'}}))
      }
    }
    if(!qid){
      const { data, error } = await supabase
    .from('exam_test_responses')
    .insert([
      responseValues
    ])
    
    if(!error){
      
      dispatch(openModal({title : "Ujian Tersimpan", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : 'Anda telah menyelesaikan ujian'}}))
      }else{
        dispatch(openModal({title : "Gagal", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
          extraObject : { message : 'Data ujian gagal tersimpan'}}))
        }
        
    answers.map((value) => (setResponseDetailValues([...responseDetailValues, {exam_test_response_id: data.id, exam_test_content_id: value.name, answer:value.answer}])))
    
    const { data2, error2 } = await supabase
      .from('exam_test_response_details')
      .upsert([
        responseDetailValues
      ])
      .select()

      if(!error2){
        
        dispatch(openModal({title : "Ujian Tersimpan", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Anda telah menyelesaikan ujian'}}))
      }else{
        dispatch(openModal({title : "Gagal Menyimpan Ujian", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Data ujian gagal tersimpan'}}))
      }
    }
    
    // if(qid) {
    //   // setAnswers([...answers, ])
    //   setResponseDetailValues([...responseDetailValues, {exam_test_response_id: data.id, exam_test_content_id: qid, answer:}])
    // }
    // if(!qid){
    // }
    
    
    
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        setAnswers([...answers, {name: nameInput, value: value}])
        // exam[nameInput] = value
        // console.log('exam>', exam)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
  }

  const setIr = (qid) => {
    res.push()
  }

  return (
    <div>

      <div className='bg-white grid grid-cols-4 flex-col justify-center items-center w-full px-4 pt-5 pb-6 mx-auto mt-8 mb-6 rounded-none shadow-xl sm:rounded-lg sm:px-6'>
        {questions.forEach((e, key) => (

          <NumberItem no={key+1} qid={e.id} ir={res.includes(e.order?e.order:e.id)?true:false} setIr={setIr} or={e.order}></NumberItem>
        ))}
        {/* {questions.forEach(element => (
          <NumberItem no={}, qid, ir, or></NumberItem>

        ))} */}
      </div>

    <Box sx={{ maxWidth: 500, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{questions[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}>
        {questions[activeStep].description}
        <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <TextAreaInput
            nameInput={questions[activeStep].id}
            required
            placeholder=""
            rows="6"
            className="w-full border border-gray-100 rounded py-4 px-6 text-sm bg-white"
            updateFormValue={updateFormValue}
          ></TextAreaInput>
          <button type='submit' className='btn btn-lg w-full bg-red-500 hover:bg-red-300'>Akhiri Ujian</button>

        </div>

        </form>
      {/* <Butto></ButtonS> */}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {!maxSteps? 'Selanjutnya': 'Akhiri Ujian'}
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Sebelumnya
          </Button>
        }
      />
    </Box>
 
</div>
  )
}

export default SEExam