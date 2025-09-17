import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import QuestionBankCreate from '../../features/question_banks/create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tambah Bank Soal"}))
      }, [])


    return(
        <QuestionBankCreate />
    )
}

export default InternalPage