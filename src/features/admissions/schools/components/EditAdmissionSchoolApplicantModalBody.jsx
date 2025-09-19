// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import InputText from '../../../../components/Input/InputText';
// import InputTextRadio from '../../../../components/Input/InputTextRadio';
// import ErrorText from '../../../../components/Typography/ErrorText';
// import SelectBox from "../../../../components/Input/SelectBox";
// import InputDateTimePicker from "../../../../components/Input/InputDateTimePicker";
// import ToogleInput from "../../../../components/Input/ToogleInput";
// import {TbEyeOff, TbEye} from 'react-icons/tb';
// import { showNotification } from "../../../common/headerSlice";
// import { updateAdmission } from "../../../../services/api/admissions";
// import { useApplicants } from "../../../../hooks/use-applicants";
// import supabase from "../../../../services/database-server";

// function EditAdmissionSchoolApplicantModalBody({closeModal, extraObject}){
//     const dispatch = useDispatch();
//     const [errorMessage, setErrorMessage] = useState("");
//     const [admissionSchool, setAdmissionSchool] = useState({
//         full_name: "",
//         gender: "",
//         phone_number: "",
//         email: "",
//         regist_number: "",
//         media: "",
//         school_id: "",
//         subschool: ""
//     });
//     const [full_name, setFullName] = useState(admissionSchool.full_name || "")
//     const [phone_number, setPhoneNumber] = useState(admissionSchool.phone_number || "")
//     const [gender, setGender] = useState(admissionSchool.gender || "")
//     const [regist_number, setRegistNumber] = useState(admissionSchool.regist_number || "")
//     const [email, setEmail] = useState(admissionSchool.email ||"")
//     const [media, setMedia] = useState(admissionSchool.media ||"")
//     const [school_id, setSchoolId] = useState(admissionSchool.school_id ||"")
//     const [subschool, setSubschool] = useState(admissionSchool.subschool ||"")
//     const [schoolOptions, setSchoolOptions] = useState([]);
//     const [applicantSchool, setApplicantSchool] = useState({});
//     const [isVisible, setIsVisible] = useState(false);
//     const [password, setPassword] = useState("");
//     const [genderOptions] = useState([
//         {label: "Laki-Laki", value: "male"},
//         {label: "Perempuan", value: "female"}
//     ]);
//     const [mediaOptions] = useState([
//         {label: "Website", value: "website"},
//         {label: "Teman / Saudara", value: "teman/saudara"},
//         {label: "Karyawan/Guru", value: "karyawan/guru"},
//         {label: "Kajian", value: "kajian"},
//         {label: "Spanduk", value: "spanduk"},
//         {label: "Brosur", value: "brosur"},
//         {label: "Instagram", value: "instagram"},
//         {label: "Facebook", value: "facebook"},
//         {label: "Youtube", value: "youtube"},
//         {label: "Tiktok", value: "tiktok"},
//         {label: "Mesin Pencari", value: "mesin_pencari"}
//     ]);
//     const {onSubmit, results, form, loading} = useApplicants();
//     const {handleSubmit, register, formState: {errors}} = form;
//     const {index, sch_id, appl_id, data} = extraObject;

//     useEffect(() => {
//         getSchoolsOptions();
//     }, []);

//     useEffect(() => {
//         if (index || sch_id || appl_id) {
//             getAdmissionSchool(index, sch_id, appl_id);
//         }
//     }, [index, sch_id, appl_id, data]);

//     const getAdmissionSchool = async (index, sch_id, appl_id) => {
//         if (appl_id) {
//             const {data: admission_schools, error } = await supabase
//                 .from('applicants')
//                 .select("*, applicant_schools!inner(*)")
//                 .eq('applicant_schools.school_id', sch_id)
//                 .eq('applicant_schools.admission_ays_id', index)
//                 .eq('id', appl_id)
//                 .is('deleted_at', null);
            
//             if(admission_schools && admission_schools[0]){
//                 const applicantData = admission_schools[0];
//                 setAdmissionSchool({
//                     full_name: applicantData.full_name || "",
//                     gender: applicantData.gender || "",
//                     phone_number: applicantData.phone_number || "",
//                     email: applicantData.email || "",
//                     media: applicantData.media || "",
//                     school_id: applicantData.applicant_schools[0]?.school_id || "",
//                     subschool: applicantData.applicant_schools[0]?.subschool || "",
//                     regist_number: applicantData.regist_number || ""
//                 });
//                 // setFullName(applicantData.full_name)
//                 // setRegistNumber(applicantData.regist_number)
//                 // setPhoneNumber(applicantData.phone_number)
//                 // setGender(applicantData.gender)
//                 // setMedia(applicantData.media)
//                 // setEmail(applicantData.email)
//                 // setSchoolId(applicantData.school_id)
//                 // setSubschool(applicantData.subschool)
//                 // setApplicantSchool(admission_schools[0].applicant_schools[0]);
//             } else {
//                 console.log(error);
//             }
//         }
//     };

//     const handleInputChange = (field, value) => {
//         setAdmissionSchool(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handledVisible = () => {
//         setIsVisible(prevState => !prevState);
//     };

//     const saveAdmissionSchool = async () => {
//         console.log('admissionSchool', admissionSchool);
//         const response = await updateAdmission({applicant: admissionSchool, id: appl_id});
//         console.log(response);
//         if(response.error){
//             dispatch(showNotification({message : "Gagal Memperbarui data Pendaftar!", status : 0}));
//         } else {
//             dispatch(showNotification({message : "Berhasil Memperbarui data Pendaftar!", status : 1}));
//         }
//         closeModal();
//     };

//     const getSchoolsOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('schools')
//             .select('*');
            
//         if(!error){
//             setSchoolOptions(schools.map((e) => {
//                 return { value: e.school_id, label: e.school_name };
//             }));
//         }
//     };

//     const updateFormValue = ({updateType, value}) => {
//         setErrorMessage("");
//         setAdmissionSchool({...admissionSchool, [updateType]: value});
//     };

