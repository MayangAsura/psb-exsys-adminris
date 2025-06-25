import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamQuestions from '../../features/exams/questions/questions'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Soal Ujian"}))
      }, [])


    return(
        <ExamQuestions/>
    )
}

export default InternalPage