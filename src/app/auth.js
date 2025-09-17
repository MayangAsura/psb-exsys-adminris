import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import supabase from '../services/database-server'

const checkAuth = async () => {
/*  Getting token value stored in localstorage, if token is not present we will open login page 
    for all internal dashboard routes  */
    const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/documentation"]
    
    const { subscription: authListener } = await supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const jwt = jwtDecode(session.access_token)
        const userRole = jwt.user_role

        console.log('jwt', jwt, userRole)
        // setSession(session)

        localStorage.setItem("token", session.access_token)

        const TOKEN = localStorage.getItem("token")

        console.log('masuk_',TOKEN, session.access_token)
        if(TOKEN){

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
        // localStorage.setItem("token", )
        // localStorage.setItem("token-refresh", data.refresh_token)
        // setLoading(false)
        // window.location.href = '/ad/dashboard'
        
      }else{
        return
      }
    })
    const TOKEN = localStorage.getItem('token')
    const isPublicPage = PUBLIC_ROUTES.some( r => window.location.href.includes(r))
    


    // if(!TOKEN && !isPublicPage){
    //   console.log('masuk')
    //     // window.location.href = '/ad/dashboard'
    //     // return;
    // }else{
      
    // }

}

export default checkAuth