//     return(
//         <>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <label className="block">
//                     <span className="block mb-1 text-xs font-medium text-gray-700">Nama Lengkap</span>
//                     <input 
//                         className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" 
//                         type="text" 
//                         name="full_name" 
//                         value={full_name}
//                         defaultValue={setAdmissionSchool.full_name}
//                         onChange={(e) => setFullName(e.target.value)} 
//                         placeholder="" 
//                         required
//                         {...register('full_name')}
//                     />
//                     {errors.full_name && (
//                         <p className="text-xs text-red-500"> {errors.full_name.message} </p>
//                     )}
//                 </label>

//                 <label className="block mt-4">
//                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Registrasi</span>
//                     <input 
//                         className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" 
//                         type="text" 
//                         name="regist_number" 
//                         value={regist_number}
//                         defaultValue={setAdmissionSchool.regist_number} 
//                         onChange={(e) => setRegistNumber(e.target.value)}
//                         placeholder=""
//                         required 
//                         {...register('regist_number')}
//                     />
//                     {errors.regist_number && (
//                         <p className="text-xs text-red-500"> {errors.regist_number.message} </p>
//                     )}
//                 </label>

//                 <div className="mt-4">
//                     <label className="block text-gray-900 text-sm font-medium mb-1">Jenis Kelamin <span className="text-red-600">*</span></label>
//                     <div className="flex items-center">
//                         <input 
//                             name="gender" 
//                             value={admissionSchool.gender === 'male'?admissionSchool.gender:'male'}
//                             onChange={(e) => setGender(e.target.value)}
//                             type="radio" 
//                             className="form-radio text-indigo-600" 
//                             required
//                             {...register('gender')} 
//                         /> 
//                         <span className='text-gray-800 text-sm font-medium ml-2'>Laki-Laki</span>
                        
//                         <input 
//                             name="gender" 
//                             value={admissionSchool.gender === 'female'?admissionSchool.gender:'female'}
//                             // checked={admissionSchool.gender === 'female'} 
//                             onChange={(e) => setGender(e.target.value)}
//                             type="radio" 
//                             className="form-radio text-indigo-600 ml-4" 
//                             required
//                             {...register('gender')} 
//                         /> 
//                         <span className='text-gray-800 text-sm font-medium ml-2'>Perempuan</span>
//                     </div>
//                     {errors.gender && (
//                         <p className="text-xs text-red-500"> {errors.gender.message} </p>
//                     )}
//                 </div>

//                 <label className="block mt-4">
//                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Telepon</span>
//                     <input 
//                         className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" 
//                         type="text" 
//                         name="phone_number" 
//                         value={phone_number}
//                         defaultValue={setAdmissionSchool.phone_number}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         placeholder="" 
//                         required
//                         {...register('phone_number')} 
//                     />
//                     {errors.phone_number && (
//                         <p className="text-xs text-red-500"> {errors.phone_number.message} </p>
//                     )}
//                 </label>

//                 <label className="block mt-4">
//                     <span className="block mb-1 text-xs font-medium text-gray-700">Email</span>
//                     <input 
//                         className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" 
//                         type="email" 
//                         name="email" 
//                         value={email}
//                         defaultValue={setAdmissionSchool.email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="" 
//                         required
//                         {...register('email')}
//                     />
//                     {errors.email && (
//                         <p className="text-xs text-red-500"> {errors.email.message} </p>
//                     )}
//                 </label>

//                 <label className="block mt-4">
//                     <span className="block mb-1 text-xs font-medium text-gray-700">Kelas (Khusus TKIT)</span>
//                     <input 
//                         // className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" 
//                         className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline"
//                         name="subschool" 
//                         value={subschool}
//                         defaultValue={setAdmissionSchool.subschool}
//                         onChange={(e) => setSubschool(e.target.value)}
//                         placeholder=""
//                         {...register('subschool')}
//                     />
//                     {errors.subschool && (
//                         <p className="text-xs text-red-500"> {errors.subschool.message} </p>
//                     )}
//                 </label>

//                 <div className="mt-4">
//                     <span className="block mb-1 text-xs font-medium text-gray-700">Password</span>
//                     <div className="flex mb-4">
//                         <input 
//                             // className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" 
//                             className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline"
//                             type={isVisible ? "text" : "password"} 
//                             name="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             // required
//                             {...register('password')}
//                         />
//                         <button 
//                             type="button" 
//                             onClick={handledVisible} 
//                             className="flex justify-around items-center"
//                             // className="ml-2 flex items-center justify-center w-10"
//                         >
//                             {isVisible ? (
//                                 <TbEyeOff size={20} />
//                             ) : (
//                                 <TbEye size={20} />
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="mt-4">
//                     <label htmlFor="media" className="block text-sm font-medium text-gray-900">Media</label>
//                     <select 
//                         id="media" 
//                         name="media" 
//                         value={media}
//                         defaultValue={setAdmissionSchool.media}
//                         onChange={(e) => setMedia(e.target.value)}
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                         {...register('media')}
//                     >
//                         <option value="">-Pilih Media-</option>
//                         <option value="website">Website Rabbaanii</option>
//                         <option value="teman/saudara">Teman / Saudara</option>
//                         <option value="karyawan/guru">Karyawan/Guru</option>
//                         <option value="kajian">Kajian</option>
//                         <option value="spanduk">Spanduk</option>
//                         <option value="brosur">Brosur</option>
//                         <option value="instagram">Instagram</option>
//                         <option value="facebook">Facebook</option>
//                         <option value="youtube">Youtube</option>
//                         <option value="majalah">Majalah</option>
//                         <option value="whatsapp">WhatsApp</option>
//                         <option value="tiktok">Tiktok</option>
//                         <option value="mesin_pencari">Rekomendasi mesin pencarian internet</option>
//                     </select>
//                     {errors.media && (
//                         <p className="text-xs text-red-500"> {errors.media.message} </p>
//                     )}
//                 </div>

