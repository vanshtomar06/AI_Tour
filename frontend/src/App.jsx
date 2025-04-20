
import { useState } from 'react'
import Trip_bg from "/Trip_bg.png"
import './App.css'
import Hero from './components/custom/Hero.jsx'
import {Button} from './components/ui/button.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Hero */}
      <div className="min-h-screen bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${Trip_bg})` }}
      >
        <Hero />
      </div>

    </>
  )
}


export default App