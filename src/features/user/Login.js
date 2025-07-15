import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'

function Login(){

    const INITIAL_LOGIN_OBJ = {
        password : "",
        username : "",
        role : "admin"
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = async (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(loginObj.username.trim() === "")return setErrorMessage("Email Id is required! (use any value)")
        if(loginObj.password.trim() === "")return setErrorMessage("Password is required! (use any value)")
        else{
            setLoading(true)
            // Call API to check user credentials and save token in localstorage
            // const handledSubmit = async (e) => {

    // e.preventDefault()
    // console.log("Data submit >", username)
    // console.log("Data submit >", password)
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
            localStorage.setItem("token", "DumyTokenHere")
            setLoading(false)
            window.location.href = '/ad/welcome'
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
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

                            <InputText type="username" defaultValue={loginObj.username} updateType="username" containerStyle="mt-4" labelTitle="Username" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        <div className='text-right text-black'><Link to="/ad/forgot-password"><span className="text-sm  inline-block  hover:text-green-300 hover:underline hover:cursor-pointer transition duration-200">Lupa Password?</span></Link>
                        </div>

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