//                 <div className="mt-4">
//                     <label htmlFor="school_id" className="block text-sm font-medium text-gray-900">Jenjang</label>
//                     <select 
//                         id="school_id" 
//                         name="school_id" 
//                         value={school_id}
//                         defaultValue={setAdmissionSchool.school_id}
//                         onChange={(e) => setSchoolId(e.target.value)}
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                         {...register('school_id')}
//                     >
//                         <option value="">-Pilih Jenjang-</option>
//                         <option value="1">SDIT Rabbaanii</option>
//                         <option value="2">TKIT Rabbaanii</option>
//                         <option value="3">SMPI Rabbaanii</option>
//                         <option value="4">SMP Pesantren</option>
//                         <option value="5">SMA Pesantren</option>
//                         <option value="6">SMAI Rabbaanii</option>
//                     </select>
//                     {errors.school_id && (
//                         <p className="text-xs text-red-500"> {errors.school_id.message} </p>
//                     )}
//                 </div>

//                 <ErrorText styleClass="mt-6">{errorMessage}</ErrorText>

//                 <div className="modal-action mt-6">
//                     <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
//                     <button 
//                         className="btn btn-primary bg-green-500 text-gray-100 hover:bg-green-400 hover:text-gray-50 border-none px-6" 
//                         // onClick={saveAdmissionSchool}
//                     >
//                         Simpan
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// }

// export default EditAdmissionSchoolApplicantModalBody;

// // import { useEffect, useState } from "react"
// // import { useDispatch } from "react-redux"
// // import InputText from '../../../../components/Input/InputText'
// // import InputTextRadio from '../../../../components/Input/InputTextRadio'
// // import ErrorText from '../../../../components/Typography/ErrorText'
// // import SelectBox from "../../../../components/Input/SelectBox"
// // import InputDateTimePicker from "../../../../components/Input/InputDateTimePicker"
// // import ToogleInput from "../../../../components/Input/ToogleInput"
// // import {TbEyeOff, TbEye} from 'react-icons/tb'
// // import { showNotification } from "../../../common/headerSlice"
// // import { updateAdmission } from "../../../../services/api/admissions"
// // import { useApplicants } from "../../../../hooks/use-applicants"
// // import supabase from "../../../../services/database-server"

// // import {
// //   Button,
// //   Checkbox,
// //   FormControl,
// //   FormControlLabel,
// //   FormLabel,
// //   IconButton,
// //   Radio,
// //   RadioGroup,
// //   Select,
// //   TextField,
// // } from "@mui/material";

// // // import { addNewLead } from "../leadSlice"

// // // const INITIAL_ADMISSION_SCHOOL = {
// // //     admission_id : "",
// // //     school_id : "",
// // //     started_at : "",
// // //     ended_at : "",
// // //     admission_status : "",
// // //     admission_fee : "",
// // //     quota : ""
// // // }

// // function EditAdmissionSchoolApplicantModalBody({closeModal, extraObject}){
// //     const dispatch = useDispatch()
// //     // const [loading, setLoading] = useState(false)
// //     const [errorMessage, setErrorMessage] = useState("")
// //     const [admissionSchool, setAdmissionSchool] = useState({})
// //     const [schoolOptions, setSchoolOptions] = useState([])
// //     const [applicantSchool, setApplicantSchool] = useState({})
// //     const [isVisible, setIsVisible] = useState(false)
// //     const [full_name, setFullName] = useState("")
// //     const [regist_number, setRegistNumber] = useState("")
// //     const [gender, setGender] = useState("")
// //     const [phone_number, setPhoneNumber] = useState("")
// //     const [_phone_number, set_PhoneNumber] = useState("")
// //     const [email, setEmail] = useState("")
// //     const [school_id, setSchoolId] = useState("")
// //     const [school_name, setSchoolName] = useState("")
// //     const [subschool, setSubschool] = useState("")
// //     const [password, setPassword] = useState("")
// //     const [temp_password, setTempPassword] = useState("")
// //     const [confirm_password, setConfirmPassword] = useState("")
// //     const [media, setMedia] = useState("website")
// //     const [genderOptions, setGenderOptions] = useState([{label: "Laki-Laki", value: "male"},{label: "Perempuan", value: "female"}])
// //     const [mediaOptions, setMediaOptions] = useState([{label: "Website", value: "website"},{label: "Teman / Saudara", value: "teman/saudara"},{label: "Karyawan/Guru", value: "karyawan/guru"},{label: "Kajian", value: "kajian"},{label: "Spanduk", value: "spanduk"},{label: "Brosur", value: "brosur"},{label: "Instagram", value: "instagram"},{label: "Facebook", value: "facebook"},{label: "Youtube", value: "youtube"},{label: "Tiktok", value: "tiktok"},{label: "Mesin Pencari", value: "mesin_pencari"}])
// //     const {onSubmit, results, form, loading} = useApplicants()
// //     const {handleSubmit, register, formState: {errors}} = form
// //     // 'website'? media:"website"}>Website Rabbaanii </option>
// //     //                       <option value={media== 'teman/saudara'? media:"teman/saudara"} >Teman / Saudara</option>
// //     //                       <option value={media== 'karyawan/guru'? media:"karyawan/guru"}>Karyawan/Guru </option>
// //     //                       <option value={media== 'kajian'? media:"kajian"}>Kajian</option>
// //     //                       <option value={media== 'spanduk'? media:"spanduk"}>Spanduk</option>
// //     //                       <option value={media== 'brosur'? media:"brosur"}>Brosur</option>
// //     //                       <option value={media== 'instagram'? media:"instagram"}>Instagram </option>
// //     //                       <option value={media== 'facebook'? media:"facebook"}>Facebook </option>
// //     //                       <option value={media== 'youtube'? media:"youtube"}>Youtube </option>
// //     //                       <option value={media== 'majalah'? media: "majalah"}>Majalah </option>
// //     //                       <option value={media== 'whatsapp'? media:"whatsapp"}>WhatsApp</option>
// //     //                       <option value={media== 'tiktok'? media:"tiktok"}>Tiktok</option>
// //     //                       <option value={media== 'mesin_pencari'

// //     const {index, sch_id, appl_id, data} = extraObject

// //     useEffect(() => {
// //         getSchoolsOptions()
// //     },[])
// //     useEffect(() => {
// //         // getSchoolsOptions()
        
