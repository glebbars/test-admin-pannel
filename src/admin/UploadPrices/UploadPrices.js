import React, { useEffect, useState } from "react";
import {useRefresh} from 'react-admin'
import axios from 'axios'
import readXlsxFile from 'read-excel-file'
import { useSelector } from "react-redux";
import {getPriceOfProductFromDB} from '../AdditionalFunctions/AdditionalFunctions'

const UploadPrices = () => {

  const refresh = useRefresh()

  const productsArr = useSelector(store => store.app.productsArr);

  // const [usdExchangeRate, setUsdExchangeRate] = useState(0)


  // useEffect(() => {
  //   axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
  //   .then(res => {
  //     res.data.find(obj => obj.ccy === 'USD' && obj.base_ccy === 'UAH' ? setUsdExchangeRate(+obj.sale) : null)
  //   })
  // }, [])

  const allPricesObj = {}

  const updateObjPricesWithExcel = (e) => {
  readXlsxFile(e.target.files[0], { sheet: 1 }).then( rows => {
    const usdExchangeRate = rows[0][0] === 'Курс' ? rows[0][1] : 0

    console.log(usdExchangeRate)

    rows.forEach(row => {
      if(row[0] && row[1] && row[0] !== 'Курс' && typeof row[1] === 'number'){
        const formattedPrice = Math.round(Math.ceil(row[1] * usdExchangeRate)/5)*5
        const formattedNames = row[0].toLowerCase()
        allPricesObj[formattedNames] = formattedPrice
      }
    })
    return allPricesObj
  })
  .then(data => axios.patch('http://localhost:5000/prices/1', data))
  .then(res => updateProductsPrices())
}
  
  const updateProductsPrices = () => {
    if(productsArr.length > 0){
      productsArr.map(obj => getPriceOfProductFromDB(obj)
        .then(data => axios.patch(`http://localhost:5000/posts/${obj.id}`, {price: data}) )
        .then(res => refresh())
      )
    }
  }

  return (
    <label className="admin__upload-file">
      {/* <div onClick={updateProductsPrices}>21</div> */}
      <input className="admin__upload-file__input" type="file" onChange={e => updateObjPricesWithExcel(e)}/>
        <span className="admin__upload-file__text">Upload prices</span>
    </label>
  )
}

export default UploadPrices