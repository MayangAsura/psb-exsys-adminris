import { useEffect } from 'react'
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import AddLeadModalBody from '../features/leads/components/AddLeadModalBody'
import ImportQuestionModalBody from '../features/exams/questions/ImportQuestionModalBody'
import ImportParticipantModalBody from '../features/exams/participants/ImportParticipantModalBody'
import ManualQuestionModalBody from '../features/exams/questions/ManualQuestionModalBody'
import SuccessModal from '../components/Modals/SuccessModal'
import ErrorModal from '../components/Modals/ErrorModal'
import AddQuestionModalBody from '../features/exams/questions/AddQuestionModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'


function ModalLayout(){


    const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = (e) => {
        dispatch(closeModal(e))
    }



    return(
        <>
        {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : (size === 'sm' ? 'max-w-sm' : '')}`}>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
                <h3 className="font-semibold text-2xl text-center">{title}</h3>


                {/* Loading modal body according to different modal type */}
                {
                    {
                             [MODAL_BODY_TYPES.LEAD_ADD_NEW] : <AddLeadModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.QUESTION_ADD_IMPORT] : <ImportQuestionModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.EXAM_PARTIC_IMPORT] : <ImportParticipantModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.QUESTION_ADD_MANUAL] : <ManualQuestionModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.MODAL_SUCCESS] : <SuccessModal closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.MODAL_ERROR] : <ErrorModal closeModal={close} extraObject={extraObject}/>,
                            //  [MODAL_BODY_TYPES.QUESTION_ADD_NEW] : <AddQuestionModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CONFIRMATION] : <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.DEFAULT] : <div></div>
                    }[bodyType]
                }
            </div>
            </div>
            </>
    )
}

export default ModalLayout