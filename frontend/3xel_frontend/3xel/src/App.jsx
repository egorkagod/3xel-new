import './App.css'
import { Route, Routes } from 'react-router-dom'
import { getCookie } from '../utils/cookie'
import Header from '../components/Header/Header'
import MainPage from '../components/MainPage/MainPage'
import Constructor from '../components/Constructor/Constructor'
import Discounts from '../components/Discounts/Discounts'

function App() {

  return (
    <div className='app'>
        <Header></Header>
        <Routes>
          <Route path='/' element={<MainPage />}></Route>
          <Route path='/constructor' element={<Constructor />}></Route>
          <Route path='/discounts' element={<Discounts />}></Route>
        </Routes>
    </div>
  )
}

export default App
