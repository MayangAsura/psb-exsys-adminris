// import { useState } from 'react'
import supabase from '../database-server'

export const addSchedule = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log('props', props.school_id)
    const response = {error: true, message: 'Gagal menambahkan data Jadwal', data: null }
    const { data: schedule, error } = await supabase
                            .from('exam_schedules')
                                .insert([
                                    {...props.newSchedule}
                                ])
                                .select()
    if(error) {
        return response
        // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
    }else{
        console.log(schedule)
        const { school, e } = await supabase
        .from('exam_schedule_schools')
        .insert([
            { exam_schedule_id: schedule[0].id, school_id: props.school_id },
        ])
        .select()

        if(e){
            return response
        }

        // props.newSchedule.school_id = props.school_id

        response.error= false
        response.message= 'Berhasil menambahkan data Jadwal'
        response.data= schedule[0].id
        return response
    }
}

export const updateSchedule = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal memperbarui data jadwal', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_schedules')
                                .update([
                                    {...props.newSchedule}
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
        response.message= 'Berhasil memperbarui data Jadwal'
        response.data= exam[0].id
        return response
    }
}

export const deleteSchedule = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const newData = {id: props.id, deleted_at: new Date().toISOString()}
    const response = {error: true, message: 'Gagal menghapus data Jadwal', data: null }
    const { data: exam, error } = await supabase
                            .from('exam_schedules')
                                .update([
                                    newData
                                ])
                                .eq('id', props.id)
                                .select()
        console.log(exam)                                
        if(!exam) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menghapus data Jadwal'
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
        response.message= 'Berhasil menghapus data Jadwal'
        response.data= exam[0].id
        return response
    }
}

// export default schedule