import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Applicants from '../../features/applicants'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Pendaftar"}))
      }, [])


    return(
        <Applicants/>
    )
}

export default InternalPage