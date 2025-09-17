    

import React, { createContext, useState, useEffect, act } from 'react';
// import axios from '../../services/api/local-server'
import axios from '../../services/api/prod-server'
import supabase from '../../services/database-server';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

    export const AuthContext = createContext(null);
    

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
    
    //   const { subscription: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    //         if (session) {
    //             const jwt = jwtDecode(session.access_token)
    //             const userRole = jwt.user_role

    //             console.log('jwt', jwt, userRole)
    //             // setSession(session)

    //             localStorage.setItem("token", session.access_token)

    //             const TOKEN = localStorage.getItem("token")

    //             console.log('masuk_',TOKEN, session.access_token)
    //             if(TOKEN){

    //             axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
        
    //             axios.interceptors.request.use(function (config) {
    //                 // UPDATE: Add this code to show global loading indicator
    //                 document.body.classList.add('loading-indicator');
    //                 return config
    //                 }, function (error) {
    //                 return Promise.reject(error);
    //                 });
                    
    //                 axios.interceptors.response.use(function (response) {
    //                 // UPDATE: Add this code to hide global loading indicator
    //                 document.body.classList.remove('loading-indicator');
    //                 return response;
    //                 }, function (error) {
    //                 document.body.classList.remove('loading-indicator');
    //                 return Promise.reject(error);
    //                 });
    //             return TOKEN
    //             }
    //             // localStorage.setItem("token", )
    //             // localStorage.setItem("token-refresh", data.refresh_token)
    //             // setLoading(false)
    //             // window.location.href = '/ad/dashboard'
                
    //         }else{
    //             return
    //         }
    //         })

    useEffect(() => {

        const { data: activeSession } = supabase.auth.getSession()
        if(activeSession){
            const { data: user } = supabase.auth.getUser()
            if(user){
                setUser(user)
                setLoading(false)
            }
        }
    },[])
    //   useEffect(() => {
    //     // Check for existing token in localStorage/sessionStorage on mount
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //       // Validate token with backend if necessary or decode JWT to get user info
    //         validateLogin(token).finally(() => setLoading(false));

    //             // setUser(profile);
    //             console.log('user from context', user)
    //         //     }
    //         }else{
    //             setLoading(false)
    //         }
            
    //   }, []);

      const validateLogin = async (token) => {
        // console
        const decodedToken = jwtDecode(token)
        if(decodedToken.username){
        const {data: applicants, error1} = await supabase.from('applicants')
                                        .select('*')
                                        // .eq('refresh_token', token)
                                        .eq('phone_number', decodedToken.username)
                                        .is('deleted_at', null)
        if(applicants){

            const {data: profile, error} = await supabase.from('exam_profiles')
                                        .select('*')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         // .eq('refresh_token', token)
                                        .eq('phone_number', decodedToken.username)
                                        .is('deleted_at', null)
            if(profile && profile.length >0){
    
            const {data: profile1, error} = await supabase.from('exam_profiles')
                                        .update([
                                            {updated_at: new Date().toISOString(), refresh_token: token}
                                        ])
                                        // .eq('refresh_token', token)
                                        .eq('phone_number', decodedToken.username)
                                        .is('deleted_at', null)
                                        .select()
            if(profile1) {
                setUser(applicants[0])
                setLoading(true)
                // return true
            }
            }else{
                const {data: profile2, error} = await supabase.from('exam_profiles')
                .insert([{appl_id: applicants[0].id, phone_number:applicants[0].phone_number, regist_number: applicants[0].regist_number, full_name: applicants[0].full_name, refresh_token: applicants[0].refresh_token, completion_status: 'ongoing'  }])
                // .eq('refresh_token', token)
                // .eq('phone_number', decodedToken.username)
                // .is('deleted_at', null)
                .select()
                if(profile2){

                const { data, error } = await supabase
                    .from('exam_test_participants')
                    .insert([
                    { exam_test_id: 'ef98fdc4-c363-4f5e-a84d-f488ccfff00a', appl_id: profile2[0].appl_id, schedule_id: 'fc67ba46-699b-464b-af15-c7e2aa3ad5a6' },
                    ])
                    .select()

                    if(data){
                        setUser(applicants[0])
                        setLoading(true)
                        // return true
                    }
                }
            }
            // if(error)
            // return false
        }
        }

        // return false

    }

      const login = async ({username, password}) => {
        // Call backend API to authenticate
        // const response = await fetch('/api/login', { /* ... */ });
        try {
        const response = await axios.post("/api/auth/login", {username, password},
        {
            headers: {'Content-Type': 'application /json' }, withCredentials: true
        }
        );
                                                                                                              
        console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
        if(response.status==200){        
            
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
                    setUser(applicant)
                    // setLoading(false)
                    // openSuccessModal()
                    // navigate('/landing')
                }else{
                    // openErrorModal()
                }
            
                    
                }
                
                    
                }

            }

                // dispatch(logout())
                // Cookies.remove("jwt")
            

            if(response.status!=200){
                // setUsername()
                // openErrorModal()
            }
    
        } catch (error) {
    
            setLoading(false)
        }

        // const data = await response.json();
        // if (data.token) {
        //   localStorage.setItem('authToken', data.token);
        //   setUser(data.user);
        // }
      };

      const logout = async () => {
        try {
        const response = await axios.get("/api/auth/logout",
        {
            headers: {'Content-Type': 'application/json' }, withCredentials: true
        }
        );
        
        console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
        if(response.status==200 || response.status ==204){

            localStorage.removeItem('token-user');
            setUser(null);
        }
    }catch(error){

    }
      };

      return (
        <AuthContext.Provider value={{ user, loading }}>
          {children}
        </AuthContext.Provider>
      );
    };