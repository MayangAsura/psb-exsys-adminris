import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import supabase from '../../../services/database-server';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart({ data_source }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Function to get dates for the current week
  const getCurrentWeekDates = () => {
    const dates = [];
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    
    return dates;
  };

  // Function to get day names for labels
  const getDayNames = () => {
    const dates = getCurrentWeekDates();
    return dates.map(date => {
      const day = new Date(date);
      return day.toLocaleDateString('id-ID', { weekday: 'short' });
    });
  };

  // Function to fetch data for a specific date
  const fetchDataForDate = async (date, source) => {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      switch(source) {
        case 'pendaftar':
          const { data: exam_tests, error } = await supabase
            .from('applicants')
            .select('*, applicant_schools!inner(*)')
            .eq('status', 'active')
            .is('deleted_at', null)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());
          
          if (error) throw error;
          return exam_tests?.length || 0;

        case 'peserta':
          const { data: exam_test_contents, error: error2 } = await supabase
            .from('participants')
            .select('*, applicants!inner(*, applicant_schools!inner(*))')
            .is('deleted_at', null)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());
          
          if (error2) throw error2;
          return exam_test_contents?.length || 0;

        case 'pembayaran':
          const { data: exam_test_responses, error: error3 } = await supabase
            .from('participants')
            .select('*, applicants!inner(*, applicant_schools!inner(*), applicant_orders(*))')
            .eq('applicants.applicant_orders.status', 'finished')
            .is('deleted_at', null)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());
          
          if (error3) throw error3;
          return exam_test_responses?.length || 0;

        case 'pengisian_formulir':
          const { data: exam_profiles, error: error4 } = await supabase
            .from('participants')
            .select('*, applicants!inner(*, applicant_schools!inner(*), applicant_orders(*))')
            .eq('is_draft', false)
            .eq('is_complete', true)
            .is('deleted_at', null)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());
          
          if (error4) throw error4;
          return exam_profiles?.length || 0;

        case 'seleksi':
          const { data: exam_participants, error: error_exam_participants } = await supabase
            .from('exam_test_participants')
            .select('*, exam_schedules(*)')
            .is('deleted_at', null)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());
          
          if (error_exam_participants) throw error_exam_participants;
          return exam_participants?.length || 0;

        case 'pengukuran_seragam':
          const { data: uniform_sizing, error: error_uniform_sizing } = await supabase
            .from('participants')
            .select('*, applicants!inner(*, applicant_schools(*), applicant_orders(*))')
            .eq('is_draft', false)
            .eq('is_complete', true)
            .eq('is_uniform_sizing', true)
            .is('deleted_at', null)
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());
          
          if (error_uniform_sizing) throw error_uniform_sizing;
          return uniform_sizing?.length || 0;

        default:
          return 0;
      }
    } catch (err) {
      console.error(`Error fetching data for ${date}:`, err);
      return 0;
    }
  };

  // Fetch data for the entire week
  const fetchWeeklyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const weekDates = getCurrentWeekDates();
      const dataPromises = weekDates.map(date => fetchDataForDate(date, data_source));
      const dataValues = await Promise.all(dataPromises);
      
      const labels = getDayNames();
      
      setChartData({
        labels,
        datasets: [
          {
            fill: true,
            label: getDataSourceLabel(data_source),
            data: dataValues,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      setError('Gagal memuat data grafik');
      console.error('Error fetching weekly data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get proper label for data source
  const getDataSourceLabel = (source) => {
    const labels = {
      'pendaftar': 'Pendaftar',
      'peserta': 'Peserta',
      'pembayaran': 'Pembayaran',
      'pengisian_formulir': 'Pengisian Formulir',
      'seleksi': 'Seleksi',
      'pengukuran_seragam': 'Pengukuran Seragam'
    };
    
    return labels[source] || 'Data';
  };

  useEffect(() => {
    fetchWeeklyData();
  }, [data_source]);

  if (loading) {
    return (
      <TitleCard title={`Data ${getDataSourceLabel(data_source)} (Minggu Ini)`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </TitleCard>
    );
  }

  if (error) {
    return (
      <TitleCard title={`Data ${getDataSourceLabel(data_source)} (Minggu Ini)`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
          <button 
            onClick={fetchWeeklyData}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Coba Lagi
          </button>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard title={`Data ${getDataSourceLabel(data_source)} (Pekan Ini)`}>
      <Line data={chartData} options={options} />
      <div className="mt-2 text-xs text-gray-500 text-center">
        Data untuk pekan ini ({getCurrentWeekDates()[0]} hingga {getCurrentWeekDates()[6]})
      </div>
    </TitleCard>
  );
}

export default LineChart;
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import TitleCard from '../../../components/Cards/TitleCard';
// import { toUpperCase } from 'zod';

// import supabase from '../../../services/database-server';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend
// );

// function LineChart({data_source}){

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//     },
//   };


  
//   // const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
//   // Function to get dates for the current week
//   const getCurrentWeekDates = () => {
//     const dates = [];
//     const today = new Date();
//     const firstDayOfWeek = new Date(today);
//     firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(firstDayOfWeek);
//       date.setDate(firstDayOfWeek.getDate() + i);
//       dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
//     }
    
//     return dates;
//   };

//   const fetchDataForDate = async (date) => {
//     const startOfDay = new Date(date);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);
    
//     const { data, error } = await supabase
//       .from('applicants')
//       .select('*, applicant_schools!inner(*)')
//       .eq('status', 'active')
//       .is('deleted_at', null)
//       .gte('created_at', startOfDay.toISOString())
//       .lte('created_at', endOfDay.toISOString());
    
//     return { date, data, error };
//   };

//   const getDailyData = async (val, data_source) => {
//     // let { data: participants, error } = await supabase
//     //         .from('applicants')
//     //         .select('*, applicant_orders(*) ')
//     //         // .eq('applicant_orders.status', 'finished')
//     //         .eq('status', 'active')
//     //         .is('deleted_at', null)
//     //         .eq('EXTRACT(WEEK FROM applicant_orders.updated_at)', week)
//     //         .eq('EXTRACT(MONTH FROM applicant_orders.updated_at)', month)

//     //         if(participants){
//     //           console.log('participants', participants)
//     //           return participants.length
//     //         }

//             if(data_source == 'pendaftar'){
//               let { data: exam_tests, error } = await supabase
//                   .from('applicants')
//                   .select('*, applicant_schools!inner(*) ')
//                   // .eq('applicant_schools.admission_ays_id', id)
//                   // .eq('EXTRACT(DAY FROM applicants.created_at)', val)
//                   .eq('status', 'active')
//                   .is('deleted_at', null)
//                   // .gt('created_at', )
  
//                   // setStats((prev) => [...prev, {title : 'Pendaftar', value : exam_tests?.length, icon : <RiUserReceivedLine className='w-8 h-8'/>, description: "Total", colorIndex: "green-600", dataSource:'pendaftar'}])

//                   if(exam_tests){
//                     return exam_tests.length
//                   }else{
//                     return 0
//                   }

//             }

//             if(data_source == 'peserta'){
              
//               let { data: exam_test_contents, error2 } = await supabase
//                       .from('participants')
//                       .select('*, applicants!inner(*, applicant_schools!inner(*))')
//                       // .eq('applicants.applicant_schools.admission_ays_id', id)
//                       // .eq('EXTRACT(DAY FROM applicants.created_at)', val)
//                       .is('deleted_at', null)
//                       // setStats((prev) => [...prev, {title : 'Peserta', value : exam_test_contents?.length, icon : <RiUserFollowLine className='w-8 h-8'/>, description: "Total", dataSource:'peserta'}])

//                       if(exam_test_contents){
//                         return exam_test_contents.length
//                       }else{
//                         return 0
//                       }
//             }

//             if(data_source == 'pembayaran'){
              
//               let { data: exam_test_responses, error3 } = await supabase
//                       .from('participants')
//                       .select('*, applicants!inner(*, applicant_schools!inner(*), applicant_orders(*))')
//                       // .eq('applicants.applicant_schools.admission_ays_id', id)
//                       .eq('applicants.applicant_orders.status', 'finished')
//                       // .eq('EXTRACT(DAY FROM applicants.created_at)', val)
//                       .is('deleted_at', null)
//                       // setStats((prev) => [...prev, {title : 'Pembayaran', value : exam_test_responses?.length, icon : <FaMoneyBill className='w-8 h-8'/>, description: "Total", dataSource:'pembayaran'}])
                      
//                       if(exam_test_responses){
//                         return exam_test_responses.length
//                       }else{
//                         return 0
//                       }
//               }
//                 // <UserGroupIcon className='w-8 h-8'/>
//         // statsData.push({title : 'Responden', value : exam_test_responses.length(), icon : <UserGroupIcon className='w-8 h-8'/>})
//             if(data_source == 'pengisian_formulir'){
              
//               let { data: exam_profiles, error4 } = await supabase
//                       .from('participants')
//                       .select('*, applicants!inner(*, applicant_schools!inner(*), applicant_orders(*))')
//                       // .eq('applicants.applicant_schools.admission_ays_id', id)
//                       // .eq('EXTRACT(DAY FROM applicants.created_at)', val)
//                       .eq('is_draft', false)
//                       .eq('is_complete', true)
//                       .is('deleted_at', null)
//                       // setStats((prev) => [...prev, {title : 'Pengisian Formulir', value : exam_profiles?.length, icon : <MdOutlineNoteAlt className='w-8 h-8'/>, description: "Selesai", dataSource:'pengisian_formulir'}])
                      
//                       if(exam_profiles){
//                         return exam_profiles.length
//                       }else{
//                         return 0
//                       }
//             }

//             if(data_source == 'seleksi'){
              
//               let { data: exam_participants, error_exam_participants } = await supabase
//                       .from('exam_test_participants')
//                       .select('*, exam_schedules(*) ')
//                       // .eq('exam_schedules.admission_ays_id', id)
//                       .eq('EXTRACT(DAY FROM applicants.created_at)', val)
//                       .is('deleted_at', null)
//                       // setStats((prev) => [...prev, {title : 'Seleksi', value : exam_participants?.length, icon : <BiTask className='w-8 h-8'/>, description: "Selesai", dataSource:'seleksi'}])

//                       if(exam_participants){
//                         return exam_participants.length
//                       }
//                       return 0
//             }

//             if(data_source == 'pengukuran_seragan'){

//               let { data: uniform_sizing, error_uniform_sizing } = await supabase
//                       .from('participants')
//                       .select('*, applicants!inner(*, applicant_schools(*), applicant_orders(*))')
//                       // .eq('applicants.applicant_schools.admission_ays_id', id)
//                       .eq('EXTRACT(DAY FROM applicants.created_at)', val)
//                       .eq('is_draft', false)
//                       .eq('is_complete', true)
//                       .eq('is_uniform_sizing', true)
//                       .is('deleted_at', null)
//                       // setStats((prev) => [...prev, {title : 'Pengukuran Seragam', value : uniform_sizing?.length, icon : <RiTShirt2Line className='w-8 h-8'/>, description: "Selesai", dataSource:'pengukuran_seragam'}])

//                       if(uniform_sizing){
//                         return uniform_sizing.length
//                       }else{
//                         return 0
//                       }
//             }
//         }

//     // return 
//   // }

//   const data = {
//     labels,
//     datasets: [
//       {
//         fill: true,
//         label: 'Siswa',
//         data: labels.map((value, key) => { return getDailyData(key+1, data_source)}),
//         // data: labels.map(() => { return Math.random() * 100 + 500 }),
//         borderColor: 'rgb(53, 162, 235)',
//         backgroundColor: 'rgba(53, 162, 235, 0.5)',
//       },
//     ],
//   };
    

//     return (
//       <TitleCard title={`Data ${toUpperCase(data_source)} (per Hari)`}>
//           <Line data={data} options={options}/>
//       </TitleCard>
//     )
// }


// export default LineChart