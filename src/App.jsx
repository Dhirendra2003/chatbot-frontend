import React from 'react'
import HomePage from './components/Home'
import Chatbot from './components/Chat'
import img1 from "./assets/elc_web.png"

const App = () => {
  return (
    <div>
      {/* <HomePage/> */}
      <div>
        <img src={img1} alt="" />
      </div>
      <Chatbot />
    </div>
  )
}

export default App
