import {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import { TbEye, TbEyeOff } from "react-icons/tb";

import supabase from '../../services/database-server'
import { AuthWeakPasswordError } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'
import { log } from 'async'

const INITIAL_LOGIN_OBJ = {
    password : "",
    username : "",
    role : "admin"
}
function Login(){


    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userLoaded, setUserLoaded] = useState(false)
    const [user, setUser] = useState("")
    const [session, setSession] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const navigate = useNavigate()

    useEffect(()=> {
        
    },[])

    const submitForm = async (e) =>{
        e.preventDefault()
        setErrorMessage("")
        console.log('inaut-')
        
    //     supabase.auth.getSession().then(({data: {session}})=> saveSession(session))
    //     const { subscription: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    //         console.log('masuk')
    //         console.log('obj',loginObj)
    //         console.log('se',session)

    //   if (session) {
    //     saveSession(session)
    //     const jwt = jwtDecode(session.access_token)
    //     const userRole = jwt.user_role

    //     console.log('jwt', jwt, userRole)
    //   }
    // })

    
        console.log('logn',loginObj)
        if(username.trim() === "")return setErrorMessage("Username tidak boleh kosong.")
        if(password.trim() === "")return setErrorMessage("Password tidak boleh kosong.")
        else{
            setLoading(true)
            // console.log(loginObj)
            const nUsername =  '62'+ username.slice(1)
            console.log(nUsername)
            
            const { data, error } = await supabase.auth.signInWithPassword({
                phone: nUsername,
                password: password,
            })

            if(error){
                
                    console.log('session', error, new AuthWeakPasswordError)
                    if(error.code == 'invalid_credentials'){
                        setErrorMessage('Username atau Password salah.')          
                    }else{
                        setErrorMessage(error.message)
                    }
                    setLoading(false)
            }else{

                setUser(data.user)
                setSession(data.session)
                console.log('data', data)
                console.log(user)
                console.log('session', data.user, data.session)
                // Call API to check user credentials and save token in localstorage
                localStorage.setItem("token", data.session.access_token??data.session?.access_token )
                localStorage.setItem("token-refresh", data.session.refresh_token)
                setLoading(false)
                window.location.href = '/ad/dashboard'
            // }
    
        console.log(data)
            }

            // if(data){
                // setLoading(true)
            // Call API to check user credentials and save token in localstorage
            // const handledSubmit = async (e) => {

    // e.preventDefault()
    // console.log("Data submit >", username)
    // console.log("Data submit >", password)
    // setErrorMessage("")

        // if(loginObj.emailId.trim() === "")return setErrorMessage("Email Id is required! (use any value)")
        // if(loginObj.password.trim() === "")return setErrorMessage("Password is required! (use any value)")
        // else{
        //     setLoading(true)
        //     // Call API to check user credentials and save token in localstorage
        //     localStorage.setItem("token", )
        //     setLoading(false)
        //     window.location.href = '/admin/welcome'
        // }
    // const data = {
    //   username: username,
    //   password: password
    // }
    
    // try {

    //   setTimeout(() => {
    //     // dispatch(userLogin(data))

    //   }, 2000);
    //   // const handledLogout = async () => {
    //   // try {
    //   const response = await axios.post("/api/auth/login", {username, password, role},
    //   {
    //     headers: {'Content-Type': 'application/json' }, withCredentials: true
    //   }
    //   );
    //   // 
    //   console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
    //   if(response.status==200){
    //     // dispatch(logout())
    //     // Cookies.remove("jwt")
    //     localStorage.setItem("token-user", response.data.token_refresh)
    //     console.log(response.data.token_refresh)
    //     const { data: applicant, error_app } = await supabase
    //       .from('applicants')
    //       .select('*')
    //       .eq('refresh_token', response.data.token_refresh)
    //       .single()
    //       console.log(applicant)
    //     const { data, error } = await supabase
    //       .from('exam_profiles')
    //       .update({ refresh_token: response.data.token_refresh })
    //       .eq('appl_id', applicant.id)
    //       .select()
          
    //     openSuccessModal()
    //     navigate('/landing')

    //   }

    //   if(response.status!=200){
    //     // setUsername()
    //     openErrorModal()
    //   }
      
    //   //   } catch (error) {
          
    //   //   }
    //   // }
      

    //   // if(userInfo){

    //   // }
    //   // const response = await axios.post(LOGIN_URL,
    //   //   JSON.stringify({ username, password }),
    //   //   {
    //   //     headers: {'Content-Type': 'application/json' }, withCredentials: false
    //   //   }
    //   // );
    //   // // 
    //   // console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
    //   // const token = response?.token
    //   // // const roles = response?.data?.roles 
    //   // setAuth({username, password, token})
    //   // setUsername('');
    //   // setPassword('');
    //   // // success(true);
    //   // navigate('/pay')
    //   // const response = await axios.post("http://localhost:3000/auth/login", data)
    //   // login({                     
    //   //   auth: {
    //   //     token: response.data.token, 
    //   //     type: "Bearer"
    //   //   },
    //   //   expiresIn: 86400,
    //   //   // tokenType: "Bearer",
    //   //   userState: {username: username}
    //   // })
    // } catch (error) {
    //   console.log("Error >", error )
    //   // modal_data.title = "Login Gagal"
    //   // modal_data.message = errorMsg

    //   openErrorModal()
    //   // if (error && error instanceof AxiosError){
  
    //   // }
    // }

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

//   }
            // localStorage.setItem("token", "DumyTokenHere")
            // setLoading(false)
            // window.location.href = '/ad/welcome'
        }
    }

    const handledVisible = () => {
    setIsVisible(prevState => !prevState)
  }

    const saveSession = (session) => {
        setSession(session)
        const currentUser = session?.user
        if(session){
            const jwt = jwtDecode(session.access_token)
            currentUser.appRole = jwt.user_role
        }
        setUser(currentUser ?? null)
        setUserLoaded(!!currentUser)
        if(currentUser){navigate("/login")}
    }


    const updateFormValue = ({updateType, value}) => {
        setLoginObj({...loginObj, [updateType] : value})
        // setErrorMessage("")
        // console.log(loginObj)
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center" >
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login Admin</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">
                        
                            {/* <InputText defaultValue={registerObj.name} updateType="name" containerStyle="mt-4" labelTitle="Name" updateFormValue={updateFormValue}/> */}

                            {/* <InputText defaultValue={username} updateType="username" containerStyle="mt-4" labelTitle="No. WhatsApp" placeholder="08123456789" /> */}

                            {/* <InputText defaultValue={password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" /> */}
                            <label className="block">
                            <span className="block mb-1 text-base font-medium text-gray-700">Username</span>
                            <input className="form-input w-full shadow appearance-none border rounded py-3 px-4 leading-tight focus:outline-none focus:shadow-outline" type="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}  placeholder="" inputMode="" required />
                            {/* text-gray-800 */}
                            </label>
                            <span className="block mb-1 mt-3 text-base font-medium text-gray-700">Password</span>
                            <label className=" flex mb-4">
                            <input className="form-input w-full shadow appearance-none border rounded py-3 px-4  focus:outline-none focus:shadow-outline" type={isVisible? "text" : "password"} name="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="••••••••" required />
                            <button type="button" onClick={handledVisible} 
                                className="flex justify-around items-center">
                                    {isVisible? (
                                    <TbEyeOff size={20} className='absolute mr-10'></TbEyeOff>
                                    ):(
                                    <TbEye size={20} className='absolute mr-10'></TbEye>
                                    ) }
                                    
                                </button>
                            </label>

                        </div>

                        {/* <div className='text-right text-black'><Link to="/ad/forgot-password"><span className="text-sm  inline-block  hover:text-green-300 hover:underline hover:cursor-pointer transition duration-200">Lupa Password?</span></Link> */}
                        {/* </div> */}

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full bg-green-500" + (loading ? " loading" : "")}>Login</button>

                        <div className='text-center mt-4'>Belum punya akun? <Link to="/ad/register"><span className="  inline-block  hover:text-green-300 hover:underline hover:cursor-pointer transition duration-200">Daftar</span></Link></div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Login