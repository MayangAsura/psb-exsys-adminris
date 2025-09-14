import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import { use } from "react"
import supabase from '../services/database-server'

const checkAuth = () => {
/*  Getting token value stored in localstorage, if token is not present we will open login page 
    for all internal dashboard routes  */
    const PUBLIC_ROUTES = ["ad/login", "ad/forgot-password", "ad/register", "ad/documentation"]
    
    const { subscription: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const jwt = jwtDecode(session.access_token)
        const userRole = jwt.user_role

        console.log('jwt', jwt, userRole)
        // setSession(session)

        const TOKEN = localStorage.setItem("token", session.access_token)

        // localStorage.setItem("token", )
        // localStorage.setItem("token-refresh", data.refresh_token)
        // setLoading(false)
        // window.location.href = '/ad/dashboard'
        
      }
    })
    const TOKEN = localStorage.getItem('token')
    const isPublicPage = PUBLIC_ROUTES.some( r => window.location.href.includes(r))
    


    if(!TOKEN && !isPublicPage){
      console.log('masuk')
        window.location.href = 'ad/login'
        return;
    }else{
      console.log('masuk_')
        axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`

        axios.interceptors.request.use(function (config) {
            // UPDATE: Add this code to show global loading indicator
            document.body.classList.add('loading-indicator');
            return config
          }, function (error) {
            return Promise.reject(error);
          });
          
          axios.interceptors.response.use(function (response) {
            // UPDATE: Add this code to hide global loading indicator
            document.body.classList.remove('loading-indicator');
            return response;
          }, function (error) {
            document.body.classList.remove('loading-indicator');
            return Promise.reject(error);
          });
        return TOKEN
    }

}

export default checkAuth