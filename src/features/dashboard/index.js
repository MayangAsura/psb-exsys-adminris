import DashboardStats from './components/DashboardStats'
import AmountStats from './components/AmountStats'
import PageStats from './components/PageStats'

import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
import { MdTaskAlt, MdNoteAlt, MdOutlineAddTask } from 'react-icons/md'
import { BiTask } from 'react-icons/bi'
import { RiUserFollowLine } from 'react-icons/ri'
import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
import UserChannels from './components/UserChannels'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import DashboardTopBar from './components/DashboardTopBar'
import { useDispatch } from 'react-redux'
import {showNotification} from '../common/headerSlice'
import DoughnutChart from './components/DoughnutChart'
import { useEffect, useState } from 'react'
import supabase from "../../services/database-server"
// import {STATS_DATA} from '../../utils/dashboardDefaultData'


function Dashboard(){
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
    // const statsData = []
 
    useEffect(()=>{
        getStatsData()
        // console.log('statsData', statsData)
        
    },[])

    const getStatsData = async (range) => {

        if(!range){
            setStats([])
            let { data: exam_tests, error } = await supabase
                .from('exam_tests')
                .select('*')
                // .gt('created_at', )

                setStats((prev) => [...prev, {title : 'Ujian Aktif', value : exam_tests.length, icon : <BiTask className='w-8 h-8'/>, description: "", colorIndex: "green-600"}])
                // <UserGroupIcon className='w-8 h-8'/>

        // statsData.push({title : 'Ujian Aktif', value : exam_tests.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
        
        let { data: exam_test_contents, error2 } = await supabase
                .from('exam_test_contents')
                .select('*')
                setStats((prev) => [...prev, {title : 'Soal Aktif', value : exam_test_contents.length, icon : <MdOutlineAddTask className='w-8 h-8'/>, description: ""}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Bank Soal', value : exam_test_contents.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_test_responses, error3 } = await supabase
                .from('exam_test_responses')
                .select('*')
                setStats((prev) => [...prev, {title : 'Responden', value : exam_test_responses.length, icon : <RiUserFollowLine className='w-8 h-8'/>, description: ""}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Responden', value : exam_test_responses.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_profiles, error4 } = await supabase
                .from('exam_profiles')
                .select('*')
                setStats((prev) => [...prev, {title : 'Pengguna Aktif', value : exam_profiles.length, icon : <UserGroupIcon className='w-8 h-8'/>, description: ""}])
        }

        else if(range){
            setStats([])
            console.log(range.startDate.toISOString())
            let { data: exam_tests, error } = await supabase
                .from('exam_tests')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())

                setStats((prev) => [...prev, {title : 'Ujian Aktif', value : exam_tests.length, icon : <BiTask className='w-8 h-8'/>, description: "", colorIndex: "green-600"}])
                // <UserGroupIcon className='w-8 h-8'/>

        // statsData.push({title : 'Ujian Aktif', value : exam_tests.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
        
        let { data: exam_test_contents, error2 } = await supabase
                .from('exam_test_contents')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())
                setStats((prev) => [...prev, {title : 'Soal Aktif', value : exam_test_contents.length, icon : <MdOutlineAddTask className='w-8 h-8'/>, description: ""}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Bank Soal', value : exam_test_contents.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_test_responses, error3 } = await supabase
                .from('exam_test_responses')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())
                setStats((prev) => [...prev, {title : 'Responden', value : exam_test_responses.length, icon : <RiUserFollowLine className='w-8 h-8'/>, description: ""}])
                // <UserGroupIcon className='w-8 h-8'/>
        // statsData.push({title : 'Responden', value : exam_test_responses.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_profiles, error4 } = await supabase
                .from('exam_profiles')
                .select('*')
                .gte('created_at', range.startDate.toISOString())
                .lte('created_at', range.endDate.toISOString())
                setStats((prev) => [...prev, {title : 'Pengguna Aktif', value : exam_profiles.length, icon : <UserGroupIcon className='w-8 h-8'/>, description: ""}])
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

    return(
        <>
        {/** ---------------------- Select Period Content ------------------------- */}
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>
        
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    stats.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>



        {/** ---------------------- Different charts ------------------------- */}
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div> */}
            
        {/** ---------------------- Different stats content 2 ------------------------- */}
        
            {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div> */}

        {/** ---------------------- User source channels table  ------------------------- */}
        
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <UserChannels />
                <DoughnutChart />
            </div> */}
        </>
    )
}

export default Dashboard