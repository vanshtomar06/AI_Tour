import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'


function Hero() {
  return (
    <div className='flex flex-col items-center mx-50 gap-9'>
      <h1 
      className='font-extrabold text-[50px] text-center mt-18'>
        <span 
        className='text-[#e92309]'>
          Discover Your Next Adventure with AI: </span>
          <br></br>
          Personalized Itineraries at your Fingertips
        
      </h1>
      <p className='text-xl text-[#0b0e01] text-center'>
        <b>Your personal trip planner and travel curator, creating custom itineraries to your interests and budget.</b>
      </p>

      <Link to={'/create-trip'}>
        <Button>Get Started, It's Free </Button>
      </Link>
    </div>
  )
}

export default Hero
