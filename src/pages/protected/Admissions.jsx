import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Admissions from '../../features/admissions'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Seleksi PSB"}))
      }, [])


    return(
        <Admissions/>
    )
}

export default InternalPage