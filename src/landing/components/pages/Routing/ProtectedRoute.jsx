import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
// import Header from '../partials/Header'
// import checkAuthUser from '../../../../app/auth-user';
import checkAuth from '../../../../app/auth';
import Header from "../../Header"

const ProtectedRoute = () => {
//   const { userInfo } = useSelector((state) => state.auth)
    const token = checkAuth()

  // show unauthorized screen if no user is found in redux store
  if (!token) {
    return (
      <div className="flex flex-col max-w-lg min-h-screen my-0 mx-auto shadow-lg overflow-hidden relative">
      {/* flex flex-col max-w-lg min-h-screen my-0 mx-auto overflow-hidden relative */}
            {/*  Site header */}
            <Header />
      
            {/*  Page content */}
            <main className="flex-grow">
      
              <section className="bg-gradient-to-b from-gray-100 to-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                  <div className="pt-32 pb-12 md:pt-40 md:pb-20">
      
                    {/* Page header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-12">
                      <div className='flex justify-center md:my-3'>
                        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="45" fill="#FFFF" stroke="#FFA500" strokeWidth="3"/>
                          <path d="M50 25 L50 55 M50 65 L50 70" stroke="#FF4500" strokeWidth="6" strokeLinecap="round"/>
                        </svg>
                      </div>

                      <h1 className="h3">Tidak Ada Akses</h1>
                      {/* <Link to='/login'>Masuk</Link> untuk mendapatkan akses */}
                      <p className="text-xl text-gray-600 inline-grid rounded-lg"> 
                        Silahkan masuk untuk mendapatkan akses. 
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24">
                          <path d="M12 4v8.59l-3.29-3.29L7.41 11l5 5 5-5-1.29-1.29L12 12.59V4h-1.5z"/>
                        </svg> */}
                      </p>
                       <Link to="/login" className="btn-sm block rounded-lg bg-gray-900 hover:bg-gray-800 md:my-5">
                          MASUK
                            
                          {/* <span className='text-base h5 text-white items-center'></span>                  */}
                        </Link>
                      {/* <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">PENGISIAN FORMULIR</Link> */}
                    </div>
                  </div>
                </div>
                </section>
              </main>  
            </div>
                   
      // <div className='unauthorized'>
      //   <h1>Tidak ada akses :</h1>
      //   <span>
      //     <Link to='/login'>Masuk</Link> untuk mendapatkan akses
      //   </span>
      // </div>
    )
  }

  // returns child route elements
  return <Outlet />
}
export default ProtectedRoute