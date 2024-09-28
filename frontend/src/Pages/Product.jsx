import React, { useContext } from 'react'
import { Shopcontext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom'
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import Productdisplay from '../Components/ProductDisplay/Productdisplay';
import Description from '../Components/DescriptionBox/Description';
import Relateproduct from '../Components/Relatedproduct/Relateproduct';

const Product = () => {
  const {all_product} = useContext(Shopcontext);
  const {productId} = useParams();
  const product = all_product.find((e)=> e.id === Number(productId))
  return (
    <div>
      <Breadcrum product={product}/>
      <Productdisplay product={product} />
      <Description/>
      <Relateproduct/>
    </div>
  )
}

export default Product