

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
    <div>
          <div className="flex w-full lg:flex-row card bg-neutral p-2 min-w-min	" onClick={() => testClick()}>
            <div className={`flex badge place-items-center font-extrabold w-fit  ${colorCode[methodName]} p-4 ml-3 mt-2`}>
              {methodName}
            </div>
            <div className="divider divider-horizontal p-0"></div>
            <div className="grid flex-grow h-fit card rounded-box place-items-center break-all p-4">{endPointName}</div>
          </div>
    </div>
  )
}

export default MethodButton