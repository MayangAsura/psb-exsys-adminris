import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchDetail from '../../features/admissions/schools/detail'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
      }, [])


    return(
        <AdmissionSchDetail />
    )
}

export default InternalPage