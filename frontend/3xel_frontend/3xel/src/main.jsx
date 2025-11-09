import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter, ScrollRestoration } from 'react-router-dom'
import { store } from '../store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <ScrollRestoration></ScrollRestoration>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
