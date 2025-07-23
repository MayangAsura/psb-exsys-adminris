// import { useState } from 'react'
// import { useState } from 'react'
import supabase from '../database-server'

export const addExam = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal menambahkan data Ujian', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_tests')
                                .insert([
                                    props.newExam
                                ])
                                .select()

        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
             response.error= true
        response.message= 'Gagal menambahkan data Jadwal'
        response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam)

            const { data: schedule, e } = await supabase
                            .from('exam_schedule_test')
                                .insert([
                                    {exam_schedule_id: schedule.id, exam_test_id: exam.id }
                                ])
                                .select()
            // const { school, e } = await supabase
            // .from('exam_schedule_schools')
            // .insert([
            //     { exam_schedule_id: schedule[0].id, school_id: props.school_id },
            // ])
            // .select()

            if(e){
                return response
            }

        // props.newSchedule.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menambahkan data Jadwal'
        response.data= exam[0].id
        return response
    }
}
export const addParticipants = async (props) => {

    // const fetchTodos = async (query = "")=> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("fetched todos");

//   const filteredTodos = todos.filter((todo) =>
//     todo.title.toLowerCase().includes(query.toLowerCase())
//   );

  // Uncomment the line below to trigger an error
  // throw new Error();

//   return [...filteredTodos];
// };

    console.log('in addpar')
    // const [inv, setInv] = useState([])
    let inv = []
    let imp = []
    let curr = []
    const response = {error: true, message: 'Gagal menambahkan data Peserta', data: null }
    // let ti = 0
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const { data: currParts, error } = await supabase
                            .from('exam_test_participants')
                            .select('*, exam_profiles(regist_number, phone_number), exam_tests(*) ')
                            .eq(`exam_profiles.regist_number`,props.participants.NO_REGISTRASI)
                            // .eq(`exam_test_id`,props.participants.NO_REGISTRASI)
                            .like('exam_tests.test_code', props.participants.KODE_UJIAN)
                            // .eq('exam_profiles.regist_number')
    // if(imp.includes(props.))
    if(currParts.length > 0){
        // console.log('')
        curr.push({parts: currParts[0].exam_profiles?.regist_number??currParts[0].exam_profiles?.phone_number})
        if(props.index == props.lengthPart){
            response.error= true
            response.message= 'Gagal menambahkan data Peserta'
            response.data= {id: null, invalidData: inv.length>0? inv : 0, alreadyImp: curr, importedData: imp}
        }
        // else {
        //     response.error= true
        //     response.message= 'Berhasil menambahkan data Peserta'
        //     response.data= exam[0].id
        // }
        return response
    }else{
        const { data: appl, e } = await supabase
                            .from('applicants')
                            .select("*")
                            .eq('regist_number', props.participants.NO_REGISTRASI)

                                // .insert([
                                //     props.participants
                                // ])
                                // .select()
    if(e){

        // setInv([...inv, {id: appl[0].id}])
        inv.push({parts: appl[0].regist_number??appl[0].phone_number})
        // setInv([...inv, {id: appl[0].id}])
        if(props.index == props.lengthPart){
            response.error= true
            response.message= 'Gagal menambahkan data Peserta'
            response.data= {id: null, invalidData: inv.length>0? inv : 0, alreadyImp: curr, importedData: imp}
        }
        return response
        
    }else{
        const { data: ext, e } = await supabase
                            .from('exam_tests')
                            .select("*")
                            .like('test_code', `%${(props.participants.KODE_UJIAN)}`)

        if(e) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            if(props.index == props.lengthPart){
                response.error= true
                response.message= 'Ujian tidak ditemukan'
                response.data= {id: null, invalidData: inv.length>0? inv : 0, alreadyImp: curr, importedData: imp}

            }
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }

        const { data: app, errapp } = await supabase
                            .from('applicants')
                            .select('id, full_name, phone_number, regist_number, participants(pob, home_address, participant_father_data(father_name), participant_mother_data(mother_name)) ')
                            .eq('regist_number', props.participants.NO_REGISTRASI)
                            // .or('')
                                // .se([
                                //     {exam_schedule_id: schedule.id, exam_test_id: exam.id }
                                // ])
                                // .select()
        if(errapp) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            if(props.index == props.lengthPart){

                response.error= true
                response.message= 'Data Peserta tidak ditemukan'
                response.data= {id: null, invalidData: inv.length>0? inv : 0, alreadyImp: curr, importedData: imp}
            }
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }
                                // const prof = {

            // }                    
        const { data: exProf, errprof } = await supabase
                        .from('exam_profiles')
                        .insert([
                                {appl_id: app[0].id, full_name: app[0].full_name, phone_number: app[0].phone_number, regist_number: app[0].regist_number}
                                // {exam_schedule_id: schedule.id, exam_test_id: exam.id }
                            ])
                            .select()
        if(errprof){
            if(props.index == props.lengthPart){
                
            }
            response.error= true
            response.message= 'Gagal menambahkan data Profil Peserta'
            response.data= {id: null, invalidData: inv.length>0? inv : 0, alreadyImp: curr, importedData: imp}
            return response
        }                       
        const newPar = {
            appl_id: exProf[0].appl_id,
            exam_test_id: ext[0].id
        }


        const response = {error: true, message: 'Gagal menambahkan data Peserta', data: null }
        const { data: exam, error } = await supabase
                            .from('exam_test_participants')
                                .insert([
                                    newPar
                                ])
                                .select()


        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
             response.error= true
        response.message= 'Gagal menambahkan data Peserta'
        response.data= {id: null, invalidData: inv.length>0? inv : 0, alreadyImp: curr, importedData: imp}
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam)
            // exam.map(e => {
                
            // })
            
            // const { school, e } = await supabase
            // .from('exam_schedule_schools')
            // .insert([
            //     { exam_schedule_id: schedule[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // ti++
        // props.newSchedule.school_id = props.school_id

        if(props.index == props.lengthPart){
            response.error= false
            response.message= 'Berhasil menambahkan data Peserta'
            response.data= {id: exam[0].id, invalidData: inv.length>0? inv : 0, alreadyImp: curr}
        }else {
            response.error= false
            response.message= 'Berhasil menambahkan data Peserta'
            response.data= exam[0].id
        }
        return response
        
    }
    }
    }
    
    
}

