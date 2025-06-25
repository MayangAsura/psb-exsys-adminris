import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ScheduleEdit from '../../features/schedules/edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
      }, [])


    return(
        <ScheduleEdit />
    )
}

export default InternalPage