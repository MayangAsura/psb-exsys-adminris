import Footer from "../../sections/Footer/Footer";
import Navbar from "../../sections/Navbar/Navbar";
import ProfileCover from "../../sections/ProfileCover/ProfileCover";
import Sidebar from "../../sections/Sidebar/Sidebar";
import Profile from "../../sections/ProfileCard/Profile"; 
import Exam from "../../sections/Exams/Exam";
import Header from "../../Header";

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useState } from "react";

function App() {
  const [applicant, setApplicant] = useState({id: "", sid: ""})
  return (
    // style={{ maxWidth:390 }}
    <main className="min-w-lg min-h-screen relative bg-gray-50 pb-10" >
      <Header id={applicant.id}  />
      {/* <ProfileCover /> */}
      <div className="container px-4">
        <div className="flex flex-wrap px-4">
          <div className="w-full lg:w-1/3 ">
            <Profile id={applicant.id} sid={applicant.sid}/>
          </div>
          <div className="w-full lg:w-2/3 ">
            <Exam id={applicant.id} sid={applicant.sid} />
            {/* <Navbar /> */}
          </div>
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
