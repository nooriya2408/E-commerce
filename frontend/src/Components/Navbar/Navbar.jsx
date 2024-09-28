import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { Shopcontext } from '../../Context/ShopContext'

const Navbar = () => {
  const[menu,setmenu] = useState("shop")
  const{getTotalcartitems } = useContext(Shopcontext)
  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>TrendHive</p>
        </div>
        <ul className="nav-menu">
            <li onClick={()=>setmenu("shop")}><Link style={{textDecoration:"none",color: "#171717"}} to='/'>Shop</Link>{menu === "shop"?<hr/>:<></>}</li>
            <li onClick={()=>setmenu("mens")}><Link  style={{textDecoration:"none",color: "#171717"}} to='/mens'>Men</Link> {menu === "mens"?<hr/>:<></>}</li>
            <li onClick={()=>setmenu("womens")}><Link  style={{textDecoration:"none",color: "#171717"}} to='/womens'>Women</Link>{menu === "womens"?<hr/>:<></>}</li>
            <li onClick={()=>setmenu("kids")}><Link  style={{textDecoration:"none",color: "#171717"}} to='kids'>Kids</Link>{menu === "kids"?<hr/>:<></>}</li>
        </ul>
        <div className='nav-login-cart'> 
          {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
          :<Link to='/login'><button>Login</button></Link>}
            
           <Link to='/cart'><img src={cart_icon} alt="" /></Link>
            <div className="nav-count">{getTotalcartitems() }</div>
        </div>
    </div>
  )
}

export default Navbar