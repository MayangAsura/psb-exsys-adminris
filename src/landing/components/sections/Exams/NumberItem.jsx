import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NumberItem({no, qid, ir, setIr, or}) {
    // const [no, setNo] =  useState(0) 
    // const [question_id, setQid] = useState(props.qid) 
    // const [is_responded, setIr] = useState(props.ir)
    // const [order, setOrder] = useState(props.or)
    const navigate = useNavigate()
    const [ac, setA] = useState(false)
    // const [cno, setCurNo] = useState(1)

    useEffect(() => {
      // if(no)
      //   setNo(no)
      // if(qid)
      //   setQid(qid)
      // if(ir)
      //   setIr(ir)
      // if(or)
      //   setOrder(or)
      console.log(no)
    }, [no, qid, ir, or])

    const handleResponse = () => {
      setA(!ac)
      console.log(ac)
      setIr(qid, no)
      // if(ir)
      // if()
      // navigate(`${qid}/order/${no}`)
    }
  return (
    <>
      
    <div>
        <button onClick={handleResponse} className={`flex flex-col justify-center items-center btn w-5 btn-sm p-5 m-2 ${ac? 'bg-green-800 hover:bg-gray-800': ir? "bg-orange-900 hover:bg-green-200":'bg-green-100 hover:bg-gray-800'}`}>
            <span className='justify-center items-center text-center text-lg '>{no}</span>
        </button>
    </div>
    </>
  )
}

export default NumberItem