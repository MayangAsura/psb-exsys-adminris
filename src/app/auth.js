import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import supabase from '../services/database-server'

let authInitialized = false

const checkAuth = () => {
    // Return token from localStorage if exists (synchronous check)
    const token = localStorage.getItem("token")
    
    if (token) {
        // Set axios headers if token exists
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        axios.interceptors.request.use(function (config) {
            document.body.classList.add('loading-indicator')
            return config
        }, function (error) {
            return Promise.reject(error)
        })
        
        axios.interceptors.response.use(function (response) {
            document.body.classList.remove('loading-indicator')
            return response
        }, function (error) {
            document.body.classList.remove('loading-indicator')
            return Promise.reject(error)
        })
        
        return token
    }
    
    // Initialize auth listener only once
    if (!authInitialized) {
        authInitialized = true
        
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const jwt = jwtDecode(session.access_token)
                const userRole = jwt.user_role

                console.log('jwt', jwt, userRole)

                localStorage.setItem("token", session.access_token)
                
                // Set axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`
                
                // Configure interceptors
                axios.interceptors.request.use(function (config) {
                    document.body.classList.add('loading-indicator')
                    return config
                }, function (error) {
                    return Promise.reject(error)
                })
                
                axios.interceptors.response.use(function (response) {
                    document.body.classList.remove('loading-indicator')
                    return response
                }, function (error) {
                    document.body.classList.remove('loading-indicator')
                    return Promise.reject(error)
                })
            } else {
                // Clear token on logout
                localStorage.removeItem("token")
                delete axios.defaults.headers.common['Authorization']
            }
        })
    }
    
    return token || null
}

export default checkAuth
// import axios from "axios"
// import { jwtDecode } from 'jwt-decode'
// import supabase from '../services/database-server'

// const checkAuth = () => {
// /*  Getting token value stored in localstorage, if token is not present we will open login page 
//     for all internal dashboard routes  */
//     const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/documentation"]
    
//     const { subscription: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (session) {
//         const jwt = jwtDecode(session.access_token)
//         const userRole = jwt.user_role

//         console.log('jwt', jwt, userRole)
//         // setSession(session)

//         localStorage.setItem("token", session.access_token)

//         const TOKEN = localStorage.getItem("token")

//         console.log('masuk_',TOKEN, session.access_token)
//         if(TOKEN || session.access_token){

//           axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
  
//           axios.interceptors.request.use(function (config) {
//               // UPDATE: Add this code to show global loading indicator
//               document.body.classList.add('loading-indicator');
//               return config
//             }, function (error) {
//               return Promise.reject(error);
//             });
            
//             axios.interceptors.response.use(function (response) {
//               // UPDATE: Add this code to hide global loading indicator
//               document.body.classList.remove('loading-indicator');
//               return response;
//             }, function (error) {
//               document.body.classList.remove('loading-indicator');
//               return Promise.reject(error);
//             });
//             // console.log(TOKEN)
//           return TOKEN || session.access_token
//         }else{
//           return
//         }
//         // localStorage.setItem("token", )
//         // localStorage.setItem("token-refresh", data.refresh_token)
//         // setLoading(false)
//         // window.location.href = '/ad/dashboard'
        
//       }
//       // else{
//       //   return
//       // }
//     })

//     // console.log('authListener', authListener)
//     // const TOKEN = localStorage.getItem('token')
//     // const isPublicPage = PUBLIC_ROUTES.some( r => window.location.href.includes(r))
    
// // if(TOKEN){
// //   return TOKEN
// // }

//     // if(!TOKEN && !isPublicPage){
//     //   console.log('masuk')
//     //     // window.location.href = '/ad/dashboard'
//     //     // return;
//     // }else{
      
//     // }

// }

// export default checkAuth