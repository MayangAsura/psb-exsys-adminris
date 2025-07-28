import React, { useEffect, useState } from "react";
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGraduationCap,
  FaInstagram,
  FaLinkedinIn,
  FaSkype,
  FaTwitter,
  FaUserCircle
} from "react-icons/fa";
import { FaBootstrap, FaCode, FaHtml5, FaReact } from "react-icons/fa";
import { TbUserSquareRounded } from "react-icons/tb";
// import ExamItem from "./items/ExamItem";
import ExamItem from "../../components/sections/Exams/items/ExamItem";
// import ProfileCover from "../../components/ProfileCover/ProfileCover";
import ProfileCover from "../../components/sections/ProfileCover/ProfileCover";
// import ServiceItem from "../..pages/Service/ServiceItem";
// import profile from "../../../images/profile.jpg";

// import supabase from "../../../services/database/database";
// import supabase from "../../../../services/database-server";
import supabase from "../../../services/database-server";


const socials = [
  {
    id: 1,
    icon: <FaFacebookF />,
    link: "#0",
  },
  {
    id: 2,
    icon: <FaGithub />,
    link: "#0",
  },
  {
    id: 3,
    icon: <FaLinkedinIn />,
    link: "#0",
  },
  {
    id: 4,
    icon: <FaInstagram />,
    link: "#0",
  },
  {
    id: 5,
    icon: <FaBehance />,
    link: "#0",
  },
  {
    id: 6,
    icon: <FaDribbble />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaSkype />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaTwitter />,
    link: "#0",
  },
];

const serviceData = [
  {
    id: 1,
    icon: <FaCode />,
    title: "Web Design",
    description:
      "Lorem ipsum dolor sit aconsect dipisicing elit, sed do eiusmod to incididunt uabore etdolore magna aliqua.",
  },
  {
    id: 2,
    icon: <FaHtml5 />,
    title: "Web Development",
    description:
      "Lorem ipsum dolor sit aconsect dipisicing elit, sed do eiusmod to incididunt uabore etdolore magna aliqua.",
  },
  {
    id: 3,
    icon: <FaReact />,
    title: "Frontend Development",
    description:
      "Lorem ipsum dolor sit aconsect dipisicing elit, sed do eiusmod to incididunt uabore etdolore magna aliqua.",
  },
  {
    id: 4,
    icon: <FaBootstrap />,
    title: "Bootstrap Template",
    description:
      "Lorem ipsum dolor sit aconsect dipisicing elit, sed do eiusmod to incididunt uabore etdolore magna aliqua.",
  },
  {
    id: 4,
    // icon: <SiTailwindcss />,
    title: "Tailwindcss Template",
    description:
      "Lorem ipsum dolor sit aconsect dipisicing elit, sed do eiusmod to incididunt uabore etdolore magna aliqua.",
  },
  {
    id: 4,
    icon: <FaReact />,
    title: "React Template",
    description:
      "Lorem ipsum dolor sit aconsect dipisicing elit, sed do eiusmod to incididunt uabore etdolore magna aliqua.",
  },
];



