import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamQuestionsAdd from '../../features/exams/questions/question_add'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tambah Soal Ujian"}))
      }, [])


    return(
        <ExamQuestionsAdd/>
    )
}

export default InternalPage