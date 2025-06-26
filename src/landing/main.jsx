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

function App() {
  
  return (
    <main className="min-h-screen relative bg-gray-50 pb-10" >
      {/* style={{ maxWidth:390 }} */}
      <Header />
      {/* <ProfileCover /> */}
      <div className="container px-4">
        <div className="flex flex-wrap px-4">
          <div className="w-full lg:w-1/3 mb-">
            <Profile />
          </div>
          <div className="w-full lg:w-2/3 ">
            <Presence />
            {/* <Navbar /> */}
          </div>
          {/* <div className="w-full lg:w-2/3 ">
            <Exam />
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
