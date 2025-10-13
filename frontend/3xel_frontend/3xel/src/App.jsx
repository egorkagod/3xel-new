import './App.css'
import { Route, Routes } from 'react-router-dom'
import { getCookie } from '../utils/cookie'
import Header from '../components/Header/Header'
import MainPage from '../components/MainPage/MainPage'

function App() {

  return (
    <div className='app'>
        <Header></Header>
        <MainPage></MainPage>
    </div>
  )
}

export default App
