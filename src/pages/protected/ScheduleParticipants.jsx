import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ScheduleParticipants from '../../features/schedules/participants'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Ujian"}))
      }, [])


    return(
        <ScheduleParticipants />
    )
}

export default InternalPage