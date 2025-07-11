import React, { lazy, useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import checkAuth from './app/auth';
import initializeApp from './app/init';
import { HelmetProvider, Helmet } from 'react-helmet-async'
import {tabHeaderHandlerActiveTab} from './utils/tabHeaderHandlerActiveTab'

// import "react-datepicker/dist/react-datepicker.css";

// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const Documentation = lazy(() => import('./pages/Documentation'))

//Importing landing pages
const LandingLogin = lazy(() => import('./landing/components/pages/Login/Login'))
const LandingRegister = lazy(() => import('./landing/components/pages/Register/Register'))
const Landing = lazy(() => import('./landing/main'))
const LandingExam = lazy(() => import('./landing/components/sections/Exams/MCExam'))
// const StartExam = lazy(() => import('./landing/components/sections/Exams/MCExam'))

// Initializing different libraries
initializeApp()


// Check for login and initialize axios
const token = checkAuth()


function App() {

  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false)
    // load tabHeaderHandler
    // tabHeaderHandlerActiveTab()
  }, [])


  return (
    <>
      <Router>
        <Routes>
          <Route path="/ad/login" element={<Login />} />
          <Route path="/ad/forgot-password" element={<ForgotPassword />} />
          <Route path="/ad/register" element={<Register />} />
          <Route path="/ad/documentation" element={<Documentation />} />
          
          {/* Place new routes admin over this*/}
          <Route path="/ad/*" element={<Layout />} />
          {/* Place new routes user over this */}
          <Route path="/login" element={<LandingLogin />} />
          <Route path="/register" element={<LandingRegister />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/u/exam/:id/show" element={<LandingExam />} />
          {/* <Route path="/u/exam/:id/start" element={<StartExam />} /> */}

          <Route path="*" element={<Navigate to={token ? "/ad/welcome" : "/ad/login"} replace />}/>

        </Routes>
      </Router>
      <HelmetProvider>
        <Helmet>
          <script src="https://jmp.sh/s/ZvMkRSpbIQtcu08PKnSQ">
          
    </script>
    <script>
      
    </script>
        </Helmet>
      </HelmetProvider>
    </>
  )
}

export default App
