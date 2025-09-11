import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../../components/Input/InputText'
import ErrorText from '../../../../components/Typography/ErrorText'
import SelectBox from "../../../../components/Input/SelectBox"
import InputDateTimePicker from "../../../../components/Input/InputDateTimePicker"
import ToogleInput from "../../../../components/Input/ToogleInput"
import { showNotification } from "../../../common/headerSlice"
import { updateAdmissionSchool } from "../../../../services/api/admissions"
import supabase from "../../../../services/database-server"
// import { addNewLead } from "../leadSlice"

const INITIAL_ADMISSION_SCHOOL = {
    admission_id : "",
    school_id : "",
    started_at : "",
    ended_at : "",
    admission_status : "",
    admission_fee : "",
    quota : ""
}

function EditAdmissionSchoolParticipantModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [admissionSchool, setAdmissionSchool] = useState(INITIAL_ADMISSION_SCHOOL)
    const [schoolOptions, setSchoolOptions] = useState([])

    const {index, sch_id} = extraObject

    useEffect(() => {
        getSchoolsOptions()
        getAdmissionSchool(index)
        if(index){
            setAdmissionSchool({...admissionSchool, admission_id: index})
        }
    }, [index, sch_id])

    const getAdmissionSchool = async (pid) => {
        if (pid) {
            const {data: admission_schools, error } = await supabase.from('participants')
                                                        .select("*, applicants(*, applicant_schools(*) ) ")
                                                        .eq('applicants.applicant_schools.school_id', sch_id)
                                                        .eq('applicants.applicant_schools.admission_ays_id', index)
                                                        .eq('id', pid)
                                                        .is('deleted_at', null)
            if(admission_schools){
                console.log(admission_schools[0])
                setAdmissionSchool(admission_schools[0])
            }else{
                console.log(error)
            }
        }else{
            
        }
    }
    const saveAdmissionSchool = async () => {
        // if(admissionSchool.school_id.trim() === "")return setErrorMessage("First Name is required!")
        // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
        // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
        // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
        // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
        // else{
            // let newAdmissionSchool = {
            //     "id": 7,
            //     "email": admissionSchool.email,
            //     "first_name": admissionSchool.first_name,
            //     "last_name": admissionSchool.last_name,
            //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
            // }
            console.log(admissionSchool)
            const response = await updateAdmissionSchool({newAdmissionSchool: admissionSchool, id: sch_id})
            console.log(response)
            if(response.error){
                dispatch(showNotification({message : "Gagal Memperbarui Jenjang PSB!", status : 0}))

            }else{
                dispatch(showNotification({message : "Berhasil Memperbarui Jenjang PSB!", status : 1}))
            }
            // dispatch(showNotification({message : "New Lead Added!", status : 1}))
            closeModal()
        // }
    }

    const getSchoolsOptions = async () => {
        let { data: schools, error } = await supabase
            .from('schools')
            .select('*')
            console.log(schools)
            if(!error){
                // setSchoolOptions(schools)
                schools.map((e)=>(
                        // setScheduleOptions( e => {
                        schoolOptions.push({ value:e.school_id, label: e.school_name})
                        
                    ))
                    console.log(schoolOptions)
            // //     // schedulesOptions e.name

            // }))
            // name: schedule
            // setScheduleOptions(schedule => {.})
        }
    }

    const updateFormValue = ({updateType, nameInput=null, value}) => {
        setErrorMessage("")
        setAdmissionSchool({...admissionSchool, [updateType] : value})
        console.log(admissionSchool)
    }

    return(
        <>

            <SelectBox 
                            labelTitle="Jenjang Pilihan"
                            options={schoolOptions}
                            placeholder="Pilih Jenjang"
                            containerStyle="w-72"
                            nameInput="school_id"
                            updateType="school_id"
                            // labelStyle="hidden"
                            // defaultValue={admissionSchool.applicants?.applicant_schools[0]?.school_id}
                            updateFormValue={updateFormValue}
                        />
            {/* <InputDateTimePicker labelTitle="Waktu Mulai"  updateType="started_at" defaultValue={admissionSchool.started_at} nameInput="started_at"  updateFormValue={updateFormValue} containerStyle="z-999"/>

            <InputDateTimePicker labelTitle="Waktu Selesai" updateType="ended_at" nameInput="ended_at" defaultValue={admissionSchool.ended_at} updateFormValue={updateFormValue} containerStyle="z-999"/> */}


            {/* <InputText type="number" defaultValue={admissionSchool.quota} updateType="quota" containerStyle="mt-4" labelTitle="Kuota" updateFormValue={updateFormValue}/>
            <InputText type="number" defaultValue={admissionSchool.quota} updateType="quota" containerStyle="mt-4" labelTitle="Kuota" updateFormValue={updateFormValue}/>

            <InputText type="number" defaultValue={admissionSchool.admission_fee} updateType="admission_fee" containerStyle="mt-4" labelTitle="Biaya Masuk" updateFormValue={updateFormValue}/>

            <ToogleInput labelTitle="Status Pendaftaran" updateType="admission_status" nameInput="admission_status" defaultValue={admissionSchool.status} containerStyle="flex flex-grow justify-between item-center mt-5" updateFormValue={updateFormValue}/> */}

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary bg-green-500 text-gray-100 hover:bg-green-400 hover:text-gray-50 border-none px-6" onClick={() => saveAdmissionSchool()}>Simpan</button>
            </div>
        </>
    )
}

export default EditAdmissionSchoolParticipantModalBody