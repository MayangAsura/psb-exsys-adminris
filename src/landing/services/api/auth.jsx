import supabase from '../database-server'

export const login = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log(props)
    const response = {error: true, message: 'Gagal menambahkan data Jadwal', data: null }
    const { data: schedule, error } = await supabase
                            .from('exam_schedules')
                                .insert([
                                    props.newSchedule
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