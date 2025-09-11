import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UniformModels from '../../features/uniform_models/edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit Model Seragam"}))
      }, [])


    return(
        <UniformModels/>
    )
}

export default InternalPage