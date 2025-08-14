import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'

import supabase from '../../services/database-server'
import { AuthWeakPasswordError } from '@supabase/supabase-js'

function Register(){

    const INITIAL_REGISTER_OBJ = {
        username : "",
        password : "",
        // emailId : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const submitForm = async (e) =>{
        e.preventDefault()
        setErrorMessage("")

        // if(registerObj.name.trim() === "")return setErrorMessage("Name is required! (use any value)")
        if(registerObj.username.trim() === "")return setErrorMessage("Username is required! (use any value)")
        if(registerObj.password.trim() === "")return setErrorMessage("Password is required! (use any value)")
        else{
            setLoading(true)

            const _username = '+62' + registerObj.username.slice(1)
            const { data, error } = await supabase.auth.signUp({
                phone: _username,
                password: registerObj.password,
                options: {
                    channel: 'sms'
                }
            })
            
            console.log('data', registerObj)
            if(error){
                console.log('data', error, new AuthWeakPasswordError)
                if(error.code == 'user_already_exists'){
                    setErrorMessage('Pengguna sudah ada')          
                }else{
                    setErrorMessage(error.message)
                }
                setLoading(false)
            }else{
                console.log('data', data)
                // const { data: exam_users, error } = await supabase
                // .from('exam_users')
                // .insert([
                //     {   full_name: registerObj.full_name,
                //         phone_number: registerObj.username, provider : 'phone', 
                //         phone_verified: data.user.user_metadata.phone_verified,
                //         user_id: data.user.id,
                //         refresh_token: data.session.refresh_token, expired_at: new Date(data.session.expires_at).toISOString(), expired_in: data.session.expires_in,
                //         last_sign_in: data.session.last_sign_in_at

                //         // created_at timestamp with time zone not null default now()
                //     },
                // ])
                // .select()
                // .single()

                // if(error){
                //     setErrorMessage("Registrasi Gagal")
                // }else{
                //     console.log(exam_users)
                //     const { data: user_roles, error } = await supabase
                //     .from('user_roles')
                //     .insert([
                //         {   user_id: data.user.id,
                //             role: 'admin',
                //             user_profile_id: data.id
                //             // full_name: registerObj.full_name,
                //             // phone_number: registerObj.username, provider : 'phone', 
                //             // phone_verified: data.user.user_metadata.phone_verified,
                            
                //             // refresh_token: data.session.refresh_token, expired_at: new Date(data.session.expired_at), expired_in: data.session.expired_in,
                //             // last_sign_in: data.session.last_sign_in_at

                //             // created_at timestamp with time zone not null default now()
                //         },
                //     ])
                //     .select()

                //     if(error){
                //         setErrorMessage("Registrasi Gagal")
                //     }else{
                        // setLoading(true)
                        // Call API to check user credentials and save token in localstorage
                        localStorage.setItem("token", data.session.access_token)
                        localStorage.setItem("token-refresh", data.session.refresh_token)
                        setLoading(false)
                        window.location.href = '/ad/dashboard'
                //     }
                // }
            }


        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setRegisterObj(prev => ({...prev, [updateType] : value}))
        // setRegisterObj({...registerObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Daftar Akun Admin</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            {/* <InputText defaultValue={registerObj.name} updateType="name" containerStyle="mt-4" labelTitle="Name" updateFormValue={updateFormValue}/> */}

                            <InputText defaultValue={registerObj.username} updateType="username" containerStyle="mt-4" labelTitle="No. WhatsApp" placeholder="08123456789" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={registerObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary bg-green-700 hover:bg-green-500 hover:text-gray-100 border-0" + (loading ? " loading" : "")}>Daftar</button>

                        <div className='text-center mt-4'>Sudah punya akun? <Link to="/ad/login"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Register