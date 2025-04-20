import React from 'react'
import { Button } from '../ui/button'
function Header() {
  return (
    <div className ='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg' alt="Logo " className= "h-10 w-auto" />
     
        <Button>Sign In</Button>
      
    </div>
  )
}

export default Header