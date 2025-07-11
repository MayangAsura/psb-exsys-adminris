import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NumberItem(props) {
    const [no, setNo] =  useState(props.num) 
    const [question_id, setQid] = useState(props.qid) 
    const [is_responded, setIr] = useState(props.ir)
    const [order, setOrder] = useState(props.or)
    const navigate = useNavigate()
  return (
    <div>
        <button onClick={()=>navigate(`${question_id}/order/${no}`)}>
            <span className='justify-center text-center text-lg'>{}</span>
        </button>
    </div>
  )
}

export default NumberItem