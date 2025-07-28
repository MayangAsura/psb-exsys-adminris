import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionCreate from '../../features/admissions/create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tambah Seleksi PSB"}))
      }, [])


    return(
        <AdmissionCreate />
    )
}

export default InternalPage