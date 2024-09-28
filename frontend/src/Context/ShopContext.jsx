import React, { createContext, useEffect, useState} from 'react'
//import all_product from '../Components/Assets/all_product'

export const Shopcontext = createContext(null);
const getDefaultcart = ()=>{
    let cart ={};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
         }
         return cart;
}
const ShopContextProvider = (props)=>{
   const[all_product,setAll_product] = useState([]);
    const[cartItems,setCartItems] = useState(getDefaultcart());
    //console.log(cartItems,"cartitems")

    useEffect(()=>{
        fetch("https://e-commerce-omep.onrender.com/allproducts")
        .then((res)=>res.json())
        .then((data)=>setAll_product(data))

        if(localStorage.getItem('auth-token')){
            fetch("https://e-commerce-omep.onrender.com/getcart",{
                method:"POST",
                headers:{
                    Accept:"appliication/form-data",
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:'',
            }).then((res)=>res.json())
            .then((data)=>setCartItems(data))
        }
    },[])

    const addToCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        //console.log(cartItems);
        if(localStorage.getItem('auth-token')){
             fetch("https://e-commerce-omep.onrender.com/addtocart",{
                method:"POST",
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    "Content-Type":'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((res)=>{
                return res.text();
                res.json()})
            .then((data)=>{
                console.log(data);
               try {
                const jsondata = JSON.parse(data);
                console.log(jsondata)
               } catch (error) {
                console.error("Error parsing :",error)
               }
            }) 
            .catch((err) => console.error('Fetch error:', err));
        }
        
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-
            1}));
            if(localStorage.getItem('auth-token')){
                fetch("hhttps://e-commerce-omep.onrender.com/removefromcart",{
                    method:"POST",
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        "Content-Type":'application/json',
                    },
                    body:JSON.stringify({"itemId":itemId})
                })
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data);
                   try {
                    const jsondata = JSON.parse(data);
                    console.log(jsondata)
                   } catch (error) {
                    console.error("Error parsing :",error)
                   }
                }) 
                .catch((err) => console.error('Fetch error:', err));
            } 
    }
    const carttotalAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(item) )
                console.log(itemInfo,"iteminfo")
                totalAmount += itemInfo.new_price * cartItems[item];
            }
           
        }
        return totalAmount;
    }
   
    const getTotalcartitems =()=>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+= cartItems[item]
            }
        }
        return totalItem;
    }
    const contextValue = {getTotalcartitems ,carttotalAmount,all_product,cartItems,addToCart,removeFromCart};
    return(
        <Shopcontext.Provider value={contextValue}>
{props.children}
        </Shopcontext.Provider>
    )
}
export default ShopContextProvider