// //         // if(data){
// //         //     setAdmissionSchool(data)
// //         //     console.log('data>', data)
// //         //     // getSchoolsOptions
// //         // }else{

// //             if(index || sch_id || appl_id){
// //                 getAdmissionSchool(index, sch_id, appl_id)
// //             // setAdmissionSchool({...admissionSchool})
// //             }
// //         // }
// //         console.log('applicantSchool', applicantSchool)
// //         console.log('admissionSchool', admissionSchool)
// //         console.log('media', admissionSchool.media)
// //     }, [index, sch_id, appl_id, data])

// //     const getAdmissionSchool = async (index, sch_id, appl_id) => {
// //         if (appl_id) {
// //             const {data: admission_schools, error } = await supabase.from('applicants')
// //                                                         .select("*, applicant_schools!inner(*)")
// //                                                         .eq('applicant_schools.school_id', sch_id)
// //                                                         .eq('applicant_schools.admission_ays_id', index)
// //                                                         // .neq('applicant_schools.school_id', null)
// //                                                         // .neq('applicant_schools.admission_ays_id', null)
// //                                                         .eq('id', appl_id)
// //                                                         .is('deleted_at', null)
// //             if(admission_schools){
// //                 console.log(admission_schools[0])
// //                 // admission_schools[0].map((e) => 
// //                 //     {setFullName(e.full_name),
// //                 //     setGender(e.gender),
// //                 //     setPhoneNumber(e.phone_number),
// //                 //     setEmail(e.email),
// //                 //     setRegistNumber(e.regist_number),
// //                 //     setMedia(e.media),
// //                 //     setSchoolId(e.applicant_schools[0]?.school_id),
// //                 //     setSubschool(e.applicant_schools[0]?.subschool)
// //                 //     // setFullName(e.full_name)
// //                 // }
// //                 // )
// //                 setFullName(admission_schools[0].full_name),
// //                 setGender(admission_schools[0].gender),
// //                 setPhoneNumber(admission_schools[0].phone_number),
// //                 setEmail(admission_schools[0].email),
// //                 setRegistNumber(admission_schools[0].regist_number),
// //                 setMedia(admission_schools[0].media),
// //                 setSchoolId(admission_schools[0].applicant_schools[0]?.school_id),
// //                 setSubschool(admission_schools[0].applicant_schools[0]?.subschool)
// //                 // setAdmissionSchool(admission_schools[0])
// //                 setAdmissionSchool({...admissionSchool, 
// //             full_name: admission_schools[0].full_name,
// //             gender: admission_schools[0].gender,
// //             phone_number: admission_schools[0].phone_number,
// //             regist_number: admission_schools[0].regist_number,
// //             email: admission_schools[0].email,
// //             media: admission_schools[0].media,
// //             school_id: admission_schools[0].applicant_schools[0]?.school_id
// //         })
// //         console.log('admissionSchool', admissionSchool)
// //                 // setSchedule((prev) => ({...prev, name: exam_schedule[0].name, max_participants: exam_schedule[0].max_participants, 
// //                 //     started_at: exam_schedule[0].started_at, ended_at: exam_schedule[0].ended_at, school_id: exam_schedule[0].exam_schedule_schools[0]?.school_id, admission_ays_id: exam_schedule[0].admission_ays_id}))
// //                 setApplicantSchool(admission_schools[0].applicant_schools[0])
// //             }else{
// //                 console.log(error)
// //             }
// //         }else{
            
// //         }
// //     }

// //     const handledVisible = () => {
// //         setIsVisible(prevState => !prevState)
// //     }
// //     const saveAdmissionSchool = async () => {
// //         // if(admissionSchool.school_id.trim() === "")return setErrorMessage("First Name is required!")
// //         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
// //         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
// //         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
// //         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
// //         // else{
// //             // let newAdmissionSchool = {
// //             //     "id": 7,
// //             //     "email": admissionSchool.email,
// //             //     "first_name": admissionSchool.first_name,
// //             //     "last_name": admissionSchool.last_name,
// //             //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
// //             // }
// //             console.log('admissionSchool', admissionSchool)
// //             const response = await updateAdmission({applicant: admissionSchool, id: appl_id})
// //             console.log(response)
// //             if(response.error){
// //                 dispatch(showNotification({message : "Gagal Memperbarui data Pendaftar!", status : 0}))

// //             }else{
// //                 dispatch(showNotification({message : "Berhasil Memperbarui data Pendaftar!", status : 1}))
// //             }
// //             // dispatch(showNotification({message : "New Lead Added!", status : 1}))
// //             closeModal()
// //         // }
// //     }

// //     const getSchoolsOptions = async () => {
// //         let { data: schools, error } = await supabase
// //             .from('schools')
// //             .select('*')
// //             console.log(schools)
// //             if(!error){
// //                 // setSchoolOptions(schools)
// //                 // setSchoolOptions()
// //                 setSchoolOptions(schools.map((e) => {return {
// //                     value:e.school_id, label: e.school_name
// //                 }}))
// //                 // schools.map((e)=>(
// //                 //         // setScheduleOptions( e => {
// //                 //         schoolOptions.push({ value:e.school_id, label: e.school_name})
                        
// //                 //     ))
// //                 //     console.log(schoolOptions)
// //             // //     // schedulesOptions e.name

// //             // }))
// //             // name: schedule
// //             // setScheduleOptions(schedule => {.})
// //         }
// //     }

// //     const updateFormValue = ({updateType, nameInput=null, value, newValue=null}) => {
// //         setErrorMessage("")
// //         setAdmissionSchool({...admissionSchool, [updateType] : value?value: newValue})
// //         console.log('admissionSchool>', admissionSchool, value, newValue)

// //     }

// //     return(
// //         <>
// //             <form onSubmit={handleSubmit(onSubmit)}>

