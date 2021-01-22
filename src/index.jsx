import React from 'react'
import { render } from "react-dom"
import App from './pages'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import store from './store'
import './style/index.less'

// import { PersistGate } from 'redux-persist/es/integration/react';
// import { persistor } from './store';


if(module.hot) {
  module.hot.accept()
}


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
  )
  
  
  
  // <PersistGate loading={null} persistor={ persistor }>
  // </PersistGate>