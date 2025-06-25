import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ScheduleDetail from '../../features/schedules/detail'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
      }, [])


    return(
        <ScheduleDetail />
    )
}

export default InternalPage