// //                 <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">Nama Lengkap</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="full_name" name="full_name" value={full_name} onChange={(e) => setFullName(e.target.value)} placeholder="" inputMode="" required />
// //                     {errors.full_name && (
// //                         <p className="text-xs text-red-500"> {errors.full_name.message} </p>
// //                     )}
// //                     {/* onChange={(e) => setFullName(e.target.value)}  */}
// //                     {/* text-gray-800 */}
// //                 </label>
// //                 <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Registrasi</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="" name="regist_number" value={regist_number} onChange={(e) => setRegistNumber(e.target.value)} placeholder="" inputMode="" required />
// //                     {errors.regist_number && (
// //                         <p className="text-xs text-red-500"> {errors.regist_number.message} </p>
// //                     )}
// //                     {/* onChange={(e) => setFullName(e.target.value)}  */}
// //                     {/* text-gray-800 */}
// //                 </label>
// //                 <label className="block text-gray-900 text-sm font-medium mb-1" htmlFor="jenis_kelamin">Jenis Kelamin <span className="text-red-600">*</span></label>
// //                     <input name="gender" onChange={(e) => setGender(e.target.value)} value={admissionSchool.gender=='male'?admissionSchool.gender:'male'} {...register('gender')} type="radio" className="form-input text-gray-800" placeholder="" required /> <span className='text-gray-800 text-sm font-medium'>Laki-Laki</span>
// //                     <input name="gender" onChange={(e) => setGender(e.target.value)} value={admissionSchool.gender=='female'?admissionSchool.gender:'female'} checked={admissionSchool.gender=='female'} {...register('gender')} type="radio" className="form-input text-gray-800 ml-3" placeholder="" required /> <span className='text-gray-800 text-sm font-medium'>Perempuan</span>
// //                     {errors.gender && (
// //                     <p className="text-xs text-red-500"> {errors.gender.message} </p>
// //                     )}
// //                 {/* <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Registrasi</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="regist_number" name="regist_number" value={admissionSchool.regist_number}  placeholder="" inputMode="" required />
// //                     {errors.regist_number && (
// //                         <p className="text-xs text-red-500"> {errors.regist_number.message} </p>
// //                     )}
// //                     onChange={(e) => setFullName(e.target.value)}  
// //                     text-gray-800
// //                 </label> */}
// //                 <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Telepon</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="phone_number" name="phone_number" value={admissionSchool.phone_number}  onChange={(e) => setPhoneNumber(e.target.value)} placeholder="" inputMode="" required />
// //                     {errors.phone_number && (
// //                         <p className="text-xs text-red-500"> {errors.phone_number.message} </p>
// //                     )}
// //                     {/* onChange={(e) => setFullName(e.target.value)}  */}
// //                     {/* text-gray-800 */}
// //                 </label>
// //                 {/* <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Telepon</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="phone_number" name="phone_number" value={admissionSchool.phone_number}  placeholder="" inputMode="" required />
// //                     {errors.phone_number && (
// //                         <p className="text-xs text-red-500"> {errors.phone_number.message} </p>
// //                     )}
// //                     onChange={(e) => setFullName(e.target.value)} 
// //                     text-gray-800
// //                 </label> */}
// //                 {/* <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">No. Telepon</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="phone_number" name="phone_number" value={admissionSchool.phone_number}  placeholder="" inputMode="" required />
// //                     {errors.phone_number && (
// //                         <p className="text-xs text-red-500"> {errors.phone_number.message} </p>
// //                     )}
// //                     onChange={(e) => setFullName(e.target.value)} 
// //                     text-gray-800
// //                 </label> */}
// //                 <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">Email</span>
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="email" name="email" value={admissionSchool.email} onChange={(e) => setEmail(e.target.value)} placeholder="" inputMode="" required />
// //                     {errors.email && (
// //                         <p className="text-xs text-red-500"> {errors.email.message} </p>
// //                     )}
// //                     {/* onChange={(e) => setFullName(e.target.value)}  */}
// //                     {/* text-gray-800 */}
// //                 </label>
// //                 <label className="block">
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">Kelas (Khusus TKIT)</span>
// //                     <input xclassName="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" name="subschool" value={admissionSchool.subschool} onChange={(e) => setSubschool(e.target.value)}  placeholder="" inputMode="" required />
// //                     {errors.subschool && (
// //                         <p className="text-xs text-red-500"> {errors.subschool.message} </p>
// //                     )}
// //                     {/* onChange={(e) => setFullName(e.target.value)} 
// //                     text-gray-800 */}
// //                 </label>
// //                     <span className="block mb-1 text-xs font-medium text-gray-700">Password</span>
// //                 <label className=" flex mb-4">
// //                     <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type={isVisible? "text" : "password"} name="password"   onChange={(e) => setPassword(e.target.value)}required />
// //                     {/* onChange={(e)=> setPassword(e.target.value)} */}
// //                     <button type="button" onClick={handledVisible} 
// //                         className="flex justify-around items-center">
// //                           {isVisible? (
// //                             <TbEyeOff size={20} className='absolute mr-10'></TbEyeOff>
// //                           ):(
// //                             <TbEye size={20} className='absolute mr-10'></TbEye>
// //                           ) }
                          
// //                         </button>
// //                     </label>
// //                     <label htmlFor="media" className="block text-sm font-medium text-gray-900">Media</label>
// //                       {/* <div className="mt-2 grid grid-cols-1"> */}
// //                           <select id="media" name="media" onChange={(e) => setMedia(e.target.value)} {...register('media')} autoComplete="media" defaultValue={admissionSchool.media} className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" required>
// //                           <option value="">-Pilih Media-</option>
// //                           <option value={admissionSchool.media== 'website'? admissionSchool.media:"website"}>Website Rabbaanii </option>
// //                           <option value={admissionSchool.media== 'teman/saudara'? admissionSchool.media:"teman/saudara"} >Teman / Saudara</option>
// //                           <option value={admissionSchool.media== 'karyawan/guru'? admissionSchool.media:"karyawan/guru"}>Karyawan/Guru </option>
// //                           <option value={admissionSchool.media== 'kajian'? admissionSchool.media:"kajian"}>Kajian</option>
// //                           <option value={admissionSchool.media== 'spanduk'? admissionSchool.media:"spanduk"}>Spanduk</option>
// //                           <option value={admissionSchool.media== 'brosur'? admissionSchool.media:"brosur"}>Brosur</option>
// //                           <option value={admissionSchool.media== 'instagram'? admissionSchool.media:"instagram"}>Instagram </option>
// //                           <option value={admissionSchool.media== 'facebook'? admissionSchool.media:"facebook"}>Facebook </option>
// //                           <option value={admissionSchool.media== 'youtube'? admissionSchool.media:"youtube"}>Youtube </option>
// //                           <option value={admissionSchool.media== 'majalah'? admissionSchool.media: "majalah"}>Majalah </option>
// //                           <option value={admissionSchool.media== 'whatsapp'? admissionSchool.media:"whatsapp"}>WhatsApp</option>
// //                           <option value={admissionSchool.media== 'tiktok'?admissionSchool.media:"tiktok"}>Tiktok</option>
// //                           <option value={admissionSchool.media== 'mesin_pencari'? admissionSchool.media:"mesin_pencari"}>Rekomendasi mesin pencarian internet</option>

