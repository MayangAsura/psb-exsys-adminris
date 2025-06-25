import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamCreate from '../../features/exams/create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tambah Ujian"}))
      }, [])


    return(
        <ExamCreate />
    )
}

export default InternalPage