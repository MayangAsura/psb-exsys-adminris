import React, { useEffect, useState } from 'react'
// import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import TextAreaInput from '../../../../components/Input/TextAreaInput'
import { openModal } from "../../../../features/common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../../utils/globalConstantUtil'

import supabase from '../../../../services/database-server';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';



function SEExam() {
  const [questions, setQuestions] = useState([])
  const dispatch = useDispatch()
  const id = useParams().id
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
    description: `Bagaimana Ananda merokok?`,
  },
];

useEffect(() => {
  getQuestions(id)
}, [id])

  const getQuestions = async (id) => {

  let { data: exam_test_contents, error } = await supabase
    .from('exam_test_contents')
    .select('*')
    .eq('exam_test_id', id)

    if(error){
      openErrorModal()
    }else{
      console.log(exam_test_contents);
      exam_test_contents.map((e, key) => {
        // questions.push({label: `Soal `+key+1, description: e.question })
        setQuestions([...questions, {label: `Soal `+key+1, description: e.question }])
        // setQuestions((prev) => [...prev, {label: `Soal `+key+1, description: e.question }])
      })
      Object.keys(exam_test_contents).map(function(key){
        // obj = [key, {labe}];
      });
      console.log('questions', questions)
    }
    function convertObjectToList(obj) {
  
}
  
  }

  const openErrorModal = () => {
    dispatch(openModal({title : "Data Tidak ditemukan", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS}))
  }
  // const openSuccessModal = () => {
  //   dispatch(openModal({title : "Login Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_ERROR}))
  // }


 const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = questions.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>

    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
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
      <TextAreaInput></TextAreaInput>
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
            Next
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
            Back
          </Button>
        }
      />
    </Box>
 
</div>
  )
}

export default SEExam