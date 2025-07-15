import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NumberItem({no, qid, ir, or}) {
    // const [no, setNo] =  useState(0) 
    // const [question_id, setQid] = useState(props.qid) 
    // const [is_responded, setIr] = useState(props.ir)
    // const [order, setOrder] = useState(props.or)
    const navigate = useNavigate()

    useEffect(() => {
      // if(no)
      //   setNo(no)
      // if(qid)
      //   setQid(qid)
      // if(ir)
      //   setIr(ir)
      // if(or)
      //   setOrder(or)
    }, [no, qid, ir, or])

    const openQuestion = () => {
      navigate(`${qid}/order/${no}`)
    }
  return (
    <div>
        <button onClick={openQuestion} className={`btn w-5 btn-sm bg-green-900 hover:bg-gray-800 ml-3 ${ir?"bg-orange-900 hover:bg-orange-300":''}`}>
            <span className='justify-center text-center text-lg'>{no}</span>
        </button>
    </div>
  )
}

export default NumberItem