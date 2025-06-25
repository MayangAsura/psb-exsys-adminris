import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Schedules from '../../features/schedules'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Jadwal Ujian"}))
      }, [])


    return(
        <Schedules/>
    )
}

export default InternalPage