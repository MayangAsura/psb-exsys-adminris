import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdmissionSchParticipants from '../../features/admissions/schools/participants/participants'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Peserta PSB"}))
      }, [])


    return(
        <AdmissionSchParticipants />
    )
}

export default InternalPage