// //                           </select>
// //                           {errors.media && (
// //                             <p className="text-xs text-red-500"> {errors.media.message} </p>
// //                           )}
// //                           <label htmlFor="school_id" className="block text-sm font-medium text-gray-900">Jenjang</label>
// //                       {/* <div className="mt-2 grid grid-cols-1"> */}
// //                           <select id="school_id" name="school_id" onChange={(e) => setSchoolId(e.target.value)} {...register('school_id')}  defaultValue={admissionSchool.school_id?admissionSchool.school_id: applicantSchool.school_id} className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" required>
// //                           <option value="">-Pilih Jenjang-</option>
// //                           <option value={applicantSchool.school_id== 1 || admissionSchool.school_id==1? applicantSchool.school_id:1}>SDIT Rabbaanii </option>
// //                           <option value={applicantSchool.school_id== 2? applicantSchool.school_id:2}>TKIT Rabbaanii</option>
// //                           <option value={applicantSchool.school_id== 3? applicantSchool.school_id:3}>SMPI Rabbaanii </option>
// //                           <option value={applicantSchool.school_id== 4? applicantSchool.school_id:4}>SMP Pesantren </option>
// //                           <option value={applicantSchool.school_id== 5? applicantSchool.school_id:5}>SMA Pesantren </option>
// //                           <option value={applicantSchool.school_id== 6? applicantSchool.school_id:6}>SMAI Rabbaanii </option>
// //                           {/* <option value={school_id== 3? school_id:3}>SMPI Rabbaanii </option> */}
// //                           {/* <option value={media== 'teman/saudara'? media:"teman/saudara"} >Teman / Saudara</option>
// //                           <option value={media== 'karyawan/guru'? media:"karyawan/guru"}>Karyawan/Guru </option>
// //                           <option value={media== 'kajian'? media:"kajian"}>Kajian</option>
// //                           <option value={media== 'spanduk'? media:"spanduk"}>Spanduk</option>
// //                           <option value={media== 'brosur'? media:"brosur"}>Brosur</option>
// //                           <option value={media== 'instagram'? media:"instagram"}>Instagram </option>
// //                           <option value={media== 'facebook'? media:"facebook"}>Facebook </option>
// //                           <option value={media== 'youtube'? media:"youtube"}>Youtube </option>
// //                           <option value={media== 'majalah'? media: "majalah"}>Majalah </option>
// //                           <option value={media== 'whatsapp'? media:"whatsapp"}>WhatsApp</option>
// //                           <option value={media== 'tiktok'? media:"tiktok"}>Tiktok</option>
// //                           <option value={media== 'mesin_pencari'? media:"mesin_pencari"}>Rekomendasi mesin pencarian internet</option> */}

// //                           </select>
// //                           {errors.school_id && (
// //                             <p className="text-xs text-red-500"> {errors.school_id.message} </p>
// //                           )}
// //                 {/* <FormControlLabel
// //                     {...register('full_name')}
// //                     label="Nama Lengkap"
// //                     helperText={errors.full_name?.message}
// //                     error={!!errors.full_name}
// //                     control={<TextField/>}
// //                     >
                    
// //                 </FormControlLabel> */}
                
// //                     {/* <InputText type="text" defaultValue={admissionSchool.full_name} register={register} registerName='full_name' error={errors.full_name} error_msg={errors?.full_name?.message} updateType="full_name" containerStyle="mt-4" labelTitle="Nama Lengkap" updateFormValue={updateFormValue}/> */}
// //                 {/* <FormControlLabel
// //                     {...register('phone_number')}
// //                     label="No. Telepon"
// //                     helperText={errors.phone_number?.message}
// //                     error={!!errors.phone_number}
// //                     control={<TextField/>}
// //                     >
                    
// //                 </FormControlLabel> */}
// //                     {/* <InputText type="text" defaultValue={admissionSchool.ge} register={register} registerName={'full_name'} error={errors.full_name} error_msg={errors?.full_name?.message} updateType="full_name" containerStyle="mt-4" labelTitle="Nama Lengkap" updateFormValue={updateFormValue}/> */}
// //                 {/* <FormControlLabel
// //                     {...register('regist_number')}
// //                     label="No. Pendaftaran"
// //                     helperText={errors.regist_number?.message}
// //                     error={!!errors.regist_number}
// //                     control={<TextField/>}
// //             // <InputText type="text" defaultValue={admissionSchool.full_name} register={register} registerName={'full_name'} error={errors.full_name} error_msg={errors?.full_name?.message} updateType="full_name" containerStyle="mt-4" labelTitle="Nama Lengkap" updateFormValue={updateFormValue}/>
// //                 >
                    
// //                 </FormControlLabel> */}
// //                 {/* <FormControlLabel
// //                     {...register('gender')}
// //                     label="Jenis Kelamin"
// //                     helperText={errors.gender?.message}
// //                     error={!!errors.gender}
// //                     control={<Radio/>}
// //             // <InputText type="text" defaultValue={admissionSchool.full_name} register={register} registerName={'full_name'} error={errors.full_name} error_msg={errors?.full_name?.message} updateType="full_name" containerStyle="mt-4" labelTitle="Nama Lengkap" updateFormValue={updateFormValue}/>
// //                 >
                    
