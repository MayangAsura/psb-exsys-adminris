
import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ModalLayout from "../../../../containers/ModalLayout"
import Header from "../../Header"
import Footer from "../../sections/Footer/Footer"
import { useDispatch, useSelector } from "react-redux"
import { userLogin } from "../../../../services/api/auth/client/authActions"
import { openModal } from "../../../../features/common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../../utils/globalConstantUtil'
import '../../../../index-user.css'

import axios from '../../../../services/api/local-server'
import supabase from "../../../../services/database-server"
// import logo from './logo.png'

import { TbEye, TbEyeOff } from "react-icons/tb";

const Login = () =>{
  
  // const {userInfo, userToken, errorMsg, userPayment, userSchool, userFormComplete, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const {setAuth} = useContext(AuthContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

  useEffect(() => {
    if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
    }
    getApplIp()
  },[])

  const handledVisible = () => {
    setIsVisible(prevState => !prevState)
  }
  const getApplIp = async () => {
    fetch('https://geolocation-db.com/json/')
      .then(response => response.json())
      .then(data => {
        setIp(data.IPv4)
        // setCountry(data.country_name)
        // setLatitude(data.latitude)
        // setLongitude(data.longitude)
      })
      .catch(error => console.log(error))
    // const res = await axios.get("https://api.ipify.org/?format=json");
    // console.log(res.data)
    // setIp(res.data.ip)
  }

  const handledSubmit = async (e) => {

    e.preventDefault()
    console.log("Data submit >", username)
    console.log("Data submit >", password)
    // setErrorMessage("")

    //     if(loginObj.emailId.trim() === "")return setErrorMessage("Email Id is required! (use any value)")
    //     if(loginObj.password.trim() === "")return setErrorMessage("Password is required! (use any value)")
        // else{
            // setLoading(true)
            // Call API to check user credentials and save token in localstorage
            // localStorage.setItem("token", "DumyTokenHere")
            // setLoading(false)
            // window.location.href = '/admin/welcome'
        // }
    const data = {
      username: username,
      password: password
    }
    
    try {

      setTimeout(() => {
        // dispatch(userLogin(data))

      }, 2000);
      // const handledLogout = async () => {
      try {
      const response = await axios.post("/api/auth/login", {username, password},
      {
        headers: {'Content-Type': 'application/json' }, withCredentials: true
      }
      );
      // 
      console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
      if(response.status==200){
        // dispatch(logout())
        // Cookies.remove("jwt")
        
        
        localStorage.setItem("token-user", response.data.token_refresh)
        console.log(response.data.token_refresh)

        const token = localStorage.getItem("token-user")
        console.log(token)
        if(token){
          const { data: applicant, error_app } = await supabase
          .from('applicants')
          .select('id, full_name')
          .eq('refresh_token', token)
          // .single()
          // , participants(participant_father_data(father_name), participant_mother_data(mother_name)), regist_number, phone_number 
          console.log('applicant', applicant)
      
          if(applicant){
          
            const { data, error } = await supabase
            .from('exam_profiles')
            .update({refresh_token: token, updated_at: new Date().toISOString()})
            // .insert({ appl_id:applicant.id, full_name: applicant.full_name, father_name: applicant.participants[0].participant_father_data[0].father_name, mother_name: applicant.participants[0].participant_mother_data[0].mother_name, ip: ip, last_login: new Date().toISOString(), regist_number: applicant.regist_number, phone_number: applicant.phone_number, refresh_token: response.data.token_refresh })
            .eq('appl_id', applicant[0].id)
            .select()
            console.log(data)
            if(!error){
              openSuccessModal()
              navigate('/landing')
            }else{
              openErrorModal()
            }
          
              
        }
          
              
        }
        

        // if(!error){
        //       openSuccessModal()
        //       navigate('/landing')
        //     }else{
        //       openErrorModal()
        //     }
          

      }
      

      if(response.status!=200){
        setUsername()
        openErrorModal()
      }
      
        } catch (error) {
          
        }
      
      

      // if(userInfo){

      // }
      // const response = await axios.post(LOGIN_URL,
      //   JSON.stringify({ username, password }),
      //   {
      //     headers: {'Content-Type': 'application/json' }, withCredentials: false
      //   }
      // );
      // // 
      // console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
      // const token = response?.token
      // // const roles = response?.data?.roles 
      // setAuth({username, password, token})
      // setUsername('');
      // setPassword('');
      // // success(true);
      // navigate('/pay')
      // const response = await axios.post("http://localhost:3000/auth/login", data)
      // login({                     
      //   auth: {
      //     token: response.data.token, 
      //     type: "Bearer"
      //   },
      //   expiresIn: 86400,
      //   // tokenType: "Bearer",
      //   userState: {username: username}
      // })
    } catch (error) {
      console.log("Error >", error )
      // modal_data.title = "Login Gagal"
      // modal_data.message = errorMsg

      openErrorModal()
      // if (error && error instanceof AxiosError){
  
      // }
    }

    // if(error){
    //       // modal_data.title = "Login Gagal"
    //       // modal_data.message = "Mohon Periksa kembali data yang dimasukkan."
    //       // modal_data.text = "OK"
    //       // modal_data.url = ""
    //       openErrorModal()
          
    //       // navigate('/home')
    //     }else{
    //       // modal_data.title = ""
    //       // modal_data.message = "Mohon Periksa kembali data yang dimasukkan."
    //       // modal_data.text = "OK"
    //       // modal_data.url = ""
          
    //       openSuccessModal()
    //     }

  } 

