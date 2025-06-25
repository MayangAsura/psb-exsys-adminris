import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ScheduleCreate from '../../features/schedules/create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tambah Jadwal"}))
      }, [])


    return(
        <ScheduleCreate />
    )
}

export default InternalPage