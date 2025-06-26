import DashboardStats from './components/DashboardStats'
import AmountStats from './components/AmountStats'
import PageStats from './components/PageStats'

import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
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

const STATS_DATA = [
    {title : "Responden", value : "34.7k", icon : <UserGroupIcon className='w-8 h-8'/> },
    {title : "Ujian Aktif", value : "34.7k", icon : <UserGroupIcon className='w-8 h-8'/> },
    {title : "Bank Soal", value : "34.7k", icon : <UserGroupIcon className='w-8 h-8'/> },
    {title : "Pengguna Aktif", value : "34.7k", icon : <UsersIcon className='w-8 h-8'/> }
    // description : "↗︎ 2300 (22%)"},
    // description : "↗︎ 2300 (22%)"},
    // description : "↗︎ 2300 (22%)"},
    // description : "↗︎ 2300 (22%)"},
    // {title : "Total Sales", value : "$34,545", icon : <CreditCardIcon className='w-8 h-8'/>, description : "Current month"},
    // {title : "Pending Leads", value : "450", icon : <CircleStackIcon className='w-8 h-8'/>, description : "50 in hot leads"},
    // {title : "Active Users", value : "5.6k", icon : <UsersIcon className='w-8 h-8'/>, description : "↙ 300 (18%)"},
]



function Dashboard(){

    const dispatch = useDispatch()
    const [statsData, setStatsData] = useEffect(STATS_DATA)
    // const statsData = []
 
    useEffect(()=>{
        getStatsData()
        console.log(statsData)
    },[])

    const getStatsData = ( async () => {

        let { data: exam_tests, error } = await supabase
                .from('exam_tests')
                .select('*')

        statsData.push({title : 'Ujian Aktif', value : exam_tests.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
        
        let { data: exam_test_contents, error2 } = await supabase
                .from('exam_test_contents')
                .select('*')

        statsData.push({title : 'Bank Soal', value : exam_test_contents.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_test_responses, error3 } = await supabase
                .from('exam_test_responses')
                .select('*')

        statsData.push({title : 'Responden', value : exam_test_responses.length(), icon : <UserGroupIcon className='w-8 h-8'/>})

        let { data: exam_profiles, error4 } = await supabase
                .from('exam_profiles')
                .select('*')

        statsData.push({title : 'Pengguna Aktif', value : exam_profiles.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
    //     setStatsData((prev) => (
    // {...prev,  {}}
    //     ))
    }
        
    
          
    )

    const updateDashboardPeriod = (newRange) => {
        // Dashboard range changed, write code to refresh your values
        dispatch(showNotification({message : `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status : 1}))
    }

    return(
        <>
        {/** ---------------------- Select Period Content ------------------------- */}
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>
        
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    STATS_DATA.map((d, k) => {
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