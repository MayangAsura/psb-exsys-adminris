import Footer from "./components/sections/Footer/Footer";
import Navbar from "./components/sections/Navbar/Navbar";
import ProfileCover from "./components/sections/ProfileCover/ProfileCover";
import Sidebar from "./components/sections/Sidebar/Sidebar";
import Profile from "./components/sections/ProfileCard/Profile"; 
import Presence from "./components/sections/Presence/Presence"; 
import Exam from "./components/sections/Exams/Exam";
import Header from "./components/Header";
import '../index-user.css'


import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from "react";

function App() {

  const [applicant, setApplicant] = useState({id: "133c032c-6903-4e25-a2db-579d431fe6b4", sid: "d17ff676-85d2-4f9e-88f1-0fdfb37517b9"})
  useEffect(()=> {
    // getApplicant()
  }, [])
  // const getApplicant = () =>{
    
  // }
  return (
    <main className="min-h-screen relative bg-gray-50 pb-10" >
      <Header />
      {/* style={{ maxWidth:390 }} */}
      <ProfileCover />
      <div className="container px-4">
        <div className="flex flex-wrap px-4">
          <div className="w-full lg:w-1/3 mb-5 my">
            <Profile id={applicant.id} sid={applicant.sid} />
          </div>
          <div className="w-full lg:w-2/3 ">
            <Presence id={applicant.id} sid={applicant.sid} />
            <Exam id={applicant.id} sid={applicant.sid} />
            {/* <Navbar /> */}
          </div>
          {/* <div className="w-full lg:w-2/3 ">
            
            <Navbar />
          </div> */}
        </div>
      </div>
      <Footer />
      <HelmetProvider>
        <Helmet>
          <script src="https://kutty.netlify.app/kutty.js"></script>
        </Helmet>
      </HelmetProvider>
    </main>
  );
}

export default App;
