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
                                    props.exam
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
        response.message= 'Berhasil menambahkan data Jadwal'
        response.data= exam[0].id
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
                                    props.exam
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal memperbarui data Jadwal'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam)
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
        response.message= 'Berhasil menambahkan data Jadwal'
        response.data= exam[0].id
        return response
    }
}

// export default schedule