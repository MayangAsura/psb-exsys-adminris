import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { MODAL_BODY_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteLead } from '../../leads/leadSlice'
import { showNotification } from '../headerSlice'
import { deleteExam, deleteParticipant  } from '../../../services/api/exams'
import { deleteSchedule } from '../../../services/api/schedule'
import { useNavigate } from 'react-router-dom'
import { openModal } from '../modalSlice'
import { deleteAdmission, deleteAdmissionSchool } from '../../../services/api/admissions'

function ConfirmationModalBody({ extraObject, closeModal}){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { message, type, _id, index, oid} = extraObject

    // const { data: participantsI, isLoading } = useQuery({
    //                         queryKey: ["participants", { search, participants, appl_id }],
    //                         queryFn: () => deleteParticipant({search, appl_id: i}),
    //                         staleTime: Infinity,
    //                         cacheTime: 0,
    //                     });
    //                     //   : participantObj, lengthPart: participants.length, i: index

    // const { mutateAsync: addTodoMutation } = useMutation({
    //     mutationFn: addParticipants,
    //     onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: ["participants", { search, appl_id }] });
    //     },
    // });
    const proceedWithYes = async() => {
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteLead({index}))
            dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            const response = await deleteExam({appl_id: index})
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
                dispatch(showNotification({message : "Gagal Menghapus Jadwal", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                dispatch(showNotification({message : response.message, status : 1}))
                // navigate('/')
            }else{
                dispatch(showNotification({message : "Gagal Menghapus Jadwal", status : 0}))
            }
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            const response = await deleteParticipant({pid: index, exam_id: oid})
            // const {error, message, data} = await addExam({exam})
            console.log('response', response)
            console.log('iod', oid)
            // console.log('message', message)
            if(!response || response==null || response.error){
                dispatch(showNotification({message : "Gagal Menghapus Peserta", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                console.log(oid)
                dispatch(openModal({title : "Berhasil", bodyType : MODAL_BODY_TYPES.MODAL_SUCCESS, size: 'sm',
                                      extraObject : {message : response.message,
                                        type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_DELETE_SUCCESS, index: oid}
                                    }))
                // dispatch(showNotification({message : response.message, status : 1}))
                // "Pesan error: "+ participantsI.message + ", Total data : "+ (total_imported==0?importedData.length:total_imported) + (invalidData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(invalidData.map((val)=> val.parts).join(', ')) + (importedData.length > 0? ", Data Peserta tidak valid: " + JSON.stringify(importedData.map((val)=> val.parts).join(', ')) : ""): "")
                navigate('/ad/exams/'+oid+'/participants')
            }else{
                dispatch(showNotification({message : "Gagal Menghapus Peserta", status : 0}))
            }

            navigate('/ad/exams/'+oid+'/participants')
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSIONS_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            const response = await deleteAdmission({id: index})
            // const {error, message, data} = await addExam({exam})
            console.log('response', response)
            // console.log('message', message)
            if(!response || response==null || response.error){
                dispatch(showNotification({message : "Gagal Mengh                                        apus data PSB", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                dispatch(showNotification({message : response.message, status : 1}))
                // navigate('/')
            }else{
                dispatch(showNotification({message : "Gagal Menghapus data PSB", status : 0}))
            }
            // dispatch(showNotification({message : "Lead Deleted!", status : 1}))
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSION_SCHOOLS_DELETE){
            // positive response, call api or dispatch redux function
            // dispatch(deleteLead({index}))
            const response = await deleteAdmissionSchool({id: index})
            // const {error, message, data} = await addExam({exam})
            console.log('response', response)
            // console.log('message', message)
            if(!response || response==null || response.error){
                dispatch(showNotification({message : "Gagal Menghapus jenjang", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                dispatch(showNotification({message : response.message, status : 1}))
                // navigate('/')
            }else{
                dispatch(showNotification({message : "Gagal Menghapus jenjang", status : 0}))
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

                <button className="btn btn-primary bg-green-800 dark:bg-green-700 w-36 border-green-600 hover:border-green-500 hover:bg-green-700 hover:text-gray-200" onClick={() => proceedWithYes()}>Yes</button> 

        </div>
        </>
    )
}

export default ConfirmationModalBody