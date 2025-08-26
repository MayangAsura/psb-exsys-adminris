
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../common/headerSlice'
import TitleCard from '../../../../components/Cards/TitleCard'
import supabase from "../../../../services/database-server"
import { tabHeaderHandlerActiveTab } from '../../../../utils/tabHeaderHandlerActiveTab'

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderSP from '../../../../components/TabHeader/TabHeaderSP'
import { useParams } from 'react-router-dom'

function InternalPage(){

    const dispatch = useDispatch()
    const [test, setTest] = useState({})
    const id = useParams().admission_ays_id
    const sch_id = useParams().school_id
    const pid = useParams().pid
    const options = [
        {tab: 'Detail', selected: true },
        {tab: 'Pendaftar', selected: false },
        {tab: 'Peserta', selected: false },
        {tab: 'Report', selected: false }
    ]
    
    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
        getTestData(id, sch_id, pid)
      }, [id, sch_id, pid])
      
    const getTestData = async (id, sch_id, pid) => {
        let { data: admissions, error } = await supabase
            .from('applicants')
            .select('*, participants(*), applicant_schools(*)')
            .eq('applicant_schools.admission_ays_id', id)
            .eq('applicant_schools.school_id', sch_id)
            .eq('id', pid)
            .is('deleted_at', null)
// 'd17ff676-85d2-4f9e-88f1-0fdfb37517b9'
        if(!error){
        setTest(admissions[0])
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

  
//   function formatRupiah(subject) {
//       const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
//       return `Rp${rupiah}`;
//     }

    const formatRupiah = (angka, prefix=null) => {
      // function formatRupiah(angka, prefix){
        var number_string = angka.toString().replace(/[^,\d]/g, '').toString()
        let split   		= number_string.split(',')
        let sisa     		= split[0].length % 3
        let rupiah     		= split[0].substr(0, sisa)
        let ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
   
        // tambahkan titik jika yang di input sudah menjadi angka ribuan
        if(ribuan){
          const separator = sisa ? '.' : '';
          rupiah += separator + ribuan.join('.');
        }
   
        rupiah = split[1] != null ? rupiah + ',' + split[1] : rupiah;
        return prefix == null ? rupiah : (rupiah ? 'Rp.' + rupiah : '');
      // }
    }
    const convertToUpper = (string) => {
        return string
    }
    const getChildStatusText = (value) => {
        if(value=== 'anak_kandung'){
            return 'Anak Kandung'
        }
        if(value=== 'anak_angkat'){
            return 'Anak Kandung'
        }
        if(value=== 'anak_asuh'){
            return 'Anak Asuh'
        }
        if(value=== 'lainnya'){
            return 'Lainnya'
        }
    }
    const getDistanceText = (value) => {
        if(value=== 'less_than_1km'){
            return 'Kurang dari 1 KM '
        }
        if(value=== '1_-_5km'){
            return '1 - 5 KM'
        }
        if(value=== 'more_than_5km'){
            return 'Lebih dari 5 KM'
        }
        if(value=== 'other'){
            return 'Lainnya'
        }
    }
    return(
        <div className="bg-base-200">
            <TabHeaderSP id={id} sch_id={sch_id} options={options} activeKey='Detail' />
            <TitleCard title="Informasi Detail" topMargin="mt-2">
                <div className="overflow-x-auto w-full ">
                    <div className='flex flex-col justify-between items-start'>
                         {/* <p className='flex '>Informasi Detail</p> */}
                        <div className="flex flex-col gap-y-4">
                            {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
                            {test.full_name}</h5> */}
                            {/* <div>
                                <div className="h-auto overflow-hidden relative"><div style="max-height: 400px;" className="overflow-hidden text-ellipsis leading-[22px] font-normal text-[14px]"><p className="tiptap-paragraph">..</p></div></div>
                            </div> */}
                                {/* <div className="css-4o3x93">
                                    <p className=" css-zuhd6s">Nama</p>
                                </div>
                                <div className="flex flex-wrap gap-1 -mt-2">{test.title} </div>  */}
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Nama Lengkap</p>
                                        </div>
                                    <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.full_name} </p></div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Jenis Kelamin</p>
                                        </div><div className="css-4o3x93">
                                        <p className="w-fit h-fit font-semibold">{test.gender==='male'?'Laki-Laki':'Perempuan'} </p></div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Email</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.email} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">No. WhatsAppp</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.phone_number} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Terakhir Aktif</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.updated_at} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Status</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{convertToUpper(test.status)} </p></div></div></div>
                                </div>
                                <hr />
                                <p>Status</p>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    {/* <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{l.submission_status==='accepted'?'Lulus':l.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td> */}
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Status Seleksi</p>
                                        </div>
                                    <div className="css-4o3x93"><p className={`font-semibold css-1bq9ewv rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{test.submission_status==='accepted'?'Lulus':test.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</p></div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Status Pembayaran</p>
                                        </div><div className="css-4o3x93">
                                        <p className={` font-semibold rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{test.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</p></div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    {/* <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{l.submission_status==='accepted'?'Lulus':l.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td> */}
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Status Pengisian Formulir</p>
                                        </div>
                                    <div className="css-4o3x93"><p className={`font-semibold css-1bq9ewv rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{test.is_draft==='accepted'?'Lulus':test.is_draft==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</p></div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Status Pengukuran Seragam</p>
                                        </div><div className="css-4o3x93">
                                        <p className={` font-semibold rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{test.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</p></div>
                                    </div>
                                </div>
                                <p>Data Peserta</p>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Tempat Lahir, Tanggal Lahir</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{`${test.participants[0].pob}, ${formatDateNew(test.participants[0].dob)}`} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">NISN</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].nisn} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">No. KK</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].kk_number} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">NIK</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].nik} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Alamat Sekolah Sebelumnya</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].prev_school_address} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">NIK</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].nik} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Riwayat Penyakit</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].medical_history==='none'?'Tidak Ada':'Ada'} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Alamat</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].home_address} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Status Anak</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{getChildStatusText(test.participants[0].child_status)} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Tinggal Bersama</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].live_with=='parent'?'Orangtua':test.participants[0].live_with=='guardian'?'Wali':test.participants[0].live_with=='kos'?'Kos':'Asrama'} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Nomor WhatsApp Orangtua</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].parent_phone_number} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Jarak Tempat Tinggal</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{getDistanceText(test.participants[0].distance)} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kategori Siswa</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].student_category} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Metode Uang Pangkal</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].metode_uang_pangkal} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kabupaten</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].region} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].postal_code} </p></div></div></div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Cita-Cita</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{test.participants[0].aspiration} </p></div></div>
                                
                                <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
                                    <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
                                        <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participants[0].postal_code} </p></div></div></div>
                                </div>
                                    {/* <div className="flex flex-col gap-y-2 w-full">
                                        <div className="css-4o3x93"><p className="w-full css-zuhd6s">Biaya Masuk</p></div>
                                <div className="css-4o3x93"><p className="font-semibold">{formatRupiah(test.admission_fee??"")} </p></div></div> */}
                                 
                                {/* <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 "><div className="css-4o3x93"><p className=" css-zuhd6s">Status</p></div><div className="css-4o3x93"><p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{convertToUpper(test.admission_status)} </p></div></div></div> */}
                                </div>
                                {/* <div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0">
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Tipe</p>
                                        </div>
                                    <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.test_type} </p></div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
                                        <p className=" css-zuhd6s">Lokasi</p>
                                        </div><div className="css-4o3x93">
                                        <p className="px-3 py-2 w-fit h-fit text-white !text-[12px] rounded-[4px] font-semibold leading-none bg-successed-500 css-zuhd6s">{test_room} </p></div>
                                    </div>
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
                                        <p className="w-fit h-fit font-semibold">{test.room} </p></div>
                                    </div>
                                </div> */}
                                    
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