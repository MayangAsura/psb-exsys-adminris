import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamParticipant from '../../features/exams/participants/participants'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Ujian"}))
      }, [])


    return(
        <ExamParticipant />
    )
}

export default InternalPage