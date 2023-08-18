import React from 'react'

const MethodButton = ({methodName, endPointName}) => {
 const infoObj = {
   methodName,
   endPointName
 }

 const colorCode = {
  'GET': 'text-[#579972]',
  'POST': 'text-[#f2cc44]',
  'PUT': 'text-[#6ea2e6]',
  'PATCH': 'text-[#b49ed3]',
  'DELETE': 'text-[#f79a8d]'
 }
 
 const fetchReq = () => {
  fetch('http://localhost:3000/backendAST', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify(infoObj)  // sends to the componentController the filepath
    })
   .then(resp => {
    console.log(resp.json());
   })
   .catch(error => console.log(`Error: ${error}`))
 }

 const testClick = () => {
  console.log(infoObj);
 }



 return (
    <button className='btn' onClick={() => testClick()}><span className={`font-extrabold text-lg ${colorCode[methodName]}`}>{methodName}</span> <span className='font-extralight'>{endPointName}</span></button>
  )
}

export default MethodButton