

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

  // const testClick = () => {
  // console.log(infoObj);
  // }


    // <button className='btn' onClick={() => testClick()}><span className={`font-extrabold text-lg ${colorCode[methodName]}`}>{methodName}</span> <span className='font-extralight'>{endPointName}</span></button>
//TODO: one day, on click of 
  return (

    <tr className="bg-base-100 rounded-md">
      <td style={{width:'5px'}} className={`m-1 p-1 rounded-md min-w-min text-white	text-center font-bold ${colorCode[methodName]}`}>{methodName}</td>
      {/* <td style={{width:'5px'}} className={`p-2 rounded-md min-w-min text-white bg-[#579972]`}>DELETE</td> */}
      {/* <td style={{width:'5px'}}><div className={`m-1 p-2 rounded-md min-w-min text-white	 ${colorCode[methodName]}`}>DSLKFLDSIKJFDK</div></td> */}
      <td className='pl-10 w-min'>{endPointName}</td>
    </tr>

  )
}

export default MethodButton