const Exam = ({id, sid}) => {

  const [examData, setExamData] = useState([])
  const [nsid, setNsid] = useState("")
  const [nid, setNid] = useState("")
  // let nsid = ''
  // let nid = ''
  // const [examData, setExamData] = useState([{id: "sdsf", name: "Test TKD", score: 100, start_at: new Date().toISOString(), end_at: new Date().toISOString()}])

  useEffect(() => {
    console.log('id', id)
    
    getExamData(id, sid)
  },[id, sid])

  const getExamData = async(id, sid) => {  
    console.log('sid', sid)
  
  // let { data: exam_tests, error } = await supabase
  //   .from('exam_tests')
  //   .select('*')

    // .eq('appl_id', id)
    // .eq('exam_schedule_id', sid)
    // exam_schedule_tests(exam_schedule_id), exam_test_participant(appl_id)

  // let { data: exam_test_participants, error2 } = await supabase
  //   .from('exam_test_participants')
  //   .select('appl_id, exam_tests(*, exam_schedule_tests(exam_schedule_id))')
  //   // .eq('exam_tests[0].exam_schedule_tests.exam_schedule_id', sid)
  //   .eq('appl_id', id)
  setNsid(sid)
  setNid(id)
  if(!sid || sid == null){
      
      setNsid('d17ff676-85d2-4f9e-88f1-0fdfb37517b9')
    }
    if(!id || id == null){
      setNid('e91f0c82-6a57-4b76-a4bb-6d7fc59c51a5')
    }
  let { data: exam_test_participants, error2 } = await supabase
    .from('exam_tests')
    .select('*, exam_test_participants(appl_id), exam_schedule_tests(exam_schedule_id)')
    // .eq('exam_tests[0].exam_schedule_tests.exam_schedule_id', sid)
    .eq('exam_test_participants.appl_id', 'd17ff676-85d2-4f9e-88f1-0fdfb37517b9')
    .eq('exam_schedule_tests.exam_schedule_id', 'e91f0c82-6a57-4b76-a4bb-6d7fc59c51a5')
  

    if(!error2){
      console.log('exam', exam_test_participants)
      // const {exam_schedule_test, ...data} = exam_test_participants[0]
      setExamData(exam_test_participants)
      console.log('examData', examData)
    }

    // console.log(exam_tests)
          
  }

  // const ExamList = examData.map((e) => (
  //   <ExamItem exam={e}  />
  // ))
  return (
    <section className="pb-10">
      
        <div className="w-full container px-4">
            <div className="my-4 md:mx-4 shadow p-6 rounded-md bg-white group hover:shadow-md">
              <div className="flex flex-row gap-3 justify-start items-center">
              
                      <div className="w-16 h-16 flex items-center justify-center rounded-md text-3xl mb-5 bg-orange-100 text-green-600 transition duration-200 group-hover:bg-green-600 group-hover:text-white">
                        {(<FaGraduationCap />)}
                        {/* {icon} */}
                      </div>
                      <div className="flex justify-center -mt-5">
                        <span className="flex text-2xl items-center">Asesmen</span>
                      </div>
                    </div>
                <div className=" flex items-center justify-center rounded-md text-3xl mb-5 text-green-600 transition duration-200 ">
                  {/* {(<FaGraduationCap />)} */}
                    {/* <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 490 490" space="preserve">
                    <g>
                        <g>
                            <g>
                                <path d="M449.25,0H40.85c-11.2,0-20.4,9.2-20.4,20.4v449.2c0,11.2,9.2,20.4,20.4,20.4h408.3c11.2,0,20.4-9.2,20.4-20.4V20.4
                                    C469.65,9.2,460.45,0,449.25,0z M428.85,449.2H61.35V40.8h367.5V449.2z"/>
                                <path d="M130.75,132.7h228.7c11.2,0,19.4-9.2,19.4-20.4s-9.2-20.4-20.4-20.4h-227.7c-11.2,0-20.4,9.2-20.4,20.4
                                    C110.35,123.5,119.45,132.7,130.75,132.7z"/>
                                <path d="M130.75,245h228.7c11.2,0,19.4-9.2,19.4-20.4s-9.2-20.4-20.4-20.4h-227.7c-11.2,0-20.4,9.2-20.4,20.4
                                    C110.35,235.8,119.45,245,130.75,245z"/>
                                <path d="M360.45,306.3l-30.1,30.8l-30.1-30.8c-7.1-8.2-20.4-8.2-28.6,0c-8.2,7.1-8.2,20.4,0,28.6l30.4,31.1l-30.4,31.1
                                    c-8.2,8.2-8.2,20.4,0,28.6c4.1,4.1,15.3,11.7,28.6,0l30.1-30.8l30.1,30.8c12.4,11.7,24.5,4.1,28.6,0c8.2-7.1,8.2-20.4,0-28.6
                                    l-30.5-31.1l30.4-31.1c8.2-8.2,8.2-20.4,0-28.6C380.85,298.1,368.55,298.1,360.45,306.3z"/>
                            </g>
                        </g>
                    </g>
                </svg> */}
                {/* {icon} */}
                <div className="flex flex-wrap md:px-4">
                  { examData.map((e, k) => (
                    <ExamItem exam={e} key={k} />
                  ))}
                  {/* {ExamList} */}
                  {/* {examData.forEach((element, id) => {
                    <ExamItem exam={element} key={id} />
                  })  } */}
                {/* {examData.map((element, id) => {
                  Object.values(element).map((e) => (

                    <ExamItem exam={e} key={id} />
                  )  )
                })
                } */}
                {/* // ((exam, id) => (
                // ))} */}
                </div>
                </div>
                
            </div>
        </div>
    </section>
  );
};

export default Exam;