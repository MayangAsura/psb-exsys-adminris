import React, { useEffect, useState } from "react";
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSkype,
  FaTwitter,
  FaUserCircle
} from "react-icons/fa";
import { TbUserSquareRounded } from "react-icons/tb";
import { MdOutlineCoPresent } from 'react-icons/md'
import { openModal } from "../../../../features/common/modalSlice";
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "../../../../utils/globalConstantUtil";
import profile from "../../../images/profile.jpg";
import supabase from "../../../services/database/database";
import { useDispatch } from "react-redux";


const socials = [
  {
    id: 1,
    icon: <FaFacebookF />,
    link: "#0",
  },
  {
    id: 2,
    icon: <FaGithub />,
    link: "#0",
  },
  {
    id: 3,
    icon: <FaLinkedinIn />,
    link: "#0",
  },
  {
    id: 4,
    icon: <FaInstagram />,
    link: "#0",
  },
  {
    id: 5,
    icon: <FaBehance />,
    link: "#0",
  },
  {
    id: 6,
    icon: <FaDribbble />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaSkype />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaTwitter />,
    link: "#0",
  },
];

const Presence = (props) => {

  const [applicantPresence, setApplicantPresence] = useState({})
  const dispatch = useDispatch()


  // useEffect(() => {
  //       getPresenceData()
  //       console.log(applicantPresence)
  //   },[])

    useEffect(() =>{
      // getPresenceData(props.id, props.sid)
      console.log(applicantPresence)
    },[props.id, props.sid])

    
    const getPresenceData = async(id, sid) => {
    
        let { data: exam_presences, error } = await supabase
            .from('exam_presences')
            .select('*, exam_schedules(started_at, ended_at)')
            .eq('appl_id', id)
            // .eq('exam_schedule_id', sid)
            // .eq('dele', sid)

        if(!error){
          setApplicantPresence(exam_presences[0])
        }
            
    }

  const formatDate = (date) => {
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    date = new Date(date);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
    return indonesianFormat
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

  const getStatusText = (value) => {
     if (value === 'ongoing') {
      return 'Belum Tuntas'
     }
     if (value === 'done') {
      return 'Tuntas'
     }
  }

  const handlePresence = async () => {


    let { data: presence, pre_error } = await supabase
      .from('exam_presences')
      .select('appl_id')
      .eq('appl_id', id)
  
    if(presence){
      openErrorModal({message: "Anda telah melakukan presensi sebelumnya."})
    }
    if(!presence){

      const sid = props.sid? props.sid : 'd17ff676-85d2-4f9e-88f1-0fdfb37517b9'
    const id = props.id? props.id : '5a49e038-9f25-4e37-a2b8-f4ed6fc7a923'
    const { data, error } = await supabase
      .from('exam_presences')
      .insert([
        { exam_schedule_id: sid, appl_id: id, queue_number: getQueNum(), presence_at: new Date().toISOString(), status: 'ongoing', created_by: id },
      ])
      .select()
      console.log()
    if(error){
      openErrorModal({message: "Data tidak ditemukan"})
    }else{
      openSuccessModal()
    }
    }
    // const presence_at
    const sid = props.sid? props.sid : 'd17ff676-85d2-4f9e-88f1-0fdfb37517b9'
    const id = props.id? props.id : '5a49e038-9f25-4e37-a2b8-f4ed6fc7a923'
    const { data, error } = await supabase
      .from('exam_presences')
      .insert([
        { exam_schedule_id: sid, appl_id: id, queue_number: getQueNum(), presence_at: new Date().toISOString(), status: 'ongoing', created_by: id },
      ])
      .select()
      console.log()
    if(error){
      openErrorModal()
    }else{
      openSuccessModal()
    }
              
  }
  const getQueNum = () => {
  //   min = Math.ceil(min);
  // max = Math.floor(max);
  return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    // return num
  }
  const openSuccessModal = () => {
  console.log('masuk')
  dispatch(openModal({title : "Presensi Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS,
    extraObject : {message : "Waktu Presensi "+  getFormatDate(applicantPresence.presence_at), type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_SUCCESS}
  }))
}
  const openErrorModal = ({message}) => {
  console.log('masuk')
  dispatch(openModal({title : "Presensi Gagal", bodyType : MODAL_BODY_TYPES.MODAL_ERROR,
    extraObject : {message : message, type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_ERROR}
  }))
}

const getFormatDate = (date) => {
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    date = new Date(date);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
    return indonesianFormat
  }
  

  // const []
  return (
    <aside className=" bg-white group hover:shadow-md md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md mt-10">
      <div className="flex flex-row gap-3 justify-start items-center">

        <div className="w-16 h-16 flex items-center justify-center rounded-md text-3xl mb-5 bg-green-100 text-green-600 transition duration-200 group-hover:bg-green-600 group-hover:text-white">
          <MdOutlineCoPresent/>
          {/* {icon} */}
        </div>
        <div className="flex justify-center items-start -mt-5">
          <span className="flex flex-row text-2xl">Presensi</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 my-10 mt-5">
          <p className="text-sm ">Jadwal Ujian</p>
          <span className="text-lg text-gray-80 dark:text-gray-200 dark:bg-gray-800 badge border-none mt-0 mb-0 bg-green-100 py-3 px-5">{formatDateNew(new Date().toISOString()) }</span>
          {/* {`${formatDateNew(applicantPresence.exam_schedules.started_at) - formatDateNew(applicantPresence.exam_schedules.ended_at)}`}  */}
        </div>
        <div className="flex flex-col gap-2 my-10 mt-5 justify-items-end">
          <p className="text-sm ">Kehadiran</p>
          <span className="text-lg text-gray-800 dark:text-gray-200 dark:bg-gray-800 badge border-none mt-0 mb-0 bg-green-100 py-3 px-5">{applicantPresence? formatDateNew(applicantPresence.presence_at??new Date().toISOString()): "-"}</span>
          
        </div>
      </div>
      {/* <div className="w-24 h-24 rounded-md overflow-hidden mx-auto mb-5">
        <img src={profile} alt="shafiqhammad" className="w-full" />
      </div> */}
      {applicantPresence? (
        <>
        <div className="flex justify-center items-center">
        <div className="ml-5 flex-1 items-end mt-5">
          <p className="text-4xl text-gray-800 w-52 font-bold mb-1">{applicantPresence.queue_number?? 123} </p>
          <p className="text-sm text-gray-400 mb-3"> 
            No. Urut
            {/* <a href="#0" className="text-green-600 pl-1">
              Abc Company
            </a> */}
          </p>
        </div>
        <div className="flex-1 items-start">
          <h1 className="text-4xl text-gray-800 font-bold mb-1">{getStatusText(applicantPresence.status?? 'Belum Tuntas')} </h1>
          <p className="text-sm text-gray-400 mb-3"> 
            Status Tahapan Seleksi
            {/* <a href="#0" className="text-green-600 pl-1">
              Abc Company
            </a> */}
          </p>

        </div>
        </div>
        </>
      ):(
        <>
        <div className="flex flex-col justify-center items-center">
          <p className="flex flex-row">Anda belum melakukan presensi. Silakan klik tombol di bawa in ipresensi</p>
        <button className="flex btn btn-md text-lg bg-orange-500 " onClick={handlePresence}>Presensi</button>
        </div>
        </>
      )}
        {/* <h1 className="text-xl text-gray-800 font-bold mb-1">{applicantPresence.queue_number} </h1>
        <p className="text-sm text-gray-400 mb-3">
          Frontend Web Developer at
          <a href="#0" className="text-green-600 pl-1">
            Abc Company
          </a>
        </p>
        <a
          href="#0"
          className="inline-block mb-3 rounded bg-green-600 text-center border-0 py-2 px-6 text-white leading-7 tracking-wide hover:bg-green-800"
          download="Resume"
        >
          Download Resume
        </a> */}
        {/* <ul className="flex flex-wrap justify-center">
          {socials.map((social, id) => (
            <SocialIcon social={social} key={id} />
          ))}
        </ul> */}
        
        
      {/* <div
            className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 -top-4">
            <!-- Description -->
            <p className="w-fit text-gray-700 dark:text-gray-400 text-md"></p>
Lorem, ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam debitis labore consectetur voluptatibus mollitia dolorem
                veniam omnis ut quibusdam minima sapiente repellendus asperiores explicabo, eligendi odit, dolore
                similique fugiat dolor, doloremque eveniet. Odit, consequatur. Ratione voluptate exercitationem hic
                eligendi vitae animi nam in, est earum culpa illum aliquam.

            <!-- Detail -->
            <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                <div className="w-full flex sm:flex-row flex-col gap-2 justify-center">
                    <div className="w-full">
                        <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                            <div className="flex flex-col pb-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Nama Calon Santri</dt>
                                <dd className="text-lg font-semibold">{applicant.full_name} </dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Lahir di</dt>
                                <dd className="text-lg font-semibold">{applicant.full_name}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Alamat</dt>
                                <dd className="text-lg font-semibold">{applicant.address}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Nama Ayah</dt>
                                <dd className="text-lg font-semibold">{applicant.father_name}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">No. WA</dt>
                                <dd className="text-lg font-semibold">{applicant.phone_number}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">IP Address</dt>
                                <dd className="text-lg font-semibold">{applicant.ip}</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="w-full">
                        <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                            <div className="flex flex-col pb-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Location</dt>
                                <dd className="text-lg font-semibold">Ethiopia, Addis Ababa</dd>
                            </div>

                            <div className="flex flex-col pt-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Phone Number</dt>
                                <dd className="text-lg font-semibold">+251913****30</dd>
                            </div>
                            <div className="flex flex-col pt-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email</dt>
                                <dd className="text-lg font-semibold">samuel@example.com</dd>
                            </div>

                            <div className="flex flex-col pt-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Website</dt>
                                <dd className="text-lg font-semibold hover:text-blue-500"><a href="https://techakim.com">https://www.teclick.com</a></dd>
                            </div>
                        </dl>
                    </div>
                </div>
                
                <div className="my-10 lg:w-[70%] md:h-[14rem] w-full h-[10rem]">
                    <!--  -->
                    <h1
                        className="w-fit font-serif my-4 pb-1 pr-2 rounded-b-md border-b-4 border-blue-600 dark:border-b-4 dark:border-yellow-600 dark:text-white lg:text-4xl md:text-3xl text-xl">
                        My Location</h1>

                    <!-- Location -->
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02028974562!2d38.613328040215286!3d8.963479542403238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1710567234587!5m2!1sen!2set"
                        className="rounded-lg w-full h-full" style="border:0;" allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
            </div>

            

        </div> */}
    {/* </div> */}
</aside>
  );
};

export default Presence;


