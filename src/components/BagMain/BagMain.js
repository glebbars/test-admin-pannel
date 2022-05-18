import React, {useEffect, useState} from 'react'
import BagList from '../BagList/BagList'
import BagCheckout from '../BagCheckout/BagCheckout'
import { useDispatch, useSelector } from 'react-redux';

const BagMain = ({addedToBag, filteredArr}) => {
  const dispatch = useDispatch()
  const [finalProductsArr, setFinalOrder] = useState([])
  // const [totalOrderPrice, setTotalOrderPrice] = useState(0)

  // useEffect(() => {
  //   if(filteredArr.length > 0){
  //     const prices = filteredArr.map(product => product.price)
  //     const total = prices.reduce((a, c) => a + c)
  //     setTotalOrderPrice(total)
  //   }
  // }, [])

  useEffect(() => {
    const sortedArr = filteredArr.sort((a, b) => {
      return addedToBag.indexOf(a.id) - addedToBag.indexOf(b.id)
    })

    sortedArr.forEach(product => product.quantity = 1)

    setFinalOrder(sortedArr)
  }, [])


  const removeFromTheBag = (productId, price) => {
    dispatch({
      type: 'REMOVE_FROM_BAG',
      payload: addedToBag.filter((id) => id !== productId),
    })

    // setTotalOrderPrice(totalOrderPrice - price)
  };


  return(
    <div className="bag__main__wrapper">
      {/* <BagList sortedArr={sortedArr} removeFromTheBag={removeFromTheBag} totalOrderPrice={totalOrderPrice} setTotalOrderPrice={setTotalOrderPrice}/>
      {totalOrderPrice > 0 && <BagCheckout sortedArr={sortedArr} totalOrderPrice={totalOrderPrice} />} */}
      {finalProductsArr.length > 0 && <BagList sortedArr={finalProductsArr} removeFromTheBag={removeFromTheBag} setFinalOrder={setFinalOrder} /> }
      {finalProductsArr.length > 0 && <BagCheckout sortedArr={finalProductsArr} /> }
    </div>
  )
}

export default BagMain