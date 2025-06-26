import Footer from "../../sections/Footer/Footer";
import Navbar from "../../sections/Navbar/Navbar";
import ProfileCover from "../../sections/ProfileCover/ProfileCover";
import Sidebar from "../../sections/Sidebar/Sidebar";
import Profile from "../../sections/ProfileCard/Profile"; 
import Exam from "../../sections/Exams/Exam";
import Header from "../../Header";

import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
  
  return (
    <main className="min-w-lg min-h-screen relative bg-gray-50 pb-10" style={{ maxWidth:390 }}>
      <Header />
      {/* <ProfileCover /> */}
      <div className="container px-4">
        <div className="flex flex-wrap px-4">
          <div className="w-full lg:w-1/3 ">
            <Profile />
          </div>
          <div className="w-full lg:w-2/3 ">
            <Exam />
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
