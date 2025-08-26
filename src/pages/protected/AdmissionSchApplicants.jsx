import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchApplicants from '../../features/admissions/schools/applicants/applicants'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Pendaftar PSB"}))
      }, [])


    return(
        <AdmissionSchApplicants />
    )
}

export default InternalPage