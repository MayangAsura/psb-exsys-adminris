import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchReports from '../../features/admissions/schools/reports'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Peserta PSB"}))
      }, [])


    return(
        <AdmissionSchReports />
    )
}

export default InternalPage