// //                 </FormControlLabel> */}
// //                 {/* <FormControlLabel
// //                     {...register('password')}
// //                     label="Password"
// //                     helperText={errors.password?.message}
// //                     error={!!errors.password}
// //                     control={<TextField/>}
// //             // <InputText type="text" defaultValue={admissionSchool.full_name} register={register} registerName={'full_name'} error={errors.full_name} error_msg={errors?.full_name?.message} updateType="full_name" containerStyle="mt-4" labelTitle="Nama Lengkap" updateFormValue={updateFormValue}/>
// //                 >
                    
// //                 </FormControlLabel> */}
// //                 {/* <FormControlLabel
// //                     {...register('media')}
// //                     label="Media"
// //                     helperText={errors.media?.message}
// //                     error={!!errors.media}
// //                     control={<Select/>}
// //             // <InputText type="text" defaultValue={admissionSchool.full_name} register={register} registerName={'full_name'} error={errors.full_name} error_msg={errors?.full_name?.message} updateType="full_name" containerStyle="mt-4" labelTitle="Nama Lengkap" updateFormValue={updateFormValue}/>
// //                 >
                    
// //                 </FormControlLabel> */}

// //                 <div className="border-b bg-gray-400"></div>

// //                 {/* <InputText type="text" defaultValue={admissionSchool.regist_number} register={register} registerName='regist_number' error={errors.regist_number} error_msg={errors?.regist_number?.message} updateType="regist_number" containerStyle="mt-4" labelTitle="No. Registrasi" _disabled={true} updateFormValue={updateFormValue}/>
// //                 <InputText type="text" defaultValue={admissionSchool.phone_number} register={register} registerName='phone_number' error={errors.phone_number} error_msg={errors?.phone_number?.message} updateType="phone_number" containerStyle="mt-4" labelTitle="No. WA." updateFormValue={updateFormValue}/>
// //                 <InputText type="text" defaultValue={admissionSchool.email} register={register} registerName='email' error={errors.email} error_msg={errors?.email?.message} updateType="email" containerStyle="mt-4" labelTitle="Email" updateFormValue={updateFormValue}/>
// //                 <InputTextRadio labelTitle="Jenis Kelamin" updateType="gender" type="radio" options={genderOptions} defaultValue={admissionSchool.gender} register={register} registerName='gender' error={errors.gender} error_msg={errors.gender?.message} updateFormValue={updateFormValue}/>
// //                 <InputText type="password" defaultValue="" updateType="password" containerStyle="mt-4" labelTitle="Password" register={register} registerName='password' error={errors.password} error_msg={errors.password?.message} updateFormValue={updateFormValue}/>
// //                 <SelectBox 
// //                     labelTitle="Pilihan Jenjang"
// //                     options={schoolOptions}
// //                     placeholder="Pilih Jenjang"
// //                     containerStyle="w-72"
// //                     nameInput="school_id"
// //                     updateType="school_id"
// //                     // labelStyle="hidden"
// //                     defaultValue={applicantSchool.school_id}
// //                     register={register}
// //                     registerName='school_id'
// //                     error={errors.school_id}
// //                     error_msg={errors?.school_id?.message}
// //                     updateFormValue={updateFormValue}
// //                 />
// //                 <SelectBox 
// //                     labelTitle="Media Informasi PSB"
// //                     options={mediaOptions}
// //                     placeholder="Pilih Media"
// //                     containerStyle="w-72"
// //                     nameInput="media"
// //                     updateType="media"
// //                     // labelStyle="hidden"
// //                     defaultValue={admissionSchool.media}
// //                     register={register}
// //                     registerName='media'
// //                     isRequired={false}
// //                     error={errors.media}
// //                     error_msg={errors?.media?.message}
// //                     updateFormValue={updateFormValue}
// //                 /> */}
// //                 {/* <InputText type="me" defaultValue="" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/> */}
// //                 {/* <InputText type="text" defaultValue={admissionSchool.email} updateType="last_login" containerStyle="mt-4" labelTitle="Email" updateFormValue={updateFormValue}/> */}
// //                 {/* <InputDateTimePicker labelTitle="Waktu Mulai" updateType="started_at" defaultValue={admissionSchool.started_at} nameInput="started_at"  updateFormValue={updateFormValue} containerStyle="z-999"/>

// //                 <InputDateTimePicker labelTitle="Waktu Selesai" updateType="ended_at" nameInput="ended_at" defaultValue={admissionSchool.ended_at} updateFormValue={updateFormValue} containerStyle="z-999"/> */}



// //                 {/* <InputText type="number" defaultValue={admissionSchool.admission_fee} updateType="admission_fee" containerStyle="mt-4" labelTitle="Biaya Masuk" updateFormValue={updateFormValue}/>

// //                 <ToogleInput labelTitle="Status Pendaftaran" updateType="admission_status" nameInput="admission_status" defaultValue={admissionSchool.status} containerStyle="flex flex-grow justify-between item-center mt-5" updateFormValue={updateFormValue}/> */}

// //                 <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

// //                 <div className="modal-action">
// //                     <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
// //                     <button  className="btn btn-primary bg-green-500 text-gray-100 hover:bg-green-400 hover:text-gray-50 border-none px-6" 
// //                         // onClick={handleSubmit(onSubmit)}
// //                     >
// //                         Simpan
// //                         </button>
// //                     {/* onClick={() => saveAdmissionSchool()} */}
// //                 </div>
// //             </form>
// //         </>
// //     )
// // }

// // export default EditAdmissionSchoolApplicantModalBody

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../../components/Input/InputText';
import InputTextRadio from '../../../../components/Input/InputTextRadio';
import ErrorText from '../../../../components/Typography/ErrorText';
import SelectBox from "../../../../components/Input/SelectBox";
import {TbEyeOff, TbEye} from 'react-icons/tb';
import { showNotification } from "../../../common/headerSlice";
import { updateApplicant } from "../../../../services/api/admissions_applicants";
import supabase from "../../../../services/database-server";
// import { useApplicants } from "../../../../hooks/use-applicants";

