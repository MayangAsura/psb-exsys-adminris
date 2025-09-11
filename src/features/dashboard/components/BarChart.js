import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import supabase from "../../../services/database-server";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jumlah Pendaftar'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Bulan'
        }
      }
    }
  };

  // Get month names for current year only
  const getCurrentYearMonthNames = () => {
    const currentMonth = new Date().getMonth();
    return [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ].slice(0, currentMonth + 1); // Only months up to current month
  };

  // Function to get data for a specific month and week
  const getSumData = async (month, week) => {
    try {
      const year = new Date().getFullYear();
      
      // Calculate start and end dates for the week
      const firstDayOfWeek = new Date(year, month, 1 + (week - 1) * 7);
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);

      // Fetch data for the specific week range
      const { data: participants, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('status', 'active')
        .is('deleted_at', null)
        .gte('created_at', firstDayOfWeek.toISOString())
        .lte('created_at', lastDayOfWeek.toISOString());

      if (error) throw error;
      return participants?.length || 0;
    } catch (err) {
      console.error(`Error fetching data for month ${month}, week ${week}:`, err);
      return 0;
    }
  };

  // Fetch data for current year
  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentMonth = new Date().getMonth();
      const months = Array.from({ length: currentMonth + 1 }, (_, i) => i);
      const weeks = [1, 2, 3, 4];
      const monthNames = getCurrentYearMonthNames();

      // Create promises for all data points
      const dataPromises = weeks.map(week => 
        Promise.all(months.map(month => getSumData(month, week)))
      );

      // Wait for all data to be fetched
      const weeklyData = await Promise.all(dataPromises);

      const datasets = weeks.map((week, index) => ({
        label: `Pekan ${week}`,
        data: weeklyData[index],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(53, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ][index],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(53, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ][index],
        borderWidth: 1,
      }));

      setChartData({
        labels: monthNames,
        datasets: datasets,
      });
    } catch (err) {
      setError('Gagal memuat data diagram');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <TitleCard title={"Diagram Pekanan Pendaftar 2024/2025"}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </TitleCard>
    );
  }

  if (error) {
    return (
      <TitleCard title={"Diagram Pekanan Pendaftar 2024/2025"}>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
          <button 
            onClick={fetchChartData}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Coba Lagi
          </button>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard title={"Diagram Pekanan Pendaftar 2024/2025"}>
      <Bar options={options} data={chartData} />
      <div className="mt-2 text-xs text-gray-500 text-center">
        Data pendaftar per pekan dalam setiap bulan (Tahun {new Date().getFullYear()})
      </div>
    </TitleCard>
  );
}

export default BarChart;
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import TitleCard from '../../../components/Cards/TitleCard';
// import supabase from "../../../services/database-server"

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function BarChart(){

//     const options = {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           }
//         },
//       };

//       const getSumData = async (month, week) => {
//         // Read all rows
//           let { data: participants, error } = await supabase
//             .from('applicants')
//             .select('*, applicant_orders(*) ')
//             // .eq('applicant_orders.status', 'finished')
//             .eq('status', 'active')
//             .is('deleted_at', null)
//             .eq('EXTRACT(WEEK FROM applicant_orders.updated_at)', week)
//             .eq('EXTRACT(MONTH FROM applicant_orders.updated_at)', month)

//             if(participants){
//               console.log('participants', participants)
//               return participants.length
//             }
//       }
      
//       const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
      
//       const data = {
//         labels,
//         datasets: [
//           {
//             label: 'Pekan 1',
//             data: labels.map((value, key) => { return getSumData(key, 1) }),
//             // data: labels.map(() => { return Math.random() * 1000 + 500 }),
//             backgroundColor: 'rgba(255, 99, 132, 1)',
//           },
//           {
//             label: 'Pekan 2',
//             data: labels.map((value, key) => { return getSumData(key, 2) }),
//             backgroundColor: 'rgba(53, 162, 235, 1)',
//           },
//           {
//             label: 'Pekan 3',
//             data: labels.map((value, key) => { return getSumData(key, 3) }),
//             backgroundColor: 'rgba(255, 99, 132, 1)',
//           },
//           {
//             label: 'Pekan 4',
//             data: labels.map((value, key) => { return getSumData(key, 4) }),
//             backgroundColor: 'rgba(53, 162, 235, 1)',
//           },
//         ],
//       };

//     return(
//       <TitleCard title={"Diagram Pekanan Pendaftar 26/27"}>
//             <Bar options={options} data={data} />
//       </TitleCard>

//     )
// }


// export default BarChart