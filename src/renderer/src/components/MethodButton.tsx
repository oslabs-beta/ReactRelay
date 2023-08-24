

const MethodButton = ({methodName, endPointName}) => {
  const infoObj = {
    methodName,
    endPointName
  }

  //FIXME: colors are a bit hard to read
  const colorCode = {
    'GET': 'bg-[#579972]',
    'POST': 'bg-[#f2cc44]',
    'PUT': 'bg-[#6ea2e6]',
    'PATCH': 'bg-[#b49ed3]',
    'DELETE': 'bg-[#f79a8d]'
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
    console.log('Method: ', methodName, ' Endpoint: ', endPointName);
  }
  // <tr className="bg-base-100 rounded-md">
  //   <td style={{width:'5px'}}><div className={`m-1 p-1 rounded-md min-w-min text-white	text-center font-bold ${colorCode[methodName]}`}>{methodName}</div></td>
  //   {/* <td style={{width:'5px'}} className={`p-2 rounded-md min-w-min text-white bg-[#579972]`}>DELETE</td> */}
  //   {/* <td style={{width:'5px'}}><div className={`m-1 p-2 rounded-md min-w-min text-white	 ${colorCode[methodName]}`}>DSLKFLDSIKJFDK</div></td> */}
  //   <td className='pl-10 w-min'>{endPointName}</td>
  // </tr>




  return (
    
    // <button className='btn py-5 px-5' onClick={() => testClick()}>
    <button className='btn h-20' onClick={() => testClick()}>
      <div className='grid grid-cols-10 w-full '>
        <div className={`col-span-3 font-extrabold text-lg rounded-md w-min px-2 text-slate-100 ${colorCode[methodName]}`}>{methodName}</div>
        <div className='justify-self-start col-span-7 self-center text-sm'>{endPointName}</div>
      </div>
      {/* <div className='grid grid-cols-4'>
        <div className={`justify-self-start col-span-1 font-extrabold text-lg rounded-md w-min px-2 ${colorCode[methodName]}`}>{methodName}</div>
        <div className='justify-self-start col-span-3'>{endPointName}</div>
      </div> */}
    </button>
//TODO: one day, on click of the method or endpoint, it should sort it :)

  )
}

export default MethodButton