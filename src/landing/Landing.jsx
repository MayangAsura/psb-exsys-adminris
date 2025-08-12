import Footer from "./components/sections/Footer/Footer";
import Navbar from "./components/sections/Navbar/Navbar";
import ProfileCover from "./components/sections/ProfileCover/ProfileCover";
import Sidebar from "./components/sections/Sidebar/Sidebar";
import Profile from "./sections/ProfileCard/Profile"; 
import Presence from "./components/sections/Presence/Presence";
import Exam from "./sections/Exams/Exam";
import Header from "./components/Header";
import '../index-user.css'

import { MODAL_BODY_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES } from "../utils/globalConstantUtil";
import { openModal } from "../features/common/modalSlice";

import axios from "axios";
import supabase from "../services/database-server";


import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Landing() {

  const [applicant, setApplicant] = useState({})
  const [sid, setScheduleId] = useState("")
  const [ip, setIp] = useState("")
  const dispatch = useDispatch()
  // const [applicant, setApplicant] = useState({id: "133c032c-6903-4e25-a2db-579d431fe6b4", sid: "d17ff676-85d2-4f9e-88f1-0fdfb37517b9"})
  useEffect(()=> {
    getApplIp()
    getApplicant()
    console.log('applicant', applicant)
    // getIp()
  }, [applicant])
  const getApplIp = async () => {
    fetch('https://geolocation-db.com/json/')
      .then(response => response.json())
      .then(data => {
        setIp(data.IPv4)
        // setCountry(data.country_name)
        // setLatitude(data.latitude)
        // setLongitude(data.longitude)
      })
      .catch(error => console.log(error))
    // const res = await axios.get("https://api.ipify.org/?format=json");
    // console.log(res.data)
    // setIp(res.data.ip)
    
  }
  const getIp = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data)
    setIp(res.data.ip)
  } 
  const getApplicant = async () =>{
    const token_user = localStorage.getItem('token-user')
    if(token_user){
      
      let { data: applicants, error } = await supabase.from('applicants').select('*')
      .eq('refresh_token', token_user)
      console.log('masuk getapl-')
      // .eq('status', 'active')
      // console.log(applicants)
      if(applicants){
        // full_name, phone_number, regist_number, participants(dob, home_address, participant_father_data(father_name), participant_mother_data(mother_name))π
        setApplicant(applicants[0])
        console.log('applicant from g', applicant)
      // let { data: exam_test_participants, errorpart } = await supabase
      //   .from('exam_schedule_tests')
      //   .select('*, exam_tests(exam_test_participants(appl_id))')
        // .eq('appl_id', applicants[0].id)

        let { data: exam_test_participants, error2 } = await supabase
    .from('exam_tests')
    .select('id, exam_test_participants(appl_id), exam_schedule_tests(exam_schedule_id)')
    // .eq('exam_tests[0].exam_schedule_tests.exam_schedule_id', sid)
    .eq('exam_test_participants.appl_id', applicant.id)
    .neq('exam_schedule_tests.exam_schedule_id', null)
    // .neq('exam_test_participants.appl_id', null)

    console.log('exam_test_participants', exam_test_participants)
    if(!exam_test_participants || error2){
          // openErrorModal()
        }
        if(exam_test_participants){
          // console.log(exam_test_participants[0])
          setScheduleId(exam_test_participants[0]?.exam_schedule_tests[0]?.exam_schedule_id)
          console.log('sid-', sid)
          // sid = exam_test_participants[0]?.exam_schedule_tests[0]?.exam_schedule_id??''
          // sid = exam_test_participants[0].exam_tests.exam_schedule_tests[0].exam_schedule_id
        }
        
      }
      
      
  
    }
      
  }
  const openErrorModal = () => {
        console.log('schedule')
        dispatch(openModal({title : "Error Akses", bodyType : MODAL_BODY_TYPES.MODAL_ERROR,
            extraObject : {message : "Halaman ini dibatasi. Mohon periksa jadwal ujian Anda", type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_ERROR}
        }))
    }
  const page = 'Beranda'
  return (
    <main className="min-h-screen relative bg-gray-50 pb-10" >
      <Header id={applicant.id}/>
      {/* style={{ maxWidth:390 }} */}
      <ProfileCover page={page} />
      <div className="container px-4">
        <div className="flex flex-wrap px-4">
          <div className="w-full lg:w-1/3 mb-5 my">
            <Profile id={applicant.id} sid={sid} ip={ip} />
          </div>
          <div className="w-full lg:w-2/3 ">
            <Presence id={applicant.id} sid={sid} />
            <Exam id={applicant.id} sid={sid} />
            {/* <Navbar /> */}
          </div>
          {/* <div className="w-full lg:w-2/3 ">
            
            <Navbar />
          </div> */}
        </div>
      </div>
      <Footer />
      <HelmetProvider>
        <Helmet>
          <script src="https://kutty.netlify.app/kutty.js"></script>
        </Helmet>
      </HelmetProvider>
    </main>
  );
}

export default Landing;
