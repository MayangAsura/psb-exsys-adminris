import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionDetail from '../../features/admissions/detail'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
      }, [])


    return(
        <AdmissionDetail />
    )
}

export default InternalPage