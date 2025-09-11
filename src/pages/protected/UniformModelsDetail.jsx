import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UniformModels from '../../features/uniform_models/detail'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail Model Seragam"}))
      }, [])


    return(
        <UniformModels/>
    )
}

export default InternalPage