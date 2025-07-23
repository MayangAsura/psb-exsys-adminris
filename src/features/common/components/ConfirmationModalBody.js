import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteLead } from '../../leads/leadSlice'
import { showNotification } from '../headerSlice'
import { deleteExam } from '../../../services/api/exams'
import { deleteSchedule } from '../../../services/api/schedule'

function ConfirmationModalBody({ extraObject, closeModal}){

    const dispatch = useDispatch()

    const { message, type, _id, index} = extraObject


    const proceedWithYes = async() => {
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteLead({index}))
            dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            const response = await deleteExam({id: index})
            // const {error, message, data} = await addExam({exam})
            console.log('response', response)
            // console.log('message', message)
            if(!response || response==null || response.error){
                dispatch(showNotification({message : "Gagal Menghapus Ujian", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                dispatch(showNotification({message : response.message, status : 1}))
            }else{
                dispatch(showNotification({message : "Gagal Menghapus Ujian", status : 0}))
            }
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.SCHEDULE_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            const response = await deleteSchedule({id: index})
            // const {error, message, data} = await addExam({exam})
            console.log('response', response)
            // console.log('message', message)
            if(!response || response==null || response.error){
                dispatch(showNotification({message : "Gagal Menghapus Jadwa", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                dispatch(showNotification({message : response.message, status : 1}))
            }else{
                dispatch(showNotification({message : "Gagal Menghapus Jadwal", status : 0}))
            }
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-12">
                
                <button className="btn btn-outline   " onClick={() => closeModal()}>Cancel</button>

                <button className="btn btn-primary bg-green-800 dark:bg-green-700 w-36 border-green-600 hover:border-green-500" onClick={() => proceedWithYes()}>Yes</button> 

        </div>
        </>
    )
}

export default ConfirmationModalBody