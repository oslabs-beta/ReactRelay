import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Provider store = {store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
)
