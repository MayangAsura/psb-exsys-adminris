import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GenAdmissions from '../../features/gen-admissions'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Informasi PSB"}))
      }, [])


    return(
        <GenAdmissions/>
    )
}

export default InternalPage