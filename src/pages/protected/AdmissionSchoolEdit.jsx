import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchoolEdit from '../../features/admissions/schools/edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit"}))
      }, [])


    return(
        <AdmissionSchoolEdit />
    )
}

export default InternalPage