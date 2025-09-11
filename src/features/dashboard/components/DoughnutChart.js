import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import Subtitle from '../../../components/Typography/Subtitle';
import supabase from '../../../services/database-server';

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

function DoughnutChart({ id }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch participant count
        let { data: participants, error: participantError } = await supabase
          .from('participants')
          .select('*, applicants!inner(*, applicant_schools!inner(*))')
          .eq('applicants.applicant_schools.admission_ays_id', id)
          .is('deleted_at', null);

        if (participantError) {
          throw participantError;
        }

        const participantCount = participants?.length || 0;
        const target = 568;
        const percentageAchieved = Math.min(100, Math.round((participantCount / target) * 100));
        const percentageRemaining = 100 - percentageAchieved;

        // Prepare chart data
        const data = {
          labels: ['Capaian', 'Target Tersisa'],
          datasets: [
            {
              label: 'Pencapaian PMB',
              data: [percentageAchieved, percentageRemaining],
              backgroundColor: [
                participantCount >= target 
                  ? 'rgba(75, 192, 192, 0.8)'  // Green when target achieved
                  : 'rgba(255, 99, 132, 0.8)', // Red when not achieved
                'rgba(54, 162, 235, 0.3)',
              ],
              borderColor: [
                participantCount >= target 
                  ? 'rgba(75, 192, 192, 1)'
                  : 'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 2,
              hoverOffset: 10,
            },
          ],
        };

        setChartData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <TitleCard title={"Persentase PMB TA. 26/27"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </TitleCard>
    );
  }

  if (error) {
    return (
      <TitleCard title={"Persentase PMB TA. 26/27"}>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard title={"Persentase PMB TA. 26/27"}>
      <div className="relative">
        <Doughnut options={options} data={chartData} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">
            {chartData.datasets[0].data[0]}%
          </div>
          <div className="text-sm text-gray-500">
            Capaian
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
          <span className="text-sm">Capaian: {chartData.datasets[0].data[0]}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
          <span className="text-sm">Target Tersisa: {chartData.datasets[0].data[1]}%</span>
        </div>
      </div>
    </TitleCard>
  );
}

export default DoughnutChart;
// import {
//   Chart as ChartJS,
//   Filler,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// import TitleCard from '../../../components/Cards/TitleCard';
// import Subtitle from '../../../components/Typography/Subtitle';
// import supabase from '../../../services/database-server';

// ChartJS.register(ArcElement, Tooltip, Legend,
//     Tooltip,
//     Filler,
//     Legend);

// function DoughnutChart({id}){

//     const options = {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//         },
//       };
      
//       const labels = ['Electronics', 'Home Applicances', 'Beauty', 'Furniture', 'Watches', 'Apparel'];
//       // const labels = ['Target', 'Capaian'];
      
//       const getCapaian = async () => {
//         let { data: exam_test_contents, error2 } = await supabase
//                 .from('participants')
//                         .select('*, applicants!(*, applicants_schools!inner(*))')
//                         .eq('applicants.applicant_schools.admission_ays_id', id)
//                         // .eq('applicants.applicant_schools.school_id', 1)
//                         .is('deleted_at', null)
//                 if(exam_test_contents){
//                   return exam_test_contents.length `(${exam_test_contents.length / 568 * 0.01}) %`
//                 }
//                 return 0
//       }
//       const getCapaianPersentage = () => {
//         if(getCapaian()!==0){
//           return getCapaian() `(${getCapaian()/568 * 0.01}) %`
//         }
//         return 0 + '%'
//       }
//       const getTargetSisa = () => {
//         if(getCapaian() !== 0){
//           return getCapaian() - 568
//         }
//         return 568
//       }
//       const getTargetSisaPersentage = () => {
//         if(getTargetSisa() !== 0){
//           return getTargetSisa() `(${getTargetSisa()/568 * 0.01}) %`
//         }
//         return 100 + '%'
//       }
//       // const getPersentageSDIT = () => {

//       // }
//       // const getPersentageTKIT = () => {

//       // }
//       // const getPersentageTKIT = () => {

//       // }
//       // const getPersentageTKIT = () => {

//       // }
//       // const getPersentageTKIT = () => {

//       // }
//       let data

//       if(getCapaian() >= 568){
//         data = {
//           labels,
//           datasets: [
//               {
//                   labels: '# Peserta',
//                   data: [getCapaianPersentage(), getTargetSisaPersentage() ],
//                   backgroundColor: [
//                     'rgba(255, 99, 132, 0.8)',
//                     'rgba(54, 162, 235, 0.8)',
//                     // 'rgba(255, 206, 86, 0.8)',
//                     // 'rgba(75, 192, 192, 0.8)',
//                     // 'rgba(153, 102, 255, 0.8)',
//                     // 'rgba(255, 159, 64, 0.8)',
//                   ],
//                   borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     // 'rgba(255, 206, 86, 1)',
//                     // 'rgba(75, 192, 192, 1)',
//                     // 'rgba(153, 102, 255, 1)',
//                     // 'rgba(255, 159, 64, 1)',
//                   ],
//                   borderWidth: 1,
//                 }
//           ],
//         };

//       }
//       if(getCapaian() >= 568){

//         data = {
//           labels,
//           datasets: [
//               {
//                   labels: '# Peserta',
//                   data: [getCapaianPersentage()],
//                   backgroundColor: [
//                     'rgba(255, 99, 132, 0.8)',
//                     // 'rgba(54, 162, 235, 0.8)',
//                     // 'rgba(255, 206, 86, 0.8)',
//                     // 'rgba(75, 192, 192, 0.8)',
//                     // 'rgba(153, 102, 255, 0.8)',
//                     // 'rgba(255, 159, 64, 0.8)',
//                   ],
//                   borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     // 'rgba(54, 162, 235, 1)',
//                     // 'rgba(255, 206, 86, 1)',
//                     // 'rgba(75, 192, 192, 1)',
//                     // 'rgba(153, 102, 255, 1)',
//                     // 'rgba(255, 159, 64, 1)',
//                   ],
//                   borderWidth: 1,
//                 }
//           ],
//         };
//       }

//     return(
//         <TitleCard title={"Persentase PMB TA. 26/27"}>
//                 <Doughnut options={options} data={data} />
//         </TitleCard>
//     )
// }


// export default DoughnutChart