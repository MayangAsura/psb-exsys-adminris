import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPageTitle } from '../../../common/headerSlice'
import TitleCard from '../../../../components/Cards/TitleCard'
import * as XLSX from 'xlsx';
import SearchBar from "../../../../components/Input/SearchBar"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon"
import { saveAs } from 'file-saver';

import { createColumn } from "../components/Columns";
import { DataTable } from "../components/Table";
import { ColumnDef } from "@tanstack/react-table";

import supabase from "../../../../services/database-server"
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import CustomDynamicTable from '../components/CustomDynamicTable'
import { openModal } from "../../../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../../utils/globalConstantUtil'

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'
import { cn } from '../../../../lib/utils';

import TabHeaderSP from '../../../../components/TabHeader/TabHeaderSP'
import { useNavigate, useParams } from 'react-router-dom'
import { email } from 'zod';

const TopSideButtons = ({applicants, removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const applicantFilters = ["Laki-Laki", "Perempuan"]
    

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
    }, [applicants, searchText])
    

    const addNewApplicant = () => {
        
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    const getApplicantCategory = (category) => {
        return (category)=='alumni'?"Alumni":((category)=='hasfamily'?"Memiliki saudara kandung sekolah di Rabbaanii":"Bukan Alumni/Keluarga Rabbaanii") 
    }
    const getPilihanMetodeUangPangkalText = (value) => {

    if(value === 'gel_1') {
      return 'Gelombang 1 (Dibayarkan 2 Pekan Setelah Dinyatakan diterima)'
    }
  }
    const exportApplicants = () => {
        // const exportToExcel = () => {
    const clean_data = applicants.map(value => ({
        NAMA : value.full_name,
        NO_REGISTRASI : value.regist_number,
        NO_WHATSAPP : value.phone_number,
        JENIS_KELAMIN : value.gender==='male'? 'Laki-Laki':'Perempuan',
        STATUS_PENDAFTARAN: value.participants[0].submission_status=='accepted'?'Lulus':value.participants[0].submission_status=='initial_submission'?'Pengisian Formulir':value.participants[0].submission_status=='awaiting_processing'?'Formulir Diproses':'Tidak Lulus',
        // STATUS_SELEKSI:	value.exam_profiles.completion_status==true?'Tuntas':'Belum Tuntas',
        STATUS_PENGISIAN_FORMULIR:	value.participants[0].is_draft==true?'Lengkap':'Belum Lengkap',
        STATUS_PENGISIAN_UKURAN_SERAGAM: value.participants[0].is_uniform_sizing==true?'Lengkap':'Belum Lengkap',
        ALAMAT: value.participants[0].home_address,
        TEMPAT_LAHIR: value.participants[0].pob,
        TANGGAL_LAHIR: value.participants[0].dob,
        KATEGORI_SISWA: getApplicantCategory(value.participants[0].student_category),
        METODE_PEMBAYARAN_UANGPANGKAL: getPilihanMetodeUangPangkalText(value.participants[0].metode_uang_pangkal),
        CITA_CITA: value.participants[0].aspiration,
        // ALAMAT_SEKOLAH_SEBELUMNYA : value.prev_school_address,
        // prev_school_address	kk_number	pob	dob	medical_history	sickness_history	home_address	child_status	child_number	live_with	parent_phone_number	distance	created_at	deleted_at	updated_at	student_category	metode_uang_pangkal	prev_school	nationality	province	region	postal_code	aspiration	id	nik	parent_email	is_complete	submission_status	is_draft	is_uniform_sizing
    }))
    // setapplicants
            const fileName = 'Pendaftar'
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
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-800 dark:text-gray-600" onClick={() => addNewApplicant()}>Tambah Pendaftar</button>
            </div>
           
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-orange-700 text-gray-100 hover:bg-orange-800 dark:text-gray-600" onClick={() => exportApplicants()}>Export Pendaftar</button>
            </div>

            {/* <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/> */}
            {/* {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 z-50">
                    {
                        applicantFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Hapus Filter</a></li>
                </ul>
            </div> */}
        </div>
    )

    // return(
    //     <div className="inline-block float-right">
    //         <div className="inline-block float-right">
    //             <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewapplicant()}>Tambah Pendaftar</button>
    //         {/* <div className="inline-block float-right"> */}
    //             {/* <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Pendaftar</button> */}
    //         </div>

    //         <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
    //         {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
    //         <div className="dropdown dropdown-bottom dropdown-end">
    //             <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
    //             <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
    //                 {
    //                     applicantFilters.map((l, k) => {
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

function AdmissionApplicants(){

    const [trans, setTrans] = useState("")
    const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)
    const [ExamApplicants, setExamApplicants] = useState([])
    const [applicant, setApplicant] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const id = useParams().academic_year_id
    const sch_id = useParams().school_id
    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Pendaftar', selected: true },
        {tab: 'Peserta', selected: false },
        {tab: 'Report', selected: false }
    ]

