import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../utils/globalConstantUtil'
// import { deleteLead } from '../../leads/leadSlice'
// import { showNotification } from '../headerSlice'
import { useNavigate } from 'react-router-dom'

function SuccessModal({ extraObject, closeModal}){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { message, type, _id, index} = extraObject


    const proceedWithYes = async() => {
        // if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE){
        //     // positive response, call api or dispatch redux function
        //     // dispatch(deleteLead({index}))
        //     dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        // }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LOGIN_SUCCESS){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            navigate('/landing')
            // dispatch(showNotification({message : "Redirecting..!", status : 1}))
        }
        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-12">
                
                <button className="btn btn-outline   " onClick={() => proceedWithYes()}>OK</button>

                {/* <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button>  */}

        </div>
        </>
    )
}

export default SuccessModal