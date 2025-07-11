import React, { useEffect, useState } from 'react'
import NumberItem from './NumberItem'
import { useParams } from 'react-router-dom'
function Panel() {
  const [quedata, setQueData] = useState([{num: "", qid: "", ir: "", or: ""}])
  const id = useParams().id
  useEffect(() => {
    getQue()
  }, [])
  const getQue = async () => {

    let { data: exam_test_contents, error } = await supabase
      .from('exam_test_contents')
      .select('some_column,other_column')
  
  }
  return (
    <div>
        <button></button>
        <div class="grid grid-cols-3 grid-rows-3 gap-4">
          {/* <NumberItem num={} qid={} ir={} or={} /> */}
        </div>
    </div>
  )
}

export default Panel