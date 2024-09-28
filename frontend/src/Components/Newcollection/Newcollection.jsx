import React, { useEffect, useState } from 'react'
//import new_collection from '../Assets/new_collections'
import Item from '../Item/Item'
import './Newcollection.css'

const Newcollection = () => {
  const[new_collection,setNew_collection] = useState([]);

  useEffect(()=>{
    fetch("https://e-commerce-omep.onrender.com/newcollection")
    .then((res)=>res.json())
    .then((data)=>setNew_collection(data))
  },[])
  return (
    <div className='new-collection'>
<h1>NEW COLLECTIONS</h1>
<hr/>
<div className="collections">
{new_collection.map((item,i)=>{
    return <Item key={i} id={item.id} name={item.name} image={item.image}
     new_price ={item.new_price} old_price={item.old_price}/>
})}
</div>
    </div>
  )
}

export default Newcollection