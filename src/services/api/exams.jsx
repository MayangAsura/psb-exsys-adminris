// import { useState } from 'react'
// import { useState } from 'react'
import supabase from '../database-server'

export const addExam = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    // if(props.newData.icon){
    //     console.log(props.newData.icon)
    //     // if(props.options.is_image){
    //             // const upload = async (props.question.file, name ) => {
    //             const filepath = `examicon-${Date.now()}`
    //             // const pid = participant.id?participant.id:participant_id
    //             const { data_, error_ } = await supabase
    //                 .storage
    //                 .from('exams/uploads/exams/icon')
    //                 .upload("/" + filepath, props.newData.icon,
    //                 {cacheControl: '3600', upsert: true}
    //                 )
    //             if (error_) {
    //             console.error("Gagal Upload Gambar", error_.message)
    //             return null
    //             }
    //             const { data } = await supabase.storage.from("exams/uploads/exams/icons").getPublicUrl("/" +filepath)
    //             // const data_url = {
    //             // path: data.publicUrl
    //             // }
                
    //             console.log(data.publicUrl)
    //             props.newData.icon = data.publicUrl
    //             console.log('icon',props.newData.icon)

    //             // const { files, error } = await supabase
    //             // .from('exam_test_content_files')
    //             // .insert([
    //             //     { exam_test_id: exam_test_contents[0].exam_test_id, exam_test_content_id: exam_test_contents[0].id, exam_test_content_option_id: exam_test_content_options[0].id, file_url: data.publicUrl, file_type: props.question.file_type, is_question: false},
    //             // ])
    //             // .select()

    //             // if(error_ ){
    //             //     response.error= true
    //             // response.message= 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.'
    //             // response.data= null
    //             // return response
    //             // }
          
    //         // }
    // }
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
        response.message= 'Gagal menambahkan data Ujian'
        response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam)

            const { data: schedule, e } = await supabase
                            .from('exam_schedule_tests')
                                .insert([
                                    {exam_schedule_id: props.schedule_id, exam_test_id: exam[0].id }
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
        response.message= 'Berhasil menambahkan data Ujian'
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
        let inv = []
        let imp = []
        let curr = []
    // const [inv, setInv] = useState([])
    if(props.lengthPart != 1){

        inv = []
        imp = []
        curr = []
    }
    // if(props.lengthPart == props.index){

    //     let inv = []
    //     let imp = []
    //     let curr = []
    // }
    const response = {error: true, message: "Gagal menambahkan data peserta.", data: {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}}
    // let ti = 0
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log('props', props)

    // if(props.participants){}
    const { data: currParts, error } = await supabase
                            .from('exam_test_participants')
                            .select('*, exam_profiles(regist_number, phone_number), exam_tests(*) ')
                            .eq('exam_profiles.regist_number',props.participants.NO_REGISTRASI)
                            // .eq(`exam_test_id`,props.participants.NO_REGISTRASI)
                            .like('exam_tests.test_code', props.participants.KODE_UJIAN)
                            // .eq('exam_profiles.regist_number')
    // if(imp.includes(props.))
    console.log(currParts, error)
    if(currParts.length > 0){

        console.log('in current data')
        console.log(currParts)
        curr.push({parts: props.participants.NO_REGISTRASI})
        // if(props.index == props.lengthPart){
            response.error= true
            response.message= 'Gagal menambahkan data Peserta'
            response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
        // }
        // return response
        // else {
        //     response.error= true
        //     response.message= 'Berhasil menambahkan data Peserta'
        //     response.data= exam[0].id
        // }
        
    }else{
        const { data: appl, e } = await supabase
                            .from('applicants')
                            .select("*")
                            .eq('regist_number', props.participants.NO_REGISTRASI)

                                // .insert([
                                //     props.participants
                                // ])
                                // .select()
    if(!appl || e){
        console.log('in peserta not found')
        // setInv([...inv, {id: appl[0].id}])
        inv.push({parts: props.participants.NO_REGISTRASI})
        // setInv([...inv, {id: appl[0].id}])
        // if(props.index == props.lengthPart){
            response.error= true
            response.message= 'Data Peserta tidak ditemukan'
            response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
        // }
        // return response
        
    }else{
        const { data: ext, e } = await supabase
                            .from('exam_tests')
                            .select("*")
                            .like('test_code', `%${(props.participants.KODE_UJIAN)}`)

        if(!ext || e) {
            console.log('in exam not found')
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            inv.push({parts: props.participants.NO_REGISTRASI})
            // if(props.index == props.lengthPart){
                response.error= true
                response.message= 'Data Ujian tidak ditemukan'
                response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
            return response
            // }
            // return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            const { data: app, errapp } = await supabase
                            .from('applicants')
                            .select('id, full_name, phone_number, regist_number, participants(pob, home_address, participant_father_data(father_name), participant_mother_data(mother_name)) ')
                            .eq('regist_number', props.participants.NO_REGISTRASI)
                            // .or('')
                                // .se([
                                //     {exam_schedule_id: schedule.id, exam_test_id: exam.id }
                                // ])
                                // .select()
        if(!app || e) {
            console.log('in applicant not found')
            inv.push({parts: props.participants.NO_REGISTRASI})
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            // if(props.index == props.lengthPart){

                response.error= true
                response.message= 'Data Peserta tidak ditemukan'
                response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
            // }
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{

            const { data: exProf1, errprof1 } = await supabase
                        .from('exam_profiles')
                        .select('*')
                        .eq('regist_number', props.participants.NO_REGISTRASI)
                            // .select()   
                            // [
                            //     {appl_id: app[0]?.id, full_name: app[0]?.full_name, phone_number: app[0]?.phone_number, regist_number: app[0]?.regist_number}
                            //     // {exam_schedule_id: schedule.id, exam_test_id: exam.id }
                            // ]
                            const { data: exProf, errprof } = await supabase
                                            .from('exam_profiles')
                                            .insert([
                                                    {appl_id: app[0]?.id, full_name: app[0]?.full_name, phone_number: app[0]?.phone_number, regist_number: app[0]?.regist_number}
                                                    // {exam_schedule_id: schedule.id, exam_test_id: exam.id }
                                                ])
                                                .select()
        // if(exProf &&){}         
        if(!exProf1 && !exProf){
            inv.push({parts: props.participants.NO_REGISTRASI})
            console.log('in error add to profile error')
            console.log(inv, props.participants.NO_REGISTRASI)
            // if(props.index == props.lengthPart){
                
                response.error= true
                response.message= 'Gagal menambahkan data Profil Peserta'
                response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
                return response
            // }
        }else{

            const newPar = {
                appl_id: app[0].id,
                exam_test_id: ext[0].id
            }
    
    
            // const response = {error: true, message: 'Gagal menambahkan data Peserta', data: null }
            const { data: exam, error } = await supabase
                                .from('exam_test_participants')
                                    .insert([
                                        newPar
                                    ])
                                    .select()
    
    
            console.log(exam)                                
            if(!exam) {
                // imp.push({parts: props.participants.NO_REGISTRASI})
                console.log('in error add to participant')
                // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
                 response.error= true
            response.message= 'Gagal menambahkan data Peserta'
            response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
                return response
                // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
            }else{
                console.log('exam', exam)
                imp.push({parts: props.participants.NO_REGISTRASI})
                // exam.map(e => {

                    response.error= false
                response.message= 'Berhasil menambahkan data Peserta'
                response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
    
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
                response.data= {id: exam[0].id, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
            }else {
                response.error= false
                response.message= 'Berhasil menambahkan data Peserta'
                response.data= {id: null, invalidData: inv.length>0? inv : [], alreadyImp: curr, importedData: imp}
                // response.data= exam[0].id
            }
            return response
            
        }
        }                       
    }
        }
                                // const prof = {

            // }     
        
        }

        
    }
    console.log('final res', response)
    
    return response
}

export const deleteParticipant = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const newData = {appl_id:props.pid, deleted_at: new Date().toISOString()}
    const response = {error: true, message: 'Gagal menghapus data Peserta', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_test_participants')
                                .delete()
                                // .update(
                                //     {appl_id:props.pid, deleted_at: new Date().toISOString()}
                                // )
                                .eq('appl_id', props.pid)
                                .eq('exam_test_id', props.exam_id)
                                // .select()
        console.log(exam)                                
        if(error) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menghapus data Peserta'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
        //     const { data: exam, error } = await supabase
        //                     .from('exam_profiles')
        //                         .update([
        //                             newData
        //                         ])
        //                         .eq('appl_id', props.appl_id)
        //                         .select()
        // console.log(exam)      

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
        response.message= 'Berhasil menghapus data Peserta'
        response.data= null
        return response
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
                            .from('exam_schedule_tests')
                            .delete()
                            .eq('exam_schedule_id', props.schedule_id)
                            .eq('exam_test_id', exam[0].id)

            const { data: schedule, e } = await supabase
                            .from('exam_schedule_tests')
                                .insert([
                                    {exam_schedule_id: props.schedule_id, exam_test_id: exam[0].id }
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