function EditAdmissionSchoolApplicantModalBody({closeModal, extraObject}){
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const [admissionSchool, setAdmissionSchool] = useState({
        full_name: "",
        gender: "",
        phone_number: "",
        email: "",
        regist_number: "",
        media: "",
        school_id: "",
        subschool: ""
    });
    const [school_id, setSchoolId] = useState(0)
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [schoolOptions, setSchoolOptions] = useState([]);
    //     const {onSubmit, results, form,} = useApplicants()
    // const {handleSubmit, register, formState: {errors}} = form
    
    const genderOptions = [
        {label: "Laki-Laki", value: "male"},
        {label: "Perempuan", value: "female"}
    ];
    
    const mediaOptions = [
        {label: "Website", value: "website"},
        {label: "Teman / Saudara", value: "teman/saudara"},
        {label: "Karyawan/Guru", value: "karyawan/guru"},
        {label: "Kajian", value: "kajian"},
        {label: "Spanduk", value: "spanduk"},
        {label: "Brosur", value: "brosur"},
        {label: "Instagram", value: "instagram"},
        {label: "Facebook", value: "facebook"},
        {label: "Youtube", value: "youtube"},
        {label: "Tiktok", value: "tiktok"},
        {label: "Mesin Pencari", value: "mesin_pencari"}
    ];
    
    const {index, sch_id, appl_id} = extraObject;    

    useEffect(() => {
        getSchoolsOptions();
        if (appl_id) {
            getAdmissionSchool(index, sch_id, appl_id);
        }
    }, [index, sch_id, appl_id]);

    const getAdmissionSchool = async (index, sch_id, appl_id) => {
        try {
            setLoading(true);
            const { data: admission_schools, error } = await supabase
                .from('applicants')
                .select("*, applicant_schools!inner(*)")
                .eq('applicant_schools.school_id', sch_id)
                .eq('applicant_schools.admission_ays_id', index)
                .eq('id', appl_id)
                .is('deleted_at', null);
            
            if (admission_schools && admission_schools[0]) {
                const applicantData = admission_schools[0];
                setAdmissionSchool({
                    full_name: applicantData.full_name || "",
                    gender: applicantData.gender || "",
                    phone_number: applicantData.phone_number || "",
                    email: applicantData.email || "",
                    media: applicantData.media || "",
                    password: applicantData.password || "",
                    school_id: applicantData.applicant_schools[0]?.school_id || "",
                    subschool: applicantData.applicant_schools[0]?.subschool || "",
                    regist_number: applicantData.regist_number || ""
                });
            } else {
                console.error("Error fetching applicant:", error);
                dispatch(showNotification({message: "Gagal memuat data pendaftar", status: 0}));
            }
        } catch (error) {
            console.error("Error:", error);
            dispatch(showNotification({message: "Terjadi kesalahan saat memuat data", status: 0}));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setAdmissionSchool(prev => ({
            ...prev,
            [field]: value
        }));

        console.log(field, value)
        if(field!='school_id' && admissionSchool.school_id) {
            admissionSchool.school_id = 0
        }
        console.log(admissionSchool.school_id)
    };

    const handledVisible = () => {
        setIsVisible(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {

            if(password){
                setAdmissionSchool({...admissionSchool, password: password})
                // setAdmissionSchool(prev => {...prev, password: password})
                admissionSchool.password = password
            }

            if(school_id == 0){
                admissionSchool.school_id= 0
            }
            
            const response = await updateApplicant({
                applicant: admissionSchool, 
                id: appl_id,
                password: password?password:""
            });
            
            if (response.error) {
                dispatch(showNotification({message: "Gagal Memperbarui data Pendaftar!", status: 0}));
            } else {
                dispatch(showNotification({message: "Berhasil Memperbarui data Pendaftar!", status: 1}));
                closeModal();
            }
        } catch (error) {
            console.error("Error updating applicant:", error);
            dispatch(showNotification({message: "Terjadi kesalahan saat memperbarui data", status: 0}));
        } finally {
            setLoading(false);
        }
    };

    const getSchoolsOptions = async () => {
        try {
            const { data: schools, error } = await supabase
                .from('schools')
                .select('*');
                
            if (!error) {
                setSchoolOptions(schools.map(school => ({
                    value: school.school_id,
                    label: school.school_name
                })));
            } else {
                console.error("Error fetching schools:", error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading && !admissionSchool.full_name) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
                <span className="ml-2">Memuat data...</span>
            </div>
        );
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text" 
                            value={admissionSchool.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            No. Registrasi
                        </label>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text" 
                            value={admissionSchool.regist_number}
                            onChange={(e) => handleInputChange('regist_number', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jenis Kelamin
                        </label>
                        <div className="flex space-x-4">
                            {genderOptions.map(option => (
                                <label key={option.value} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={option.value}
                                        checked={admissionSchool.gender === option.value}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="mr-2"
                                        required
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            No. Telepon
                        </label>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text" 
                            value={admissionSchool.phone_number}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="email" 
                            value={admissionSchool.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kelas (Khusus TKIT)
                        </label>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={admissionSchool.subschool}
                            onChange={(e) => handleInputChange('subschool', e.target.value)}
                            placeholder="Masukkan kelas"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password (Kosongkan jika tidak ingin mengubah)
                        </label>
                        <div className="flex">
                            <input 
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type={isVisible ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password baru"
                            />
                            <button 
                                type="button" 
                                onClick={handledVisible} 
                                className="ml-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                {isVisible ? <TbEyeOff size={20} /> : <TbEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Media
                        </label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={admissionSchool.media}
                            onChange={(e) => handleInputChange('media', e.target.value)}
                            required
                        >
                            <option value="">-Pilih Media-</option>
                            {mediaOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jenjang
                        </label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={admissionSchool.school_id}
                            onChange={(e) => (handleInputChange('school_id', e.target.value), setSchoolId(e.target.value))}
                            required
                        >
                            <option value="">-Pilih Jenjang-</option>
                            {schoolOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

                    <div className="modal-action mt-6">
                        <button 
                            type="button" 
                            className="btn btn-ghost" 
                            onClick={closeModal}
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary bg-green-500 text-white hover:bg-green-600 border-none px-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditAdmissionSchoolApplicantModalBody;