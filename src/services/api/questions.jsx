// import { useState } from 'react'
import supabase from '../database-server'

export const addQuestion = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props) 
    const response = {error: true, message: 'Gagal menambahkan data Pertanyaan', data: null }
    const { data: exam_test_contents, error } = await supabase
                            .from('exam_test_contents')
                                .insert([
                                    props.question
                                ])
                                .select()
        console.log(exam_test_contents)
        if(props.is_image){
            // const upload = async (props.question.file, name ) => {
            const filepath = `${exam_test_contents[0].id.subtring(0,5)}-${Date.now()}`
            // const pid = participant.id?participant.id:participant_id
            const { data_, error_ } = await supabase
                .storage
                .from('exams/uploads/questions')
                .upload("/" + filepath, props.question.file,
                {cacheControl: '3600', upsert: true}
                )
            if (error_) {
            console.error("Gagal Upload Gambar", error_.message)
            return null
            }
            const { data } = await supabase.storage.from("exams/uploads/questions").getPublicUrl("/" +filepath)
            const data_url = {
            path: data.publicUrl
            }
            console.log(data.publicUrl)

            const { files, error } = await supabase
            .from('exam_test_content_files')
            .insert([
                { exam_test_id: exam_test_contents[0].exam_test_id, exam_test_content_id: exam_test_contents[0].exam_test_content_id, file_url: data.publicUrl, file_type: props.question.file_type, is_question: false },
            ])
            .select()

            if(error ){
                response.error= true
            response.message= 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.'
            response.data= null
            return response
            }
          
            // setBerkasUrl(data.publicUrl)
            // setBerkasUrl((data.publicUrl).toString())
            // if(name == "Bird-Certificate"){
            //   berkasUrl.a = data.publicUrl.toString()
            // }
            // if(name == "KK"){
            //   berkasUrl.b = data.publicUrl.toString()
            // }
            // if(name == "Parent-KTP"){
            //   berkasUrl.c = data.publicUrl.toString()
            // }
            // if(name == "Pas-Photo"){
            //   berkasUrl.d = data.publicUrl.toString()
            // }
            // if(name == "Surat-Kesanggupan"){
            //   berkasUrl.e = data.publicUrl.toString()
            // }
            // if(name == "Syahadah"){
            //   berkasUrl.f = data.publicUrl.toString()
            // }
            // if(name == "Photo-Sampul-Ijazah"){
            //   berkasUrl.g = data.publicUrl.toString()
            // }
            // berkasUrl.a = data.publicUrl.toString()
            // console.log(berkasUrl)
        //     return data.publicUrl
        //     // const { data, error } = await supabase.storage.from('participant-documents').createSignedUrl(participant_id+ "/" +filepath, 3600)

        //     const path = {
        //       signedUrl: data.signedUrl.toString()?? ""
        //     } 

        //     if (data) {
        //       console.log('signedUrl > ', data.signedUrl)
        //       console.log('data_ > ', data_)
        //       return path
        //     }
        //   }
        }                              
        if(!exam_test_contents) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menambahkan data Pertanyaan'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam_test_contents)
            const options = {...props.options, exam_test_content_id : exam_test_contents[0].id}
            const { data: exam_test_content_options, error } = await supabase
                            .from('exam_test_content_options')
                                .insert([
                                    options
                                ])
                                // .eq('id', props.id)
                                .select()


            if(props.options.is_image){
                // const upload = async (props.question.file, name ) => {
                const filepath = `${exam_test_content_options[0].id.subtring(0,5)}-${Date.now()}`
                // const pid = participant.id?participant.id:participant_id
                const { data_, error_ } = await supabase
                    .storage
                    .from('exams/uploads/questions')
                    .upload("/" + filepath, props.question.file,
                    {cacheControl: '3600', upsert: true}
                    )
                if (error_) {
                console.error("Gagal Upload Gambar", error_.message)
                return null
                }
                const { data } = await supabase.storage.from("exams/uploads/questions").getPublicUrl("/" +filepath)
                // const data_url = {
                // path: data.publicUrl
                // }
                console.log(data.publicUrl)

                const { files, error } = await supabase
                .from('exam_test_content_files')
                .insert([
                    { exam_test_id: exam_test_contents[0].exam_test_id, exam_test_content_id: exam_test_contents[0].id, exam_test_content_option_id: exam_test_content_options[0].id, file_url: data.publicUrl, file_type: props.question.file_type, is_question: false},
                ])
                .select()

                if(error ){
                    response.error= true
                response.message= 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.'
                response.data= null
                return response
                }
          
            }
            
            // setBerkasUrl(data.publicUrl)
            // setBerkasUrl((data.publicUrl).toString())
            // if(name == "Bird-Certificate"){
            //   berkasUrl.a = data.publicUrl.toString()
            // }
            // if(name == "KK"){
            //   berkasUrl.b = data.publicUrl.toString()
            // }
            // if(name == "Parent-KTP"){
            //   berkasUrl.c = data.publicUrl.toString()
            // }
            // if(name == "Pas-Photo"){
            //   berkasUrl.d = data.publicUrl.toString()
            // }
            // if(name == "Surat-Kesanggupan"){
            //   berkasUrl.e = data.publicUrl.toString()
            // }
            // if(name == "Syahadah"){
            //   berkasUrl.f = data.publicUrl.toString()
            // }
            // if(name == "Photo-Sampul-Ijazah"){
            //   berkasUrl.g = data.publicUrl.toString()
            // }
            // berkasUrl.a = data.publicUrl.toString()
            // console.log(berkasUrl)
        //     return data.publicUrl
        //     // const { data, error } = await supabase.storage.from('participant-documents').createSignedUrl(participant_id+ "/" +filepath, 3600)

        //     const path = {
        //       signedUrl: data.signedUrl.toString()?? ""
        //     } 

        //     if (data) {
        //       console.log('signedUrl > ', data.signedUrl)
        //       console.log('data_ > ', data_)
        //       return path
        //     }
        //   }
         
            // const { school, e } = await supabase
            // .from('exam_schedule_schools')
            // .insert([
            //     { exam_schedule_id: schedule[0].id, school_id: props.school_id },
            // ])
            // .select()

            if(error){
                return response
            }

        // props.newSchedule.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menambahkan data Pertanyaan'
        response.data= exam_test_contents[0].id
        return response
    }
}

export const updateQuestion = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal memperbarui data Ujian', data: null }
    const { data: exam_test_contents, error } = await supabase
                            .from('exam_test_contents')
                                .update([
                                    props.question
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam_test_contents)                                
        if(!exam_test_contents) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal memperbarui data Jadwal'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam_test_contents)
            const { data: o1, error1 } = await supabase
                            .from('exam_test_content_options')
                                .delete()
                                .eq('exam_test_content_id', exam_test_contents[0].id)
            const { data: o2, error2 } = await supabase
                            .from('exam_test_content_options')
                                .insert([
                                    props.options
                                ])
                                // .eq('id', props.id)
                                .select()
            // const { school, e } = await supabase
            // .from('exam_schedule_schools')
            // .insert([
            //     { exam_schedule_id: schedule[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(error2){
            //     return response
            // }

        // props.newSchedule.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menambahkan data Jadwal'
        response.data= exam_test_contents[0].id
        return response
    }
}

export const deleteQuestion = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal menghapus data Pertanyaan', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_test_contents')
                                .update([
                                    props.question
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menghapus data Pertanyaan'
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
        response.message= 'Berhasil menghapus data Pertanyaan'
        response.data= null
        return response
    }
}

// export default schedule