import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ExamDetail from '../../features/exams/detail'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail"}))
      }, [])


    return(
        <ExamDetail />
    )
}

export default InternalPage