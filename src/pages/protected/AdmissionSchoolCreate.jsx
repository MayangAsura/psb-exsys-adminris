import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchoolCreate from '../../features/admissions/schools/create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tambah Seleksi PSB"}))
      }, [])


    return(
        <AdmissionSchoolCreate />
    )
}

export default InternalPage