const columns = [
//   createColumn("id", ""),
    createColumn("regist_number", "No. Registrasi"),
    createColumn("full_name", "Nama Lengkap"),
    createColumn("gender", "Jenis Kelamin"),
    createColumn("phone_number", "No. WhatsApp"),
    createColumn("action", "Aksi")
];

    async function detailPost(id) {
        // call your api to update
        console.log(id, "a");
    }
    async function updatePost(id) {
        // call your api to update
        console.log(id, "a");
    }
    async function deletePost(id) {
        // call your api to delete
        console.log(id, "");
    }

  const serelizeData = () => {
    if (ExamApplicants) {
      const newData = ExamApplicants?.map((item) => {
        return {
        //   id: item?.id,
          full_name: item?.full_name,
          gender: item?.gender=='male'?'Laki-Laki':'Perempuan',
          phone_number: item?.phone_number,
          regist_number: item?.regist_number,
          action: [
            {
              label: "Detail",
              callback: () => detailCurrentSchedule(item?.id),
            },
            {
              label: "Edit",
              callback: () => editCurrentSchedule(item?.id),
            },
            {
              label: "Hapus",
              callback: () => deleteCurrentSchedule(item?.id),
            },
          ],
        };
      });
      return newData;
    }
  };

  const serelizedData = serelizeData();


    useEffect(() => {
        getExamApplicants(id, sch_id)
        console.log(ExamApplicants)
        console.log('id-sch_id', id, sch_id)
    },[id, sch_id])

    const getApplicant = async (index, sch_id, appl_id) => {
        if (appl_id) {
            const {data: admission_schools, error } = await supabase.from('applicants')
                                                        .select("*, applicant_schools!inner(*)")
                                                        .eq('applicant_schools.school_id', sch_id)
                                                        .eq('applicant_schools.admission_ays_id', index.toString())
                                                        // .neq('applicant_schools.school_id', null)
                                                        // .neq('applicant_schools.admission_ays_id', null)
                                                        .eq('id', appl_id)
                                                        .is('deleted_at', null)
            if(admission_schools){
                console.log(admission_schools[0])
                setApplicant(admission_schools[0])
                console.log(applicant)
                // setApplicantSchool(admission_schools[0].applicant_schools[0])
            }else{
                console.log(error)
            }
        }else{
            
        }
    }

    const getExamApplicants = async(id, sch_id, keyword=null) => {
    
        console.log('keyword', keyword)
        if(keyword){
            const {data: applicants, error} = await supabase.from('applicants')
                                                .select('*, applicant_schools!inner(school_id, admission_ays_id), participants(*)')
                                                // .or('applicants.phone_number.ilike.male')
                                                .eq('applicant_schools.school_id', sch_id)
                                                .eq('applicant_schools.admission_ays_id', id)
                                                // .ilike('phone_number.ilike', `${keyword}`)
                                                // .or(`applicants.phone_number.ilike.%${keyword}%,applicants.phone_number.ilike.%${keyword}%`)
                                                // .or(`applicants.phone_number.eq.${keyword}, applicants.full_name.eq.${keyword}, applicants.regist_number.eq.${keyword}`)
                                                // .select('id,created_at, exam_profiles(full_name,regist_number, completion_status), exam_tests(exam_schedule_tests(exam_schedules(admission_id, exam_schedule_schools(school_id))))')
                                                // .eq('exam_tests.exam_schedule_tests.exam_schedules.exam_schedule_schools.school_id', sch_id)
                                                // .eq('exam_tests.exam_schedule_tests.exam_schedules.admission_id', id)
                                                .is('deleted_at', null)
                                                // .order('created_at', 'desc')
                                                // if(keyword){
        // applicants
            //   .ilike('applicants.phone_number', `%${searchTerm}%`)
            //   .ilike('applicants.regis', `%${searchTerm}%`)
              
        // }
            if(!error){
                setExamApplicants(applicants)
            }
            console.log(applicants)
        }
        if(!keyword || keyword==null){
            const {data: applicants, error} = await supabase.from('applicants')
                                                .select('*, applicant_schools!inner(school_id, admission_ays_id), participants(*)')
                                                .eq('applicant_schools.school_id', sch_id)
                                                .eq('applicant_schools.admission_ays_id', id)
                                                .is('deleted_at', null)
                                                // .order('created_at', 'desc')

            if(!error){
                setExamApplicants(applicants)
                console.log('ExamApplicants', ExamApplicants)
            }
        }

        
            
    }
    const removeFilter = () => {
        setExamApplicants(ExamApplicants)
    }

    const applyFilter = (params) => {
        const cparams = params==='Laki-Laki'? 'male' : 'female'
        const c2params = params==='Lulus'? true : false
        console.log('params', cparams, c2params)
        getExamApplicants(id, cparams || c2params)
        // let filteredapplicants = Examapplicants.filter((t) => {return  t.applicants.gender == cparams || c2params})
        console.log('filteredapplicants',ExamApplicants)
        setExamApplicants(ExamApplicants)
        console.log(ExamApplicants)
    }

    // Search according to name
    const applySearch = (value) => {
        getExamApplicants(id, value)
        // let filteredapplicants = Examapplicants.filter((t) => {return t.applicants.full_name.toLowerCase().includes(value.toLowerCase()) ||  t.applicants.regist_number.toLowerCase().includes(value.toLowerCase())})
        setExamApplicants(ExamApplicants)

    }

    const [selected, setSelected] = useState([]);

  const toggleSelection = (row) => {
    setSelected((prev) =>
      prev.includes(row) ? prev.filter((item) => item !== row) : [...prev, row]
    );
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

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

  const deleteCurrentSchedule = (index) => {
                dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Apakah Anda yakin menghapus pendaftar ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSION_SCHOOLS_DELETE, index}}))
                
        if(newNotificationStatus==1){
            getExamApplicants(id, sch_id)
        }
    }

    const editCurrentSchedule = (index) => {
        console.log(id, sch_id, index, applicant)
        setTimeout(() => {
            getApplicant(id, sch_id, index)
            
        }, 1000);
        // setTimeout(() => {
            
        // }, 1000);
        const applicantData = {
            full_name: applicant.full_name,
            gender: applicant.gender,
            phone_number: applicant.phone_number,
            regist_number: applicant.regist_number,
            email: applicant.email,
            media: applicant.media,
            // school_id: applicant.applicant_schools[0]?.school_id || 0
        }
        // setSchedule((prev) => ({...prev, name: exam_schedule[0].name, max_participants: exam_schedule[0].max_participants, 
        //             started_at: exam_schedule[0].started_at, ended_at: exam_schedule[0].ended_at, school_id: exam_schedule[0].exam_schedule_schools[0]?.school_id, admission_ays_id: exam_schedule[0].admission_ays_id}))
        dispatch(openModal({title : "Edit Pendaftar", bodyType : MODAL_BODY_TYPES.ADMISSION_SCHOOLS_APPLICANT_EDIT,
            extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSION_SCHOOLS_APPLICANT_EDIT_SAVE, index: id, sch_id: sch_id, appl_id: index, data: applicantData }
        },
            
        ))
        // navigate(`/ad/admissions/schools/edit/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.SCHEDULE_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentSchedule = (index) => {
        navigate(`/ad/academic-years/${id}/schools/${sch_id}/applicants/detail/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }

    return(
        <>
            
                <TabHeaderSP id = {id} options={options} sch_id={sch_id} activeKey='Pendaftar' ></TabHeaderSP>
            <TitleCard title="Pendaftar" topMargin="mt-2" TopSideButtons={<TopSideButtons applicants={ExamApplicants} applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
                {/* <TabHeaderE></TabHeaderSP> */}
            <div className="overflow-x-auto w-full" z-index="-10">
                {ExamApplicants && (
                    <div className="w-full mx-auto py-10">
                    <DataTable
                        columns={columns}
                        data={serelizedData ?? []}
                        filterBy="Nama"
                    />
                    </div>
                )}

                {/* <CustomDynamicTable
                    tableData={ExamApplicants}
                    tableColumns={["full_name", "gender", "email", "regist_number"]}
                    excludeColumns={[""]}
                    onRowClick={handleRowClick}
                    rowClassName={(row) =>
                    cn(
                        row.age >= 18 ? "bg-red-100" : "",
                        selected.includes(row.id) ? "bg-slate-100" : ""
                    )
                    }
                    customBodyRender={(row, col) => {
                    if (col === "name") {
                        return (
                        <div className="flex items-center gap-2">
                            <input
                            type="checkbox"
                            checked={selected.includes(row.id)}
                            onChange={() => toggleSelection(row.id)}
                            onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                            />
                            {row.name}
                        </div>
                        );
                    }
                    }}
                /> */}
                {/* <table className="table w-full">
                    <thead>
                    <tr>
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
                    </tr>
                    </thead>
                    <tbody>
                        {
                            ExamApplicants.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.regist_number }</div></td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <div className="font-bold">{l.full_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="">{l.phone_number}</div></td>
                                    <td><div className="">{l.gender==='male'? 'Laki-Laki': 'Perempuan'}</div></td>
                                    <td><div className="">{l.participants[0]?.pob}</div></td>
                                    <td><div className="">{formatDateNew(l.created_at) }</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.participants[0]?.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{l.participants[0]?.submission_status==='accepted'?'Lulus':l.participants[0]?.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.participants[0]?.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.participants[0]?.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.participants[0]?.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.participants[0]?.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.participants[0]?.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.participants[0]?.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td>
                                    <td>{formatDateNew(l.updated_at) }</td>
                                    <td>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-green-200" onClick={() => detailCurrentSchedule(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-orange-200" onClick={() => editCurrentSchedule(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-red-200" onClick={() => deleteCurrentSchedule(l.id)}><TrashIcon className="w-5"/></button>
                                    </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table> */}
            </div>
            </TitleCard>
        </>
    )
}


export default AdmissionApplicants