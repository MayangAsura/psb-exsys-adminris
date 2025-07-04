import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamResponses from '../../features/exams/responses'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Ujian"}))
      }, [])


    return(
        <ExamResponses />
    )
}

export default InternalPage