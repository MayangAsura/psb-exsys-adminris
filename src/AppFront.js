import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import 'aos/dist/aos.css';
import './css/style.css';
import {Helmet, HelmetProvider} from "react-helmet-async";

//redux
import {Provider } from 'react-redux'
import store from './app/store'

import AOS from 'aos';

// import Home from './pages/Home';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import ResetPassword from './pages/ResetPassword';
// import Payment from './pages/Payment';
// import Jenjang from './pages/Jenjang';
// import RedirectPayment from './pages/RedirectPayment';
import ProtectedRoute from './routing/ProtectedRoute';
// import NotFoundRoute from './routing/NotFoundRoute';
import Login from './landing/components/pages/Login/Login';
// import ForgotPassword from './features/user/ForgotPassword';

//Importing landing pages
const LandingLogin = lazy(() => import('./landing/components/pages/Login/Login'))
const LandingRegister = lazy(() => import('./landing/components/pages/Register/Register'))
const Landing = lazy(() => import('./landing/main'))
const LandingExam = lazy(() => import('./landing/components/sections/Exams/MCExam'))

// import RequireAuth from 'react-auth-kit'
// import {AuthProvider} from 'react-auth-kit'

function AppFront() {

  const location = useLocation();

  const allowed_codes = [
    'tkit-a',
    'tkit-b',
    'sdit',
    'smpi',
    'smai',
    'smp-pesantren',
    'rabbaanii-ciwidey'
  ]

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        {/* <Route exact path="/" element={<Jenjang />} /> */}
        {/* <Route exact path="/" element={<Landing />} /> */}
        
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/pay" element={<Payment />} />
          <Route path='/home' element={<Home/>}></Route>
          <Route path="/logout" element={<SignIn />} />
        </Route> */}
        {/* <Route element={<ProtectedRoute/>}>
            <Route path="/landing" element={<Landing />} />
            <Route path="/u/exam/:id/show" element={<LandingExam />} />
          </Route>
          <Route path="/register" element={<LandingRegister />} /> */}
        {/* <Route element={
          // <RequireAuth loginPath="/login">
            <ProtectedRoute />
          // </RequireAuth>
          }/> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* {
        allowed_codes.map(                                                                                                              => {
          return <Route path={`/:${code}`} element={<SignUp />} /> 
        })
        } */}
        {/* <Route path="/:code" element={<SignUp />} /> */}
        {/* <Route path="/reset-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/landing" element={<RedirectPayment />} /> */}
        {/* <Route path="/*" element={<NotFoundRoute />} /> */}
      </Routes>

      {/* <HelmetProvider>
        <Helmet>
          <script src='https://app-sandbox.duitku.com/lib/js/duitku.js'></script>
          <script src='https://app-prod.duitku.com/lib/js/duitku.js'></script>
        </Helmet>
      </HelmetProvider> */}
    </>
  );
}

export default AppFront;
