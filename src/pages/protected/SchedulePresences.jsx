import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
// import ScheduleParticipants from '../../features/schedules/participants'
import SchedulePresences from '../../features/schedules/presences'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Presensi"}))
      }, [])


    return(
        <SchedulePresences />
    )
}

export default InternalPage