// import { useState } from 'react';

// const Stepper = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [active, setActive] = useState(0);
  
//   const steps = [
//     { id: 1, title: 'Personal Info', description: 'Add your personal details' },
//     { id: 2, title: 'Education', description: 'Add your education history' },
//     { id: 3, title: 'Experience', description: 'Add your work experience' },
//     { id: 4, title: 'Skills', description: 'Add your skills and certifications' },
//     { id: 5, title: 'Review', description: 'Review your application' },
//     { id: 6, title: 'Submit', description: 'Complete your application' }
//   ];

//   const nextStep = () => {
//     if (activeStep < steps.length - 1) {
//       setActiveStep(activeStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (activeStep > 0) {
//       setActiveStep(activeStep - 1);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-3xl">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Application Process</h1>
//         <p className="text-gray-600 mb-8">Complete all steps to finish your application</p>
        
//         {/* Stepper */}
//         <div className="relative mb-12">
//           {/* Progress line */}
//           {/* <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2"></div> */}
          
//           {/* Progress fill */}
//           {/* <div 
//             className="absolute left-0 top-1/2 h-1 bg-orange-500 -translate-y-1/2 transition-all duration-300"
//             style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
//           ></div> */}
          
//           <div className="flex justify-between steps-container relative z-10">
//             {steps.map((step, index) => (
//                 // <div className=''>
//                  <div className={`steps ${active === 1? 'active': ''}`}
//                  onClick={() => setActive(index)}>
//                  sdsd
//                      {/* <span>
//                          <div className="stats shadow">
//                          <div className="stat">
// //                             <div className={`stat-figure dark:text-slate-300 text-${'COLORS[colorIndex%2]'}`}>{'icon'}</div>
// //                             <div className="stat-title dark:text-slate-300">{'title'}</div>
// //                             <div className={`stat-value dark:text-slate-300 text-${'COLORS[colorIndex%2]'}`}>{'value'}</div>
// //                             <div className={"stat-desc  " + 'getDescStyle()'}>{''}</div>
// //                         </div>
// //                     </div>

// //                 </span> */}
//              </div>
//                 // </div>
//             //   <div key={step.id} className="flex flex-col items-center">
//             //     {/* Step circle */}
//             //     <div 
//             //       className={`w-full h-52 steps flex items-center justify-center border-4 transition-all duration-300 cursor-pointer ${
//             //         index <= activeStep 
//             //           ? ' active bg-orange-500  text-white' 
//             //           : 'bg-white  text-gray-400'
//             //       }`}
//             //       onClick={() => setActiveStep(index)}
//             //     >
//             //       {index < activeStep ? (
//             //         <></>
//             //         // <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             //         //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//             //         // </svg>
//             //       ) : (
//             //         <span className="font-semibold">{step.id}</span>
//             //       )}
//             //     </div>
                
//             //     {/* Step label */}
//             //     <div className="mt-2 text-center">
//             //       <p className={`text-sm font-medium ${
//             //         index <= activeStep ? 'text-orange-600' : 'text-gray-500'
//             //       }`}>
//             //         {step.title}
//             //       </p>
//             //     </div>
//             //   </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Step Content */}
//         <div className="bg-gray-50 rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">
//             Step {activeStep + 1}: {steps[activeStep].title}
//           </h2>
//           <p className="text-gray-600 mb-4">{steps[activeStep].description}</p>
          
//           {/* Example form content based on step */}
//           <div className="space-y-4">
//             {activeStep === 0 && (
//               <div className="space-y-4">
//                 <input 
//                   type="text" 
//                   placeholder="Full Name" 
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//                 <input 
//                   type="email" 
//                   placeholder="Email Address" 
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//                 <input 
//                   type="tel" 
//                   placeholder="Phone Number" 
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>
//             )}
            
//             {activeStep === 1 && (
//               <div className="space-y-4">
//                 <input 
//                   type="text" 
//                   placeholder="School/University Name" 
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//                 <input 
//                   type="text" 
//                   placeholder="Degree" 
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//                 <input 
//                   type="text" 
//                   placeholder="Field of Study" 
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>
//             )}
            
//             {/* Add more step content as needed */}
//           </div>
//         </div>
        
//         {/* Navigation */}
//         <div className="flex justify-between items-center">
//           <button 
//             onClick={prevStep}
//             disabled={activeStep === 0}
//             className={`flex items-center px-5 py-2.5 rounded-lg border ${
//               activeStep === 0 
//                 ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
//                 : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//             </svg>
//             Previous
//           </button>
          
//           <div className="text-sm text-gray-500">
//             Step {activeStep + 1} of {steps.length}
//           </div>
          
//           <button 
//             onClick={nextStep}
//             disabled={activeStep === steps.length - 1}
//             className={`flex items-center px-5 py-2.5 rounded-lg ${
//               activeStep === steps.length - 1
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-orange-500 text-white hover:bg-orange-600'
//             }`}
//           >
//             {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
//             <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Stepper;

