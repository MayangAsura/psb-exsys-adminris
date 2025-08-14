// import { useState } from 'react'
import supabase from '../database-server'

export const addAdmissionAys = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal menambahkan data Jadwal', data: null }
    const { data: admissions, error } = await supabase
                            .from('admissions')
                                .insert([
                                    props.newAdmissionAys
                                ])
                                .select()
    if(error) {
        return response
        // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_Admissionss}) 
    }else{
        // console.log(admissions)
        // const { admission_schools, e } = await supabase
        // .from('admission_schools')
        // .insert([
        //     { admissions_id: admission_schools[0].id, school_id: props.school_id },
        // ])
        // .select()

        // if(e){
        //     return response
        // }

        // props.newAdmissions.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menambahkan data Seleksi'
        response.data= admissions[0].id
        return response
    }
}

export const addAdmissionSchool = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    console.log('in admission school', props)
    
    const response = {error: true, message: 'Gagal menambahkan data Jadwal', data: null }
    const { data: admissions, error } = await supabase
                            .from('admission_schools')
                                .insert([
                                    props.newAdmissionSchool
                                ])
                                .select()
    if(error) {
        return response
        // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_Admissionss}) 
    }else{
        // console.log(admissions)
        // const { admission_schools, e } = await supabase
        // .from('admission_schools')
        // .insert([
        //     { admissions_id: admission_schools[0].id, school_id: props.school_id },
        // ])
        // .select()

        // if(e){
        //     return response
        // }

        // props.newAdmissions.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menambahkan data Seleksi'
        response.data= admissions[0].id
        return response
    }
}

export const updateAdmission = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal memperbarui data PSB', data: null }
    const { data: exam, error } = await supabase
                            .from('admissions')
                                .update([
                                    props.newAdmissionAys
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal memperbarui data PSB'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_Admissionss}) 
        }else{
            // console.log(exam)
            // const { error } = await supabase
            //                 .from('exam_Admissionss_test')
            //                 .delete()
            //                 .eq('exam_Admissions_id', props.Admissions_id)
            //                 .eq('exam_test_id', exam.id)

            // const { data: Admissions, e } = await supabase
            //                 .from('exam_Admissions_test')
            //                     .insert([
            //                         {exam_Admissions_id: props.Admissions_id, exam_test_id: exam.id }
            //                     ])
            //                     .select()
            // const { school, e } = await supabase
            // .from('exam_Admissions_schools')
            // .insert([
            //     { exam_Admissions_id: Admissions[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // props.newAdmissions.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil memperbarui data PSB'
        response.data= exam[0].id
        return response
    }
}
export const updateAdmissions = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal memperbarui data PSB', data: null }
    const { data: exam, error } = await supabase
                            .from('admissions')
                                .upsert([
                                    props.newAdmission
                                ])
                                // .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal memperbarui data PSB'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_Admissionss}) 
        }else{
            // console.log(exam)
            // const { error } = await supabase
            //                 .from('exam_Admissionss_test')
            //                 .delete()
            //                 .eq('exam_Admissions_id', props.Admissions_id)
            //                 .eq('exam_test_id', exam.id)

            // const { data: Admissions, e } = await supabase
            //                 .from('exam_Admissions_test')
            //                     .insert([
            //                         {exam_Admissions_id: props.Admissions_id, exam_test_id: exam.id }
            //                     ])
            //                     .select()
            // const { school, e } = await supabase
            // .from('exam_Admissions_schools')
            // .insert([
            //     { exam_Admissions_id: Admissions[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // props.newAdmissions.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil memperbarui data PSB'
        response.data= exam[0].id
        return response
    }
}
export const updateAdmissionSchool = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal memperbarui Jenjang PSB', data: null }
    const { data: exam, error } = await supabase
                            .from('admissions')
                                .update([
                                    props.newAdmissionSchool
                                ])
                                .eq('admission_id', props.id)
                                .eq('school_id', props.sch_id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal memperbarui Jenjang PSB'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_Admissionss}) 
        }else{
            // console.log(exam)
            // const { error } = await supabase
            //                 .from('exam_Admissionss_test')
            //                 .delete()
            //                 .eq('exam_Admissions_id', props.Admissions_id)
            //                 .eq('exam_test_id', exam.id)

            // const { data: Admissions, e } = await supabase
            //                 .from('exam_Admissions_test')
            //                     .insert([
            //                         {exam_Admissions_id: props.Admissions_id, exam_test_id: exam.id }
            //                     ])
            //                     .select()
            // const { school, e } = await supabase
            // .from('exam_Admissions_schools')
            // .insert([
            //     { exam_Admissions_id: Admissions[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // props.newAdmissions.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil memperbarui Jenjang PSB'
        response.data= exam[0].id
        return response
    }
}

export const deleteAdmission = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const newData = {id: props.id, deleted_at: new Date().toISOString()}
    const response = {error: true, message: 'Gagal menghapus data Seleksi', data: null }
    const { data: exam, error } = await supabase
                            .from('admissions')
                                .update([
                                    newData
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menghapus data PSB'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_Admissionss}) 
        }else{
            // console.log(exam)
            // const { error } = await supabase
            //                 .from('exam_Admissionss_test')
            //                 .delete()
            //                 .eq('exam_Admissions_id', props.Admissions_id)
            //                 .eq('exam_test_id', exam.id)

            // const { data: Admissions, e } = await supabase
            //                 .from('exam_Admissions_test')
            //                     .insert([
            //                         {exam_Admissions_id: props.Admissions_id, exam_test_id: exam.id }
            //                     ])
            //                     .select()
            // const { school, e } = await supabase
            // .from('exam_Admissions_schools')
            // .insert([
            //     { exam_Admissions_id: Admissions[0].id, school_id: props.school_id },
            // ])
            // .select()

            // if(e){
            //     return response
            // }

        // props.newAdmissions.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menghapus data PSB'
        response.data= exam[0].id
        return response
    }
}

// export default Admissions