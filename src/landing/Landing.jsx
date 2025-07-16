import Footer from "./components/sections/Footer/Footer";
import Navbar from "./components/sections/Navbar/Navbar";
import ProfileCover from "./components/sections/ProfileCover/ProfileCover";
import Sidebar from "./components/sections/Sidebar/Sidebar";
import Profile from "./components/sections/ProfileCard/Profile"; 
import Presence from "./components/sections/Presence/Presence"; 
import Exam from "./components/sections/Exams/Exam";
import Header from "./components/Header";
import '../index-user.css'

import axios from "axios";
import supabase from "../services/database-server";


import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from "react";

function Landing() {

  const [applicant, setApplicant] = useState({})
  const [sid, setScheduleId] = useState("")
  const [ip, setIp] = useState("")
  // const [applicant, setApplicant] = useState({id: "133c032c-6903-4e25-a2db-579d431fe6b4", sid: "d17ff676-85d2-4f9e-88f1-0fdfb37517b9"})
  useEffect(()=> {
    getApplicant()
    // getIp()
  }, [])
  const getIp = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data)
    setIp(res.data.ip)
  } 
  const getApplicant = async () =>{
    const token_user = localStorage.getItem('token-user')
    if(token_user){
      
      let { data: applicants, errorApp } = await supabase
        .from('applicants')
        .select('id')
        .eq('refresh_token', token_user)
        console.log(applicants)
      if(applicants){

        setApplicant(applicants[0])
      // let { data: exam_test_participants, errorpart } = await supabase
      //   .from('exam_schedule_tests')
      //   .select('*, exam_tests(exam_test_participants(appl_id))')
        // .eq('appl_id', applicants[0].id)

        let { data: exam_test_participants, error2 } = await supabase
    .from('exam_tests')
    .select('*, exam_test_participants(appl_id), exam_schedule_tests(exam_schedule_id)')
    // .eq('exam_tests[0].exam_schedule_tests.exam_schedule_id', sid)
    .eq('exam_test_participants.appl_id', applicants[0].id)
    // .eq('exam_schedule_tests.exam_schedule_id', sid)

        if(exam_test_participants){
          setScheduleId(exam_test_participants[0].exam_schedule_tests[0].exam_schedule_id)
          // sid = exam_test_participants[0].exam_tests.exam_schedule_tests[0].exam_schedule_id
          console.log('sid', sid)
        }
      }
      
      
  
    }
      
  }
  const page = 'Beranda'
  return (
    <main className="min-h-screen relative bg-gray-50 pb-10" >
      <Header />
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