const openSuccessModal = () => {
  console.log('suc')
  dispatch(openModal({title : "Login Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
    extraObject : {message : "Redirecting..", type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_SUCCESS}
  }))
}
const openErrorModal = () => {
  console.log('masuk er')
  // const deleteCurrentSchedule = (index) => {
                // dispatch(openModal({title : "Login Gagal", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                // extraObject : { message : `Mohon periksa kembali data Anda.`, type : CONFIRMATION_MODAL_CLOSE_TYPES.SCHEDULE_DELETE}}))
                
        
    // }
  dispatch(openModal({title : "Login Gagal", bodyType : MODAL_BODY_TYPES.MODAL_ERROR,
    extraObject : {message : "Mohon periksa kembali username atau password Anda.", type: CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_ERROR}
  }))
}



  
return (
  <main className="min-w-lg min-h-screen bg-gray-50 background-pattern pb-10 relative max-w-lg min-w-screen my-0 mx-auto">
      <Header />
      {/* <ProfileCover /> */}
      <div className="container px-4">
        <div className="flex flex-wrap px-4 " >
          {/* style={{backgroundImage: `url('/logo.jpg')`}} */}
          {/* {modal_show && (
                <ModalLayout dataModal={modal_data}  />
                // setDestroy={setDestroy}  
              )} */}
        <section >
          {/* style={{'background':'url("./images/pattern.jpg")', 'opacity': '50%'}} */}
          {/* className="bg-gray-300 rounded-lg" */}
            <div className="px-8 py-20 mx-auto sm:px-4 flex flex-col justify-center items-center">
               {/* sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 */}
                <div className="flex flex-col justify-center items-center w-full px-4 pt-5 pb-6 mx-auto mt-8 mb-6 rounded-none shadow-xl sm:rounded-lg sm:px-6">
                  {/* bg-white  */}
                  <img src="/logo.png" alt="" width={30} className=" w-24 h-24 object-center my-3"/>
                <h1 className="text-lg font-semibold text-gray-900 text-center">Masuk Aplikasi</h1>
                {/* <h1 className="text-lg font-semibold text-center">Masuk Aplikasi</h1> */}
                <p className="text-gray-700 text-center mb-4">Aplikasi Ujian Penerimaan Santri Baru Rabbaanii Islamic School </p>
                {/* text-gray-400 */}
                <form className="mb-8 space-y-4" >
                    <label className="block">
                    <span className="block mb-1 text-xs font-medium text-gray-700">No. WhatsApp / No. Registrasi</span>
                    <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}  placeholder="" inputMode="" required />
                    {/* text-gray-800 */}
                    </label>
                    <span className="block mb-1 text-xs font-medium text-gray-700">Password</span>
                    <label className=" flex mb-4">
                    <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type={isVisible? "text" : "password"} name="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="••••••••" required />
                    <button type="button" onClick={handledVisible} 
                        className="flex justify-around items-center">
                          {isVisible? (
                            <TbEyeOff size={20} className='absolute mr-10'></TbEyeOff>
                          ):(
                            <TbEye size={20} className='absolute mr-10'></TbEye>
                          ) }
                          
                        </button>
                    </label>
                    <button className={"btn text-white bg-green-600 hover:bg-green-700 w-full my-4 " + + (loading ? " loading" : "")}
                              onClick={handledSubmit}
                      >MASUK</button>
                    {/* <input type="submit" className="w-full py-3 mt-1 btn btn-green-800" value="Masuk" /> */}
                </form>
                {/* <div className="space-y-8">
                    <div className="text-center border-b border-gray-200" style="line-height: 0px">
                    <span className="p-2 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-white" style="line-height: 0px">Or</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <a href="#" className="py-3 btn btn-icon btn-google">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                        <path
                            d="M20.283,10.356h-8.327v3.451h4.792c-0.446,2.193-2.313,3.453-4.792,3.453c-2.923,0-5.279-2.356-5.279-5.28 c0-2.923,2.356-5.279,5.279-5.279c1.259,0,2.397,0.447,3.29,1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233 c-4.954,0-8.934,3.979-8.934,8.934c0,4.955,3.979,8.934,8.934,8.934c4.467,0,8.529-3.249,8.529-8.934 C20.485,11.453,20.404,10.884,20.283,10.356z"
                        />
                        </svg>
                        <span className="sr-only">Continue with</span> Google
                    </a>
                    <a href="#" className="py-3 btn btn-icon btn-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                        <path
                            d="M19.665,16.811c-0.287,0.664-0.627,1.275-1.021,1.837c-0.537,0.767-0.978,1.297-1.316,1.592 c-0.525,0.482-1.089,0.73-1.692,0.744c-0.432,0-0.954-0.123-1.562-0.373c-0.61-0.249-1.17-0.371-1.683-0.371  c-0.537,0-1.113,0.122-1.73,0.371c-0.616,0.25-1.114,0.381-1.495,0.393c-0.577,0.025-1.154-0.229-1.729-0.764 c-0.367-0.32-0.826-0.87-1.377-1.648c-0.59-0.829-1.075-1.794-1.455-2.891c-0.407-1.187-0.611-2.335-0.611-3.447  c0-1.273,0.275-2.372,0.826-3.292c0.434-0.74,1.01-1.323,1.73-1.751C7.271,6.782,8.051,6.563,8.89,6.549  c0.46,0,1.063,0.142,1.81,0.422s1.227,0.422,1.436,0.422c0.158,0,0.689-0.167,1.593-0.498c0.853-0.307,1.573-0.434,2.163-0.384  c1.6,0.129,2.801,0.759,3.6,1.895c-1.43,0.867-2.137,2.08-2.123,3.637c0.012,1.213,0.453,2.222,1.317,3.023 c0.392,0.372,0.829,0.659,1.315,0.863C19.895,16.236,19.783,16.529,19.665,16.811L19.665,16.811z M15.998,2.38  c0,0.95-0.348,1.838-1.039,2.659c-0.836,0.976-1.846,1.541-2.941,1.452c-0.014-0.114-0.021-0.234-0.021-0.36  c0-0.913,0.396-1.889,1.103-2.688c0.352-0.404,0.8-0.741,1.343-1.009c0.542-0.264,1.054-0.41,1.536-0.435 C15.992,2.127,15.998,2.254,15.998,2.38L15.998,2.38z"
                        />
                        </svg>
                        <span className="sr-only">Continue with</span> Apple
                    </a>
                    </div>
                </div> */}
                </div>
                <div className="flex-none justify-center items-center">
                  <p className="flex flex-row mb-4 text-xs text-center text-gray-400">
                  {/* <a href="#" className="text-green-200 underline hover:text-white">Buat Akun</a>
                  · */}
                  <a href="#" className="text-green-500 underline hover:text-white">Reset Password </a>
                   · 
                  <a href="#" className="text-green-500 underline hover:text-white"> Privacy & Terms</a>
                  </p>
                </div>
            </div>
        </section>
          {/* <div className="w-full lg:w-1/3 ">
            <Profile />
          </div>
          <div className="w-full lg:w-2/3 ">
            <Exam />
            <Navbar />
          </div> */}
        </div>
      </div>
      <ModalLayout />
      <Footer />
    </main>
)


}

export default Login
