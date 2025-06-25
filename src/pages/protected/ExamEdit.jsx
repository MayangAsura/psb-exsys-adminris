import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamEdit from '../../features/exams/edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit Ujian"}))
      }, [])


    return(
        <ExamEdit />
    )
}

export default InternalPage