import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import './App.css'

import Header from '../components/Header/Header'
import MainPage from '../components/MainPage/MainPage'
import Constructor from '../components/Constructor/Constructor'
import Discounts from '../components/Discounts/Discounts'
import Instruction from '../components/Instruction/Instruction'
import { fetchCurrentUser } from '../store/userSlice'
import { fetchOrders, clearOrders } from '../store/ordersSlice'
import { fetchGoods } from '../store/goodsSlice'

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)

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

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/constructor" element={<Constructor />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path='/instruction' element={<Instruction />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} theme="light" />
    </div>
  )
}

export default App