export const updateExam = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal memperbarui data Ujian', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_tests')
                                .update([
                                    props.newExam
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal memperbarui data Ujian'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam)
            const { error } = await supabase
                            .from('exam_schedules_test')
                            .delete()
                            .eq('exam_schedule_id', props.schedule_id)
                            .eq('exam_test_id', exam.id)

            const { data: schedule, e } = await supabase
                            .from('exam_schedule_test')
                                .insert([
                                    {exam_schedule_id: props.schedule_id, exam_test_id: exam.id }
                                ])
                                .select()
            // const { school, e } = await supabase
            // .from('exam_schedule_schools')
            // .insert([
            //     { exam_schedule_id: schedule[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // props.newSchedule.school_id = props.school_id

        if(!e){
            response.error= false
            response.message= 'Berhasil memperbarui data Ujian'
            response.data= exam[0].id
            return response
        }else{
            response.error= true
            response.message= 'Gagal memperbarui data Ujian'
            response.data= null
            return response
        }
    }
}

export const deleteExam = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const newData = [...props.id, {deleted_at: new Date().toISOString()}]
    const response = {error: true, message: 'Gagal menghapus data Ujian', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_tests')
                                .update([
                                    newData
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menghapus data Ujian'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            // console.log(exam)
            // const { error } = await supabase
            //                 .from('exam_schedules_test')
            //                 .delete()
            //                 .eq('exam_schedule_id', props.schedule_id)
            //                 .eq('exam_test_id', exam.id)

            // const { data: schedule, e } = await supabase
            //                 .from('exam_schedule_test')
            //                     .insert([
            //                         {exam_schedule_id: props.schedule_id, exam_test_id: exam.id }
            //                     ])
            //                     .select()
            // const { school, e } = await supabase
            // .from('exam_schedule_schools')
            // .insert([
            //     { exam_schedule_id: schedule[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // props.newSchedule.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menghapus data Ujian'
        response.data= exam[0].id
        return response
    }
}

// export default schedule