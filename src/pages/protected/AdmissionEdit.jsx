import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionEdit from '../../features/admissions/edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit"}))
      }, [])


    return(
        <AdmissionEdit />
    )
}

export default InternalPage