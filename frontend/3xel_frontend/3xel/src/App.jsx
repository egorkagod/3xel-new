import './App.css'
import Header from '../components/Header/Header'
import Profile from '../components/Profile/Profile'
import ProfileInfo from '../components/Profile/ProfileInfo/ProfileInfo'
import Orders from '../components/Profile/Orders/Orders'
import Login from '../components/Login/Login'
import ForgotPassword from '../components/ForgotPassword/ForgotPassword'
import SignUp from '../components/SignUp/SignUp'
import ConfirmEmail from '../components/ConfirmEmail/ConfirmEmail'
import MainPage from '../components/MainPage/MainPage'
import Catalogue from '../components/Catalogue/Catalogue'
import Payment from '../components/Payment/Payment'
import About from '../components/About/About'
import Footer from '../components/Footer/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'

function App() {

  return (
    <div className='app'>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<>
            <Header></Header>
            <MainPage />
            <Footer></Footer>
          </>} />
          <Route path='/about' element={<>
            <Header></Header>
            <About />
            <Footer></Footer>
          </>} />
          <Route path='/catalogue' element={<>
            <Header></Header>
            <Catalogue />
            <Footer></Footer>
          </>} />
          <Route path='/profile' element={<>
            <Header></Header>
            <Profile></Profile>
            <Footer></Footer>
          </>}>
            <Route path='info' element={<ProfileInfo />} />
            <Route path='my-orders' element={<Orders />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/confirm-email' element={<ConfirmEmail />} />
          <Route path='/payment' element={<Payment />} />
        </Routes>

      </BrowserRouter>

      <ToastContainer
        position='top-center'
        draggable={false}
        autoClose={3000}
        transition={Slide}
        hideProgressBar={true}
        pauseOnHover={false}
        newestOnTop={true}
        theme='dark'
        pauseOnFocusLoss
        closeOnClick={false}
        closeButton={false}
        rtl={false}
      />
    </div>
  )
}

export default App
