import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../common/headerSlice'
import TitleCard from '../../../components/Cards/TitleCard'
import * as XLSX from 'xlsx';
import SearchBar from "../../../components/Input/SearchBar"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon"
import { saveAs } from 'file-saver';

import supabase from "../../../services/database-server"

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderSP from '../../../components/TabHeader/TabHeaderSP'
import { useParams } from 'react-router-dom'

const TopSideButtons = ({participants, removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const participantFilters = ["Laki-Laki", "Perempuan"]
    

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
    }

    useEffect(() => {
        
        console.log('search', searchText)
        if(searchText == ""){
            removeAppliedFilter()
        }else{
            applySearch(searchText)
        }
    }, [participants, searchText])
    

    const addNewParticipant = () => {
        
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    const getParticipantCategory = (category) => {
        return (category)=='alumni'?"Alumni":((category)=='hasfamily'?"Memiliki saudara kandung sekolah di Rabbaanii":"Bukan Alumni/Keluarga Rabbaanii") 
    }
    const getPilihanMetodeUangPangkalText = (value) => {

    if(value === 'gel_1') {
      return 'Gelombang 1 (Dibayarkan 2 Pekan Setelah Dinyatakan diterima)'
    }
  }
    const exportParticipants = () => {
        // const exportToExcel = () => {
    const clean_data = participants.map(value => ({
        NAMA : value.applicants.full_name,
        NO_REGISTRASI : value.applicants.regist_number,
        NO_WHATSAPP : value.applicants.phone_number,
        JENIS_KELAMIN : value.applicants.gender==='male'? 'Laki-Laki':'Perempuan',
        STATUS_PENDAFTARAN: value.submission_status=='accepted'?'Lulus':value.submission_status=='initial_submission'?'Pengisian Formulir':value.submission_status=='awaiting_processing'?'Formulir Diproses':'Tidak Lulus',
        // STATUS_SELEKSI:	value.exam_profiles.completion_status==true?'Tuntas':'Belum Tuntas',
        STATUS_PENGISIAN_FORMULIR:	value.is_draft==true?'Lengkap':'Belum Lengkap',
        STATUS_PENGISIAN_UKURAN_SERAGAM: value.is_uniform_sizing==true?'Lengkap':'Belum Lengkap',
        ALAMAT: value.home_address,
        TEMPAT_LAHIR: value.pob,
        TANGGAL_LAHIR: value.dob,
        KATEGORI_SISWA: getParticipantCategory(value.student_category),
        METODE_PEMBAYARAN_UANGPANGKAL: getPilihanMetodeUangPangkalText(value.metode_uang_pangkal),
        CITA_CITA: value.aspiration,
        // ALAMAT_SEKOLAH_SEBELUMNYA : value.prev_school_address,
        // prev_school_address	kk_number	pob	dob	medical_history	sickness_history	home_address	child_status	child_number	live_with	parent_phone_number	distance	created_at	deleted_at	updated_at	student_category	metode_uang_pangkal	prev_school	nationality	province	region	postal_code	aspiration	id	nik	parent_email	is_complete	submission_status	is_draft	is_uniform_sizing
    }))
    // setParticipants
            const fileName = 'Peserta'
    const worksheet = XLSX.utils.json_to_sheet(clean_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(blob, `${fileName}.xlsx`);
//   };

        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
        
    }

    return(
        <div className="inline-block float-right z-200" z-index='200'>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-800 dark:text-gray-600" onClick={() => addNewParticipant()}>Tambah Peserta</button>
            </div>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-orange-700 text-gray-100 hover:bg-orange-800 dark:text-gray-600" onClick={() => exportParticipants()}>Export Peserta</button>
            </div>

            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 z-50">
                    {
                        participantFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Hapus Filter</a></li>
                </ul>
            </div>
        </div>
    )

    // return(
    //     <div className="inline-block float-right">
    //         <div className="inline-block float-right">
    //             <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewParticipant()}>Tambah Peserta</button>
    //         {/* <div className="inline-block float-right"> */}
    //             {/* <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Peserta</button> */}
    //         </div>

    //         <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
    //         {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
    //         <div className="dropdown dropdown-bottom dropdown-end">
    //             <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
    //             <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
    //                 {
    //                     participantFilters.map((l, k) => {
    //                         return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
    //                     })
    //                 }
    //                 <div className="divider mt-0 mb-0"></div>
    //                 <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
    //             </ul>
    //         </div>
    //     {/* </div> */}
    //     </div>
    // )
}

function AdmissionParticipants(){

    const [trans, setTrans] = useState("")
    const [ExamParticipants, setExamParticipants] = useState([])

    const id = useParams().admission_id
    const sch_id = useParams().school_id
    const options = [
        {tab: 'Detail', selected: false },
        // {tab: 'Jenjang', selected: false },
        {tab: 'Peserta', selected: true },
        {tab: 'Report', selected: false }
    ]
    useEffect(() => {
        getExamParticipants(id)
        console.log(ExamParticipants)
    },[id])

    const getExamParticipants = async(id, keyword=null) => {
    
        console.log('keyword', keyword)
        if(keyword){
            const {data: participants, error} = await supabase.from('participants')
                                                .select('*, applicants(*, applicant_schools(school_id, admission_id)) ')
                                                // .or('applicants.phone_number.ilike.male')
                                                .eq('applicants.applicant_schools.school_id', sch_id)
                                                .eq('applicants.applicant_schools.admission_id', id)
                                                .ilike('applicants.phone_number.ilike', `${keyword}`)
                                                // .or(`applicants.phone_number.ilike.%${keyword}%,applicants.phone_number.ilike.%${keyword}%`)
                                                // .or(`applicants.phone_number.eq.${keyword}, applicants.full_name.eq.${keyword}, applicants.regist_number.eq.${keyword}`)
                                                // .select('id,created_at, exam_profiles(full_name,regist_number, completion_status), exam_tests(exam_schedule_tests(exam_schedules(admission_id, exam_schedule_schools(school_id))))')
                                                // .eq('exam_tests.exam_schedule_tests.exam_schedules.exam_schedule_schools.school_id', sch_id)
                                                // .eq('exam_tests.exam_schedule_tests.exam_schedules.admission_id', id)
                                                .is('deleted_at', null)
                                                // if(keyword){
        // participants
            //   .ilike('applicants.phone_number', `%${searchTerm}%`)
            //   .ilike('applicants.regis', `%${searchTerm}%`)
              
        // }
            if(!error){
                setExamParticipants(participants)
            }
            console.log(participants)
        }
        if(!keyword || keyword==null){
            const {data: participants, error} = await supabase.from('participants')
                                                .select('*, applicants(*, applicant_schools(school_id, admission_id)) ')
                                                .eq('applicants.applicant_schools.school_id', sch_id)
                                                .eq('applicants.applicant_schools.admission_id', id)
                                                // .select('id,created_at, exam_profiles(full_name,regist_number, completion_status), exam_tests(exam_schedule_tests(exam_schedules(admission_id, exam_schedule_schools(school_id))))')
                                                // .eq('exam_tests.exam_schedule_tests.exam_schedules.exam_schedule_schools.school_id', sch_id)
                                                // .eq('exam_tests.exam_schedule_tests.exam_schedules.admission_id', id)
                                                .is('deleted_at', null)

            if(!error){
                setExamParticipants(participants)
            }
        }

        
            
    }
    const removeFilter = () => {
        setExamParticipants(ExamParticipants)
    }

    const applyFilter = (params) => {
        const cparams = params==='Laki-Laki'? 'male' : 'female'
        const c2params = params==='Lulus'? true : false
        console.log('params', cparams, c2params)
        getExamParticipants(id, cparams || c2params)
        // let filteredParticipants = ExamParticipants.filter((t) => {return  t.applicants.gender == cparams || c2params})
        console.log('filteredParticipants',ExamParticipants)
        setExamParticipants(ExamParticipants)
        console.log(ExamParticipants)
    }

    // Search according to name
    const applySearch = (value) => {
        getExamParticipants(id, value)
        // let filteredParticipants = ExamParticipants.filter((t) => {return t.applicants.full_name.toLowerCase().includes(value.toLowerCase()) ||  t.applicants.regist_number.toLowerCase().includes(value.toLowerCase())})
        setExamParticipants(ExamParticipants)

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

  const getStatus = (status) => {
    if(status=='initial_submission'){
        return 'Pengisian Formulir'
    }
    if(status=='ongoing'){
        return 'Belum Tuntas'
    }
    if(status=='accepted'){
        return 'Diterima'
    }
  }

    return(
        <>
            
                <TabHeaderSP id = {id} options={options} activeKey='Peserta' ></TabHeaderSP>
            <TitleCard title="Peserta" topMargin="mt-2" TopSideButtons={<TopSideButtons participants={ExamParticipants} applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
                {/* <TabHeaderE></TabHeaderSP> */}
            <div className="overflow-x-auto w-full" z-index="-10">
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>No. Registrasi</th>
                        <th>Nama</th>
                        <th>No. WhatsApp</th>
                        <th>Jenis Kelamin</th>
                        <th>Tempat Lahir</th>
                        <th>Bergabung</th>
                        <th>Status Seleksi</th>
                        <th>Pembayaran</th>
                        <th>Kelengkapan Formulir</th>
                        <th>Kelengkapan Pengukuran Seragam</th>
                        <th>Update Terakhir</th>
                        {/* <th>Status Seleksi</th> */}
                        {/* <th>Tanggal Submit</th> */}
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            ExamParticipants.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.applicants.regist_number }</div></td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            {/* <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    <img src={l.icon} alt="Avatar" />
                                                </div>
                                            </div> */}
                                            <div>
                                                <div className="font-bold">{l.applicants.full_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td><div className="font-bold">{l.exam_schedule_tests[0].exam_schedule_schools[0].schools.school_name}</div></td> */}
                                    <td><div className="">{l.applicants.phone_number}</div></td>
                                    <td><div className="">{l.applicants.gender==='male'? 'Laki-Laki': 'Perempuan'}</div></td>
                                    <td><div className="">{l.pob}</div></td>
                                    <td><div className="">{formatDateNew(l.created_at) }</div></td>
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{l.submission_status==='accepted'?'Lulus':l.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
                                    {/* className={`rounded-2xl w-32 py-1 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-orange-400': 'bg-green-400'}`} */}
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
                                    {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-blue-400': 'bg-gray-400'}`} */}
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td>
                                    {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-yellow-400': 'bg-cyan-400'}`} */}
                                    {/* <td>{getEducationUnit(l.Participant_name)}</td>
                                    <td>{l.address}</td> */}
                                    <td>{formatDateNew(l.updated_at) }</td>
                                    {/* <td className={`${l.exam_profiles?.completion_status=='ongoing'? 'badge bg-red-400':' badge bg-blue-400'} font-bold`} >{getStatus(l.exam_profiles?.completion_status)}</td> */}
                                    {/* <td>Ujian Seleksi Jenjang SDIT</td> */}
                                    {/* <td>{l.exam_schedules_test[0].exam_schedules.name}</td> */}
                                    {/* <td>{l.score}</td> */}
                                    {/* <td>{l.updated_at}</td> */}
                                    {/* <td>{moment(l.date).format("D MMM")}</td> */}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            </TitleCard>
        </>
    )
}


export default AdmissionParticipants