import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import './App.css'

import Header from '../components/Header/Header'
import MainPage from '../components/MainPage/MainPage'
import Constructor from '../components/Constructor/Constructor'
import Profile from '../components/Profile/Profile'
import Discounts from '../components/Discounts/Discounts'
import Instruction from '../components/Instruction/Instruction'
import Order from '../components/Order/Order'
import Footer from '../components/Footer/Footer'
import { fetchCurrentUser } from '../store/userSlice'
import { fetchOrders, clearOrders } from '../store/ordersSlice'
import { fetchGoods } from '../store/goodsSlice'
import ScrollToUp from './ScrollToUp'

function App() {
  const location = useLocation()
  const state = location.state
  const backgroundLocation = state?.backgroundLocation
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)

  const [modalIsActive, setModalIsActive] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                navigate(-1)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
      if (location.pathname === '/profile' || location.pathname === '/profile/') {
        setModalIsActive(true)
      } else {
        setModalIsActive(false)
      }
    }, [location.pathname])

  useEffect(() => {
    dispatch(fetchCurrentUser())
    dispatch(fetchGoods())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders())
    } else {
      dispatch(clearOrders())
    }
  }, [dispatch, user])

  const handleClose = () => {
    if (backgroundLocation) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const routesLocation = backgroundLocation || location
  const routeKey = routesLocation.pathname

  return (
    <div className="app">
      <Header />
      {/* Reset scroll only when effective page changes (not modal/hash) */}
      <ScrollToUp watchPathname={routeKey} />
      <div className="page-transition" key={routeKey}>
        <Routes location={routesLocation}>
          <Route path="/" element={<MainPage />} />
          <Route path="/constructor" element={<Constructor />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path='/instruction' element={<Instruction />} />
          <Route path='/order/:id' element={<Order />} />
          <Route path='/profile/*' element={<Profile isActive={modalIsActive} onClose={handleClose} />} />
        </Routes>
      </div>

      {backgroundLocation && (
        <Routes>
          <Route path='/profile/*' element={<Profile isActive={modalIsActive} onClose={handleClose} />} />
        </Routes>
      )}
      <ToastContainer position="top-right" autoClose={4000} theme="light" />
      <Footer />
    </div>
  )
}

export default App
