import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-red-600 min-h-screen flex items-center justify-center">
      <h1 className="text-white text-3xl font-bold">
        Laptop Price Predictor
      </h1>
    </div>
    </>
  )
}

export default App
