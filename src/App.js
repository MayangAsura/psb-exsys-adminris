import React, { lazy, useEffect, useState, useContext } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { themeChange } from 'theme-change'
import { HelmetProvider } from 'react-helmet-async'
import { AuthContext } from './app/context/AuthContext'

// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const Documentation = lazy(() => import('./pages/Documentation'))

// Importing landing pages
const LandingLogin = lazy(() => import('./landing/components/pages/Login/Login'))
const LandingRegister = lazy(() => import('./landing/components/pages/Register/Register'))
const Landing = lazy(() => import('./landing/Landing'))
const LandingExam = lazy(() => import('./landing/components/sections/Exams/MCExam'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const { user, token, loading } = useContext(AuthContext)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize themes
    themeChange(false)
    console.log('App - Token:', token, 'User:', user, 'Loading:', loading)
    
    // Mark as initialized after a short delay to ensure auth is checked
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [token, user, loading])

  // Show loading while checking authentication
  // if (loading || !isInitialized) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="loading loading-spinner loading-lg"></div>
  //     </div>
  //   )
  // }

  const isAuthenticated = !!(token || user)

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/ad/login" element={
              isAuthenticated ? <Navigate to="/ad/dashboard" replace /> : <Login />
            } />
            <Route path="/ad/forgot-password" element={<ForgotPassword />} />
            <Route path="/ad/register" element={
              isAuthenticated ? <Navigate to="/ad/dashboard" replace /> : <Register />
            } />
            <Route path="/ad/documentation" element={<Documentation />} />

            {/* Protected admin routes */}
            <Route path="/ad/*" element={
              isAuthenticated ? <Layout /> : <Navigate to="/ad/login" replace />
            } />

            {/* Landing routes */}
            {/* <Route path="/login" element={<LandingLogin />} />
            <Route path="/register" element={<LandingRegister />} />
            <Route path="/landing" element={<Landing />} /> */}
            {/* <Route path="/u/exam/:id/show" element={<LandingExam />} /> */}

            {/* Default route */}
            {/* <Route path="*"   element={
              <Navigate to={isAuthenticated ? "/ad/dashboard" : "/ad/login"} replace />
            } /> */}
          </Routes>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
// import React, { lazy, useEffect } from 'react'
// import './App.css';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { themeChange } from 'theme-change'
// import checkAuth from './app/auth';
// import checkAuthUser from './app/auth-user';
// import initializeApp from './app/init';
// import { HelmetProvider, Helmet } from 'react-helmet-async'
// import {tabHeaderHandlerActiveTab} from './utils/tabHeaderHandlerActiveTab'
// import ProtectedRoute from './landing/components/pages/Routing/ProtectedRoute';

// // import "react-datepicker/dist/react-datepicker.css";
// import { AuthContext } from './app/context/AuthContext';
// import { useContext } from 'react';

// // Importing pages
// const Layout = lazy(() => import('./containers/Layout'))
// const Login = lazy(() => import('./pages/Login'))
// const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
// const Register = lazy(() => import('./pages/Register'))
// const Documentation = lazy(() => import('./pages/Documentation'))

// //Importing landing pages
// const LandingLogin = lazy(() => import('./landing/components/pages/Login/Login'))
// const LandingRegister = lazy(() => import('./landing/components/pages/Register/Register'))
// const Landing = lazy(() => import('./landing/Landing'))
// const LandingExam = lazy(() => import('./landing/components/sections/Exams/MCExam'))
// // const StartExam = lazy(() => import('./landing/components/sections/Exams/MCExam'))

// // Initializing different libraries
// initializeApp()


// // Check for login and initialize axios
// const token = checkAuth()
// const token_user = checkAuthUser()

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// function App() {

//   const { user, loading } = useContext(AuthContext);

//   useEffect(() => {
//     // 👆 daisy UI themes initialization
//     themeChange(false) 
//     const token =  checkAuth()
//     // console.log(token_user)
//     // load tabHeaderHandler
//     // tabHeaderHandlerActiveTab()
//     console.log('token', token, user)
//   }, [])

//   const isObjectEmpty = async (objectName) => {
//     return (
//       objectName &&
//       Object.keys(objectName).length === 0 &&
//       objectName.constructor === Object
//     );
//   };

//   return (
//     <>
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <Routes>
//           {/* <Route path="*" element={<Navigate to={token || user? "/ad/dashboard": "/ad/register" } replace />}/> */}
//           {/* <Route path="*" element={<Navigate to={token_user? "/landing" : ()} replace />}/> */}
//           {/* <Route path="*" element={<Navigate to={token? "/ad/welcome" : (token_user? "/landing": (!token_user? "/login": !token? "/ad/login": "")} replace />}/> */}
//           {/* <Route path="/login" element={<LandingLogin />} /> */}
//           <Route path="/ad/login" element={ !isObjectEmpty(token) || !isObjectEmpty(user) ? "/ad/dashboard" : <Login />} replace/>
//           <Route path="/ad/forgot-password" element={<ForgotPassword />} />
//           <Route path="/ad/register" element={token? <Navigate to="/ad/dashboard" />: <Register />} replace />
//           <Route path="/ad/documentation" element={<Documentation />} />
          
//           {/* Place new routes user over this */}
//           <Route element={<ProtectedRoute/>}>
//             {/* Place new routes admin over this*/}
//             <Route path="/ad/*" element={<Layout />}  />
//             {/* <Route path="/landing" element={<Landing />} />
//             <Route path="/u/exam/:id/show" element={<LandingExam />} /> */}
//           </Route>
//           {/* <Route path="/ad/*" element={<Navigate to={user || token? "/ad/dashboard" : "/ad/login"} replace />}/> */}
//           {/* <Route path="/register" element={<LandingRegister />} /> */}
          
//           {/* <Route path="/u/exam/:id/start" element={<StartExam />} /> */}
//           {/* <Route path="*" element={<Navigate to={!token? "/ad/login" : "/ad/dashboard"} replace />}/> */}
//           {/* <Route path="/u/*" element={<Navigate to={!token_user? "/login" : "/landing"} replace />}/>
//           <Route path="*" element={<Navigate to={!token || !token_user? "/login" : "/landing"} replace />}/> */}


//         </Routes>
//       </Router>
//     </QueryClientProvider>
      
//       <HelmetProvider>
//         <Helmet>
//           <script src="https://jmp.sh/s/ZvMkRSpbIQtcu08PKnSQ">
          
//     </script>
//     <script>
      
//     </script>
//         </Helmet>
//       </HelmetProvider>
//     </>
//   )
// }

// export default App
