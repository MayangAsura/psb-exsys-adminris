import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import supabase from "../../services/database-server"

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeader from '../../components/TabHeader/TabHeader'

function InternalPage(){

    const dispatch = useDispatch()
    const [test, setTest] = useState({})
    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
        getTestData()
      }, [])
      
    const getTestData = async () => {
        let { data: exam_tests, error } = await supabase
            .from('exam_tests')
            .select('*')
            .eq('id', 'ad5ce0c7-ddd9-4e36-8ef4-ff1d09fce06b')

        if(!error){
        setTest(exam_tests[0])
        }
    }

    const formatDateNew = (date) => {
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    date = new Date(date);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const dateFormat = `${day}-${month}-${year} ${hour}:${minute} WIB`;
    // const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
    return dateFormat
  }

    
    return(
        <div className="bg-base-200">
            <TabHeader />
            <TitleCard title="Informasi Detail" topMargin="mt-2">
                <div className="overflow-x-auto w-full ">
                    <div className='flex flex-col justify-between items-start'>
                        {/* <p className='flex '>Informasi Detail</p> */}
                        <div className="flex flex-col gap-y-6">
                            <h1 className="h1 text-3xl font-semibold  css-3rz2wn">
                                {test.name}
                            </h1>
                            {/* <div>
                                <div className="h-auto overflow-hidden relative"><div style="max-height: 400px;" className="overflow-hidden text-ellipsis leading-[22px] font-normal text-[14px]"><p className="tiptap-paragraph">..</p></div></div>
                            </div> */}
                                {/* <div className="css-4o3x93">
                                    <p className=" css-zuhd6s">Nama</p>
                                </div>
                                <div className="flex flex-wrap gap-1 -mt-2">{test.name} </div> */}
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 "><div className="css-4o3x93"><p className=" css-zuhd6s">Skema</p></div><div className="css-4o3x93"><p className="font-semibold badge-primary rounded-2xl py-1 px-2 css-1pj8jfk">{test.test_scheme} </p></div></div></div>
                                <div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0">
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Waktu Mulai</p>
                                        </div>
                                    <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{formatDateNew(test.started_at) } </p></div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Waktu Selesai</p>
                                        </div><div className="css-4o3x93">
                                        <p className="w-fit h-fit font-semibold css-zuhd6s">{formatDateNew(test.ended_at)} </p></div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0">
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Tipe</p>
                                        </div>
                                    <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.test_type} </p></div>
                                    </div>
                                    {/* <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Lokasi</p>
                                        </div><div className="css-4o3x93">
                                        <p className="px-3 py-2 w-fit h-fit text-white !text-[12px] rounded-[4px] font-semibold leading-none bg-successed-500 css-zuhd6s">{test_room} </p></div>
                                    </div> */}
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0">
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Lokasi</p>
                                        </div>
                                    <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.location} </p></div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Ruangan</p>
                                        </div><div className="css-4o3x93">
                                        <p className="w-fit h-fit font-semibold css-zuhd6s">{test.room} </p></div>
                                    </div>
                                </div>
                                    
                            </div>
                    </div>
                    
                </div>

            </TitleCard>
            {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex gap-x-4 items-center mb-4 md:mb-0"><div className="css-4o3x93"><p className="text-[#262626] font-semibold css-1e1ey9f">Informasi Umum</p></div></div><div className="relative bg-neutral-50 cursor-pointer p-[5px] rounded-md"><div><button type="button" className="flex h-11 w-11 bg-[#EFEFEF] hover:bg-gray-200 justify-center items-center rounded-lg"><img src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.16667%2011.6667C5.08714%2011.6667%205.83333%2010.9205%205.83333%2010C5.83333%209.07954%205.08714%208.33334%204.16667%208.33334C3.24619%208.33334%202.5%209.07954%202.5%2010'%20stroke='%23515151'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3ccircle%20cx='10'%20cy='10'%20r='1.66667'%20stroke='%231C274C'%20stroke-width='1.25'/%3e%3cpath%20d='M17.5%2010C17.5%2010.9205%2016.7538%2011.6667%2015.8333%2011.6667C14.9128%2011.6667%2014.1666%2010.9205%2014.1666%2010C14.1666%209.07954%2014.9128%208.33334%2015.8333%208.33334'%20stroke='%231C274C'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3c/svg%3e" alt="menu" style="width: 20px; height: 20px;"></button><div className="absolute w-[100px] z-[999] transition-transform duration-300 ease-out scale-0 opacity-0 origin-top" style="top: 60px; right: 0px;" data-cy="action"><div className="bg-white flex flex-col justify-center cursor-pointer shadow-md rounded-md"><div><div className="p-[10px] cursor-pointer transition-colors duration-300 hover:bg-[#9957EC] hover:text-white rounded-t-md" role="button" data-cy="ecourse-button-edit">Edit</div><hr className="mx-1"></div><div><div className="p-[10px] cursor-pointer transition-colors duration-300 hover:bg-[#9957EC] hover:text-white rounded-b-md" role="button" data-cy="ecourse-button-hapus">Hapus</div><hr className="mx-1"></div></div></div></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4"><div><img className="w-full aspect-video object-cover !rounded-[15px] !h-auto" style="border-radius: 4px; height: 100%; width: 100%;" src="https://sgp1.digitaloceanspaces.com/learnhub-storage/component/thumbnail/thumbnail2.jpg" alt="Error"></div>
                <div className="flex flex-col gap-y-4"><h5 className="font-semibold text-[#262626] css-3rz2wn">Gets start with Javascript: Learn Javascript Programming from Scratch, Master Fundamental of Javascript with Practices</h5><div><div className="h-auto overflow-hidden relative"><div style="max-height: 400px;" className="overflow-hidden text-ellipsis leading-[22px] font-normal text-[14px]"><p className="tiptap-paragraph">..</p></div></div></div><div className="css-4o3x93"><p className=" css-zuhd6s">Kompetensi</p></div><div className="flex flex-wrap gap-1 -mt-2">-</div><div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93"><p className=" css-zuhd6s">Harga Minimum</p></div><div className="css-4o3x93"><p className="font-semibold text-[#0F0F0F] css-1pj8jfk">Rp&nbsp;10.000</p></div></div></div><div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0"><div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93"><p className=" css-zuhd6s">Kategori</p></div><div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">Tahsin</p></div></div><div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93"><p className=" css-zuhd6s">Status</p></div><div className="css-4o3x93"><p className="px-3 py-2 w-fit h-fit text-white !text-[12px] rounded-[4px] font-semibold leading-none bg-successed-500 css-zuhd6s">Diterbitkan</p></div></div></div></div></div> */}
            {/* <div className="hero-content text-accent text-center">
                <dpiv className="max-w-md">
                <DocumentIcon className="h-48 w-48 inline-block"/>
                <h1 className="text-5xl mt-2 font-bold">Blank Page</h1>
                </dpiv>
            </div> */}
        </div>
    )
}

export default InternalPage