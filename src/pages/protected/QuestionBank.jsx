import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import QuestionBank from '../../features/question_banks'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Bank Soal"}))
      }, [])


    return(
        <QuestionBank/>
    )
}

export default InternalPage