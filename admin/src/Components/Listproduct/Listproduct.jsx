import React, { useEffect, useState } from 'react'
import './Listproduct.css'
import cross_icon from '../../assets/cross_icon.png'

export const Listproduct = () => {
  const[allproducts,setAllproducts] = useState([])

  const fetchinfo = async() =>{
    await fetch("http://localhost:4000/allproducts")
    .then((res)=>res.json()).then((data)=>{setAllproducts(data)})
  }
  useEffect(()=>{
    fetchinfo()
  },[])

  const remove_product = async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchinfo()
  }
  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
{allproducts.map((product,i)=>{
  return <><div key={i} className="listproduct-format-main listproduct-format">
    <img src={product.image} alt="" className="listproduct-product-icon" />
    <p>{product.name}</p>
    <p>${product.old_price}</p>
    <p>${product.new_price}</p>
    <p>${product.category}</p>
    <img onClick={()=>remove_product(product.id)} src={cross_icon} alt="" className="listproduct-remove-icon" />
  </div><hr /></>
})}
      </div>
    </div>
  )
}
