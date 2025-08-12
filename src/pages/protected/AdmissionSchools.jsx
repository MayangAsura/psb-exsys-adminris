import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchools from '../../features/admissions/schools'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Jenjang PSB"}))
      }, [])


    return(
        <AdmissionSchools />
    )
}

export default InternalPage