import DashboardStats from '../dashboard/components/DashboardStats'
import AmountStats from '../dashboard/components/AmountStats'
import PageStats from '../dashboard/components/PageStats'

import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
import { MdTaskAlt, MdNoteAlt, MdOutlineAddTask, MdOutlineNoteAlt,  } from 'react-icons/md'
import { BiTask } from 'react-icons/bi'
import { RiUserFollowLine, RiTShirt2Line, RiUserReceivedLine} from 'react-icons/ri'
import { FaMoneyBill} from 'react-icons/fa'
import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
import UserChannels from '../dashboard/components/UserChannels'
import LineChart from '../dashboard/components/LineChart'
import BarChart from '../dashboard/components/BarChart'
import DashboardTopBar from '../dashboard/components/DashboardTopBar'
import { useDispatch } from 'react-redux'
import {showNotification} from '../common/headerSlice'
import DoughnutChart from '../dashboard/components/DoughnutChart'
import { useEffect, useState } from 'react'
import supabase from "../../services/database-server"
import TabHeaderSE from '../../components/TabHeader/TabHeaderSE'
import { useParams } from 'react-router-dom'
// import {STATS_DATA} from '../../utils/dashboardDefaultData'


function AdmissionReport(){
    // const data = [
    //     {title : "Responden", value : "34.7k", icon : <UserGroupIcon className='w-8 h-8'/> },
    //     {title : "Ujian Aktif", value : "34.7k", icon : <MdTaskAlt className='w-8 h-8'/> },
    //     {title : "Bank Soal", value : "34.7k", icon : <MdNoteAlt className='w-8 h-8'/> },
    //     {title : "Pengguna Aktif", value : "34.7k", icon : <UsersIcon className='w-8 h-8'/> }]
    // const INITIAL_STATS = STATS_DATA
    // const 

    const dispatch = useDispatch()
    // const [statsData, setStatsData] = useEffect([])
    const [stats, setStats] = useState([])
    const [active, setActive] = useState(1)
    const [data_source, setDataSource_] = useState('pembayaran')
    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Jenjang', selected: false },
        {tab: 'Report', selected: true }
        // {tab: 'Jawaban Peserta', selected: false }
    ]
    const id = useParams().academic_year_id
    // const statsData = []
 
    useEffect(()=>{
        getStatsData()
        // console.log('statsData', statsData)
        
    },[])

    const getStatsData = async (range) => {

        if(!range){
            setStats([])
            let { data: exam_tests, error } = await supabase
                .from('applicants')
                .select('*, applicant_schools!inner(*) ')
                .eq('applicant_schools.admission_ays_id', id)
                .eq('status', 'active')
                .is('deleted_at', null)
                // .gt('created_at', )

                setStats((prev) => [...prev, {title : 'Pendaftar', value : exam_tests?.length, icon : <RiUserReceivedLine className='w-8 h-8'/>, description: "Total", colorIndex: "green-600", dataSource:'pendaftar'}])
                // <UserGroupIcon className='w-8 h-8'/>

        // statsData.push({title : 'Ujian Aktif', value : exam_tests.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
        
        let { data: exam_test_contents, error2 } = await supabase
                .from('participants')
                .select('*, applicants!inner(*, applicant_schools!inner(*))')
                .eq('applicants.applicant_schools.admission_ays_id', id)
                .is('deleted_at', null)
                setStats((prev) => [...prev, {title : 'Peserta', value : exam_test_contents?.length, icon : <RiUserFollowLine className='w-8 h-8'/>, description: "Total", dataSource:'peserta'}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Bank Soal', value : exam_test_contents.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_test_responses, error3 } = await supabase
                .from('participants')
                .select('*, applicants!inner(*, applicant_schools!inner(*), applicant_orders(*))')
                .eq('applicants.applicant_schools.admission_ays_id', id)
                .eq('applicants.applicant_orders.status', 'finished')
                .is('deleted_at', null)
                setStats((prev) => [...prev, {title : 'Pembayaran', value : exam_test_responses?.length, icon : <FaMoneyBill className='w-8 h-8'/>, description: "Total", dataSource:'pembayaran'}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Responden', value : exam_test_responses.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_profiles, error4 } = await supabase
                .from('participants')
                .select('*, applicants!inner(*, applicant_schools!inner(*), applicant_orders(*))')
                .eq('applicants.applicant_schools.admission_ays_id', id)
                .eq('is_draft', false)
                .eq('is_complete', true)
                .is('deleted_at', null)
                setStats((prev) => [...prev, {title : 'Pengisian Formulir', value : exam_profiles?.length, icon : <MdOutlineNoteAlt className='w-8 h-8'/>, description: "Selesai", dataSource:'pengisian_formulir'}])

        let { data: exam_participants, error_exam_participants } = await supabase
                .from('exam_test_participants')
                .select('*, exam_schedules(*) ')
                .eq('exam_schedules.admission_ays_id', id)
                .is('deleted_at', null)
                setStats((prev) => [...prev, {title : 'Seleksi', value : exam_participants?.length, icon : <BiTask className='w-8 h-8'/>, description: "Selesai", dataSource:'seleksi'}])
        let { data: uniform_sizing, error_uniform_sizing } = await supabase
                .from('participants')
                .select('*, applicants!inner(*, applicant_schools(*), applicant_orders(*))')
                .eq('applicants.applicant_schools.admission_ays_id', id)
                .eq('is_draft', false)
                .eq('is_complete', true)
                .eq('is_uniform_sizing', true)
                .is('deleted_at', null)
                setStats((prev) => [...prev, {title : 'Pengukuran Seragam', value : uniform_sizing?.length, icon : <RiTShirt2Line className='w-8 h-8'/>, description: "Selesai", dataSource:'pengukuran_seragam'}])
        }

        else if(range){
            setStats([])
            console.log(range.startDate.toISOString())
            let { data: exam_tests, error } = await supabase
                .from('exam_tests')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())

                setStats((prev) => [...prev, {title : 'Ujian Aktif', value : exam_tests.length, icon : <BiTask className='w-8 h-8'/>, description: "", colorIndex: "green-600", dataSource:'ujian_aktif'}])
                // <UserGroupIcon className='w-8 h-8'/>

        // statsData.push({title : 'Ujian Aktif', value : exam_tests.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
        
        let { data: exam_test_contents, error2 } = await supabase
                .from('exam_test_contents')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())
                setStats((prev) => [...prev, {title : 'Soal Aktif', value : exam_tests.length, icon : <MdOutlineAddTask className='w-8 h-8'/>, description: "", dataSource:'soal_aktif'}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Bank Soal', value : exam_test_contents.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_test_responses, error3 } = await supabase
                .from('exam_test_responses')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())
                setStats((prev) => [...prev, {title : 'Responden', value : exam_test_responses.length, icon : <RiUserFollowLine className='w-8 h-8'/>, description: "", dataSource:'responden'}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Responden', value : exam_test_responses.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_profiles, error4 } = await supabase
                .from('exam_profiles')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())
                setStats((prev) => [...prev, {title : 'Pengguna Aktif', value : exam_profiles.length, icon : <UserGroupIcon className='w-8 h-8'/>, description: "", dataSource:'pengguna_aktif'}])
        }
        
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Pengguna Aktif', value : exam_profiles.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
    //     setStatsData((prev) => (
    // {...prev,  {}}
    //     ))
    }
        
    
          
    

    const updateDashboardPeriod = (newRange) => {
        // Dashboard range changed, write code to refresh your values
        getStatsData(newRange)
        dispatch(showNotification({message : `Periode berhasil di update.`, status : 1}))
        // dari ${new Date(newRange.startDate.toISOString()).getDate() + } s/d ${newRange.endDate.toISOString()}`
    }

    const openStats = (number) =>{
        setActive(number)
    }

    const setDataSource = (data) => {
        setDataSource_(data)
    }

    return(
        <>
        <TabHeaderSE id = {id} options={options} activeKey='Report' ></TabHeaderSE>
        {/** ---------------------- Select Period Content ------------------------- */}
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>
        
        {/* <div className='page'>
            <div className='right-arrow'>
                Step 1
            </div>
        </div>
        <div className='page'>
            <div className={`right-arrow ${active === 1? 'active': ''}`}>
                sdsd
                <span>
                    <div className="stats shadow">
                        <div className="stat">
                            <div className={`stat-figure dark:text-slate-300 text-${'COLORS[colorIndex%2]'}`}>{'icon'}</div>
                            <div className="stat-title dark:text-slate-300">{'title'}</div>
                            <div className={`stat-value dark:text-slate-300 text-${'COLORS[colorIndex%2]'}`}>{'value'}</div>
                            <div className={"stat-desc  " + 'getDescStyle()'}>{''}</div>
                        </div>
                    </div>

                </span>
            </div>
            <div className={`right-arrow ${active === 2? 'active': ''}`}>
                <span>Step 2</span>
                <br/>
            </div>
            <div class={`right-arrow ${active === 3? 'active': ''}`}>
                <span>Step 3</span>
            </div>
            <div class='right-arrow'>
                <span>Step 4</span>
            </div>
            <div class='right-arrow'>
                <span>Step 5</span>
            </div>  
            <div class='right-arrow'>
                <span>Step 6</span>
            </div>    
            </div> */}
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    stats.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={d.colorIndex??'-'} dataSource={d.dataSource} setDataSource={setDataSource} />
                        )
                    })
                }
            </div>



        {/** ---------------------- Different charts ------------------------- */}
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart data_source={data_source} />
                <BarChart />
            <UserChannels />
            </div>
            
        {/** ---------------------- Different stats content 2 ------------------------- */}
        
            {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div> */}

        {/** ---------------------- User source channels table  ------------------------- */}
        
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <DoughnutChart id={id} />
            </div>
        </>
    )
}

export default AdmissionReport