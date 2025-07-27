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
import GoodPage from '../components/GoodPage/GoodPage'
import Payment from '../components/Payment/Payment'
import About from '../components/About/About'
import Footer from '../components/Footer/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthorized, updateProfile } from '../components/store/profileSlice'
import { getCookie } from '../utils/cookie'
import { toast } from 'react-toastify'

function App() {

  const dispatcher = useDispatch()

  useEffect(() => {

    const csrfToken = getCookie('csrftoken')

    fetch('/api-root/user/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error(`Ошибка: ${response.status}, ${response.statusText}`)
        return response.json()
      })
      .then(data => { dispatcher(updateProfile(data)); dispatcher(setAuthorized(true)) })
      .catch(_ => { dispatcher(setAuthorized(false)) })
  }, [])

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
          <Route path='/good/:id' element={<>
            <Header></Header>
            <GoodPage />
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
          <Route path='/payment' element={<>
            <Payment />
          </>} />
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
