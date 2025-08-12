import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionReports from '../../features/admissions/reports'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Report PSB"}))
      }, [])


    return(
        <AdmissionReports />
    )
}

export default InternalPage