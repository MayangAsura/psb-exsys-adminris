import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../utils/globalConstantUtil'
import { useNavigate } from 'react-router-dom'
// import { deleteLead } from '../../leads/leadSlice'
// import { showNotification } from '../headerSlice'

function ErrorModal({ extraObject, closeModal}){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { message, type, _id, index} = extraObject


    const proceedWithYes = async() => {
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.MODAL_ERROR){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_ERROR){
            console.log('ind',index)
            navigate('/ad/exams/'+index+'/participants')
            // positive response, call api or dispatch redux function
        // dispatch(deleteLead({index}))
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_ERROR){
            console.log('ind',index)
            navigate('/login')
            // positive response, call api or dispatch redux function
        // dispatch(deleteLead({index}))
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-3">
                
                <button className="btn btn-outline   " onClick={() => proceedWithYes()}>OK</button>

                {/* <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button>  */}

        </div>
        </>
    )
}

export default ErrorModal