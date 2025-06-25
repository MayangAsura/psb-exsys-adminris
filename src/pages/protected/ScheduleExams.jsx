import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ScheduleExams from '../../features/schedules/exams'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Ujian"}))
      }, [])


    return(
        <ScheduleExams />
    )
}

export default InternalPage