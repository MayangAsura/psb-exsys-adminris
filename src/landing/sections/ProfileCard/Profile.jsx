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
// import profile from "../../../images/profile.jpg";

import supabase from "../../../services/database-server";

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

const Profile = ({id, sid, ip}) => {

  const [applicant, setApplicant] = useState({})

  useEffect(() => {
    if(id){

      getExamData(id)
    }
        console.log(applicant)
        if(!applicant.ip || applicant?.ip !== ip){
          applicant.ip = ip
          updateIp()
        }
    },[applicant?.ip, id])

    const getExamData = async(id) => {
    
        let { data: exam_profiles, error } = await supabase
            .from('exam_profiles')
            .select('full_name, phone_number, regist_number, pob, home_address, father_name, mother_name)')
            .eq('appl_id', id)
// participants(dob, home_address, participant_father_data(father_name), participant_mother_data(mother_name)
        if(exam_profiles){
          // console.log()
          console.log('exam_profiles', id)
          setApplicant(exam_profiles[0])
          console.log('applicant', applicant)
        }
            
    }
    const updateIp = async () => {
      let { data: exam_profiles, error } = await supabase
            .from('exam_profiles')
            .update({ip: ip})
            .eq('appl_id', id)
            .select()

        if(!error){
          setApplicant(exam_profiles[0])
          console.log('applicant', applicant)
        }
    }
  

  // const []
  return (
    <aside className="   group hover:shadow-md md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md mt-10">
      {/* top-0 */}
      <div className="flex flex-row gap-3 justify-start align-middle items-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-md text-3xl mb-5 bg-purple-100 text-green-600 transition duration-200 group-hover:bg-green-600 group-hover:text-white">
          <TbUserSquareRounded/>
          {/* {icon} */}
        </div>
        <div className="flex justify-center align-middle items-start -mt-5">
          <span className="flex flex-row text-2xl">Identitas</span>
        </div>
        </div>
      <div className="">
        
      </div>
      {/* <div className="w-24 h-24 rounded-md overflow-hidden mx-auto mb-5">
        <img src={profile} alt="shafiqhammad" className="w-full" />
      </div> */}
      {/* <div className="text-center">
        <h1 className="text-xl text-gray-800 font-bold mb-1">John Doe</h1>
        <p className="text-sm text-gray-400 mb-3">
          Frontend Web Developer at
          <a href="#0" className="text-purple-600 pl-1">
            Abc Company
          </a>
        </p>
        <a
          href="#0"
          className="inline-block mb-3 rounded bg-purple-600 text-center border-0 py-2 px-6 text-white leading-7 tracking-wide hover:bg-purple-800"
          download="Resume"
        >
          Download Resume
        </a>
        <ul className="flex flex-wrap justify-center">
          {socials.map((social, id) => (
            <SocialIcon social={social} key={id} />
          ))}
        </ul>
      </div> */}
      <div
            className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 -top-4">
            {/* <!-- Description --> */}
            <p className="w-fit text-gray-700 dark:text-gray-400 text-md"></p>
{/* Lorem, ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam debitis labore consectetur voluptatibus mollitia dolorem
                veniam omnis ut quibusdam minima sapiente repellendus asperiores explicabo, eligendi odit, dolore
                similique fugiat dolor, doloremque eveniet. Odit, consequatur. Ratione voluptate exercitationem hic
                eligendi vitae animi nam in, est earum culpa illum aliquam. */}

            {/* <!-- Detail --> */}
            <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                <div className="w-full flex sm:flex-row flex-col gap-2 justify-center">
                    <div className="w-full">
                        <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                            <div className="flex flex-col pb-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Nama Calon Santri</dt>
                                <dd className="text-lg text-gray-900 dark:text-gray-600 font-semibold">{applicant.full_name? applicant.full_name : ''} </dd>
                            </div>
                            <div className="flex flex-col pb-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">No. Registrasi</dt>
                                <dd className="text-lg text-gray-900 dark:text-gray-600 font-semibold">{applicant.regist_number? applicant.regist_number : ''} </dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">No. WA</dt>
                                <dd className="text-lg ftext-gray-900 dark:text-gray-600 font-semibold">{applicant.phone_number? applicant.phone_number : ''}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Lahir di</dt>
                                <dd className="text-lg text-gray-900 dark:text-gray-600 font-semibold">{applicant.pob? applicant.pob : ''}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Alamat</dt>
                                <dd className="text-lg text-gray-900 dark:text-gray-600 font-semibold">{applicant.home_address? applicant.home_address : ''}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Nama Ayah</dt>
                                <dd className="text-lg text-gray-900 dark:text-gray-600 font-semibold">{applicant.father_name? applicant.father_name : ''}</dd>
                            </div>
                            <div className="flex flex-col py-3">
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">IP Address</dt>
                                <dd className="text-lg text-gray-900 dark:text-gray-600 font-semibold">{applicant.ip? applicant.id : ip}</dd>
                            </div>
                        </dl>
                    </div>
                    {/* <div className="w-full">
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
                    </div> */}
                </div>
                
                {/* <div className="my-10 lg:w-[70%] md:h-[14rem] w-full h-[10rem]">
                    <!--  -->
                    <h1
                        className="w-fit font-serif my-4 pb-1 pr-2 rounded-b-md border-b-4 border-blue-600 dark:border-b-4 dark:border-yellow-600 dark:text-white lg:text-4xl md:text-3xl text-xl">
                        My Location</h1>

                    <!-- Location -->
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02028974562!2d38.613328040215286!3d8.963479542403238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1710567234587!5m2!1sen!2set"
                        className="rounded-lg w-full h-full" style="border:0;" allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div> */}
            </div>

            {/* <!-- Social Links --> */}
            {/* <div
                className="fixed right-2 bottom-20 flex flex-col rounded-sm bg-gray-200 text-gray-500 dark:bg-gray-200/80 dark:text-gray-700 hover:text-gray-600 hover:dark:text-gray-400">
                <a href="https://www.linkedin.com/in/samuel-abera-6593a2209/">
                    <div className="p-2 hover:text-primary hover:dark:text-primary">
                        <svg className="lg:w-6 lg:h-6 w-4 h-4 text-blue-500" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                                clipRule="evenodd" />
                            <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                        </svg>

                    </div>
                </a>
                <a href="https://twitter.com/Samuel7Abera7">
                    <div className="p-2 hover:text-primary hover:dark:text-primary">
                        <svg className="lg:w-6 lg:h-6 w-4 h-4 text-gray-900" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                        </svg>

                    </div>
                </a>
                <a href="">
                    <div className="p-2 hover:text-blue-500 hover:dark:text-blue-500">
                        <svg className="lg:w-6 lg:h-6 w-4 h-4 text-blue-700" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </a>
                <a href="https://www.youtube.com/@silentcoder7">
                    <div className="p-2 hover:text-primary hover:dark:text-primary">
                        <svg className="lg:w-6 lg:h-6 w-4 h-4 text-red-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </a>
            </div> */}

        </div>
    {/* </div> */}
</aside>
  );
};

export default Profile;


