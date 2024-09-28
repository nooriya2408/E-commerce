import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'
import profile from '../../assets/profile.png'
const Navbar = () => {
  return (
    <div className='Navbar'>
        <img src={navlogo} alt="" className="nav-logo" />
        <img src={profile} alt="" className="nav-profile" />
    </div>
  )
}

export default Navbar