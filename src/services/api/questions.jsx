// import { useState } from 'react'
import supabase from '../database-server'

export const addQuestion = async (props) => {
    console.log('props', props) 
    
    const { options, ...questions } = props.questions;
    const response = { 
        error: true, 
        message: 'Gagal menambahkan data Pertanyaan', 
        data: null 
    };

    // Input validation
    const validateInput = (questions, options) => {
        const errors = [];
        
        if (!questions.question || questions.question.trim() === '') {
            errors.push('Pertanyaan wajib diisi');
        }
        
        // if (!questions.bank_code || questions.bank_code.trim() === '') {
        //     errors.push('Bank code is required');
        // }
        
        if (!questions.score || questions.score < 0) {
            errors.push('Valid score is required');
        }
        
        if (questions.question_type === 'MC' && (!options || options.length === 0)) {
            errors.push('Multiple choice questions require options');
        }
        
        return errors;
    };

    try {
        // Validate input
        const validationErrors = validateInput(questions, options);
        if (validationErrors.length > 0) {
            response.message = 'Data tidak valid: ' + validationErrors.join(', ');
            return response;
        }

        // Step 1: Insert the main question
        const { data: exam_test_contents, error: questionError } = await supabase
            .from('exam_test_contents')
            .insert([questions])
            .select();

        console.log('Exam test contents:', exam_test_contents);

        if (questionError || !exam_test_contents || exam_test_contents.length === 0) {
            response.error = true;
            response.message = 'Gagal menambahkan data Pertanyaan: ' + (questionError?.message || 'Unknown error');
            response.data = null;
            return response;
        }

        const questionId = exam_test_contents[0].id;
        const examTestId = exam_test_contents[0].exam_test_id;

        // Step 2: Insert options
        if (options && options.length > 0) {
            // Transform options to include question ID
            const optionsToInsert = options.map((option, index) => ({
                exam_test_id: examTestId,
                option: option.option || option, // Handle both object and string formats
                type: option.type || 'MC',
                exam_test_content_id: questionId,
                order: index + 1 // Add order for proper sequencing
            }));

            console.log('Options to insert:', optionsToInsert);

            const { data: exam_test_content_options, error: optionsError } = await supabase
                .from('exam_test_content_options')
                .insert(optionsToInsert)
                .select();

            if (optionsError) {
                console.error("Error inserting options:", optionsError);
                response.error = true;
                response.message = 'Gagal menambahkan opsi pertanyaan: ' + optionsError.message;
                response.data = null;
                return response;
            }

            console.log('Inserted options:', exam_test_content_options);

            // Step 3: Find and set the correct answer - IMPROVED VERSION
            if (props.questions.answer) {
                try {
                    // More robust answer matching
                    const correctOption = exam_test_content_options.find(option => {
                        // Exact match for option text
                        if (option.option.trim().toLowerCase() === props.questions.answer.toString().trim().toLowerCase()) {
                            return true;
                        }
                        // Match by order/index (if OPTION_ANSWER was 1-5)
                        const optionIndex = exam_test_content_options.indexOf(option);
                        if (optionIndex + 1 === parseInt(props.questions.answer)) {
                            return true;
                        }
                        return false;
                    });

                    if (correctOption) {
                        console.log('Found correct option:', correctOption);
                        
                        const { error: updateError } = await supabase
                            .from('exam_test_contents')
                            .update({ 
                                exam_content_option_id: correctOption.id 
                            })
                            .eq('id', questionId);

                        if (updateError) {
                            console.error("Error setting correct answer:", updateError);
                            // Don't fail the entire operation if setting answer fails
                        } else {
                            console.log('Successfully set correct answer');
                        }
                    } else {
                        console.warn('Correct answer not found in options. Answer:', props.questions.answer);
                        console.warn('Available options:', exam_test_content_options.map(opt => opt.option));
                    }
                } catch (answerError) {
                    console.error("Error setting correct answer:", answerError);
                    // Continue even if answer setting fails
                }
            }
        }

        // Success response
        response.error = false;
        response.message = 'Berhasil menambahkan data Pertanyaan';
        response.data = questionId;
        return response;

    } catch (error) {
        console.error("Unexpected error in addQuestion:", error);
        response.error = true;
        response.message = 'Terjadi kesalahan tak terduga: ' + error.message;
        response.data = null;
        return response;
    }
};
// export const addQuestion = async (props) => {
//     console.log('props', props) 
    
//     const { options, ...questions } = props.questions;
//     const response = { 
//         error: true, 
//         message: 'Gagal menambahkan data Pertanyaan', 
//         data: null 
//     };

//     try {
//         // Step 1: Insert the main question
//         const { data: exam_test_contents, error: questionError } = await supabase
//             .from('exam_test_contents')
//             .insert([questions])
//             .select();

//         console.log('Exam test contents:', exam_test_contents);

//         if (questionError || !exam_test_contents || exam_test_contents.length === 0) {
//             response.error = true;
//             response.message = 'Gagal menambahkan data Pertanyaan: ' + (questionError?.message || 'Unknown error');
//             response.data = null;
//             return response;
//         }

//         const questionId = exam_test_contents[0].id;
//         const examTestId = exam_test_contents[0].exam_test_id;

//         // Step 2: Handle question image if exists
//         // if (props.is_image && props.question?.file) {
//         //     try {
//         //         const fileExtension = props.question.file.name.split('.').pop();
//         //         const filepath = `${questionId.substring(0, 5)}-${Date.now()}.${fileExtension}`;
                
//         //         const { error: uploadError } = await supabase.storage
//         //             .from('exams/uploads/questions')
//         //             .upload(filepath, props.question.file, {
//         //                 cacheControl: '3600', 
//         //                 upsert: false
//         //             });

//         //         if (uploadError) {
//         //             console.error("Gagal Upload Gambar", uploadError.message);
//         //             response.error = true;
//         //             response.message = 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.';
//         //             response.data = null;
//         //             return response;
//         //         }

//         //         const { data: urlData } = await supabase.storage
//         //             .from("exams/uploads/questions")
//         //             .getPublicUrl(filepath);

//         //         console.log('Uploaded image URL:', urlData.publicUrl);

//         //         const { error: fileError } = await supabase
//         //             .from('exam_test_content_files')
//         //             .insert([{
//         //                 exam_test_id: examTestId,
//         //                 exam_test_content_id: questionId,
//         //                 file_url: urlData.publicUrl,
//         //                 file_type: props.question.file_type || 'image',
//         //                 is_question: true // This should be true for question images
//         //             }]);

//         //         if (fileError) {
//         //             console.error("Gagal menyimpan data file:", fileError);
//         //             // Continue with question creation even if file save fails
//         //         }
//         //     } catch (fileUploadError) {
//         //         console.error("Error in file upload process:", fileUploadError);
//         //         // Continue with question creation even if file upload fails
//         //     }
//         // }

//         // Step 3: Insert options
//         if (options && options.length > 0) {
//             // Transform options to include question ID
//             const optionsToInsert = options.map((option, index) => ({
//                 exam_test_id : option.exam_test_id,
//                 option: option.option || option, // Handle both object and string formats
//                 type: option.type || 'MC',
//                 exam_test_content_id: questionId,
//                 order: index + 1 // Add order for proper sequencing
//                 // is_correct: option.is_correct || false
//             }));

//             console.log('Options to insert:', optionsToInsert);

//             const { data: exam_test_content_options, error: optionsError } = await supabase
//                 .from('exam_test_content_options')
//                 .insert(optionsToInsert)
//                 .select();

//             if (optionsError) {
//                 console.error("Error inserting options:", optionsError);
//                 response.error = true;
//                 response.message = 'Gagal menambahkan opsi pertanyaan: ' + optionsError.message;
//                 response.data = null;
//                 return response;
//             }

//             console.log('Inserted options:', exam_test_content_options);

//             // Step 4: Find and set the correct answer
//             if (props.questions.answer) {
//                 try {
//                     // Find the option that matches the answer
//                     const correctOption = exam_test_content_options.find(option => 
//                         option.option === props.questions.answer || 
//                         option.id === props.questions.answer
//                     );

//                     if (correctOption) {
//                         console.log('Found correct option:', correctOption);
                        
//                         // Update the question with the correct option ID
//                         const { error: updateError } = await supabase
//                             .from('exam_test_contents')
//                             .update({ 
//                                 exam_content_option_id: correctOption.id 
//                             })
//                             .eq('id', questionId);

//                         if (updateError) {
//                             console.error("Error setting correct answer:", updateError);
//                         } else {
//                             console.log('Successfully set correct answer');
//                         }
//                     } else {
//                         console.warn('Correct answer not found in options');
//                     }
//                 } catch (answerError) {
//                     console.error("Error setting correct answer:", answerError);
//                 }
//             }

//             // Step 5: Handle option images if any
//             // if (props.options?.is_image) {
//             //     for (let i = 0; i < options.length; i++) {
//             //         const option = options[i];
//             //         if (option.file) {
//             //             try {
//             //                 const optionId = exam_test_content_options[i]?.id;
//             //                 if (!optionId) continue;

//             //                 const fileExtension = option.file.name.split('.').pop();
//             //                 const filepath = `${optionId.substring(0, 5)}-${Date.now()}.${fileExtension}`;

//             //                 const { error: optionUploadError } = await supabase.storage
//             //                     .from('exams/uploads/questions')
//             //                     .upload(filepath, option.file, {
//             //                         cacheControl: '3600',
//             //                         upsert: false
//             //                     });

//             //                 if (optionUploadError) {
//             //                     console.error("Gagal Upload Gambar Opsi", optionUploadError.message);
//             //                     continue; // Continue with other options
//             //                 }

//             //                 const { data: optionUrlData } = await supabase.storage
//             //                     .from("exams/uploads/questions")
//             //                     .getPublicUrl(filepath);

//             //                 const { error: optionFileError } = await supabase
//             //                     .from('exam_test_content_files')
//             //                     .insert([{
//             //                         exam_test_id: examTestId,
//             //                         exam_test_content_id: questionId,
//             //                         exam_test_content_option_id: optionId,
//             //                         file_url: optionUrlData.publicUrl,
//             //                         file_type: option.file_type || 'image',
//             //                         is_question: false // This is for option images
//             //                     }]);

//             //                 if (optionFileError) {
//             //                     console.error("Gagal menyimpan data file opsi:", optionFileError);
//             //                 }
//             //             } catch (optionFileError) {
//             //                 console.error("Error in option file upload:", optionFileError);
//             //             }
//             //         }
//             //     }
//             // }
//         }

//         // Success response
//         response.error = false;
//         response.message = 'Berhasil menambahkan data Pertanyaan';
//         response.data = questionId;
//         return response;

//     } catch (error) {
//         console.error("Unexpected error in addQuestion:", error);
//         response.error = true;
//         response.message = 'Terjadi kesalahan tak terduga: ' + error.message;
//         response.data = null;
//         return response;
//     }
// };

export const addQuestion_ = async (props) => {
    // name, description, started_at, ended_at, scheme, type, location, room, is_random_question, is_random_answer, max_participants 
    // name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: ""
    console.log('props', props) 
    const {options, ...questions} = props.questions
    const response = {error: true, message: 'Gagal menambahkan data Pertanyaan', data: null }
    const { data: exam_test_contents, error } = await supabase
                            .from('exam_test_contents')
                                .insert([
                                    questions
                                ])
                                .select()
        console.log(exam_test_contents)
        // if(props.is_image){
        //     // const upload = async (props.question.file, name ) => {
        //     const filepath = `${exam_test_contents[0].id.subtring(0,5)}-${Date.now()}`
        //     // const pid = participant.id?participant.id:participant_id
        //     const { data_, error_ } = await supabase
        //         .storage
        //         .from('exams/uploads/questions')
        //         .upload("/" + filepath, props.question.file,
        //         {cacheControl: '3600', upsert: true}
        //         )
        //     if (error_) {
        //     console.error("Gagal Upload Gambar", error_.message)
        //     return null
        //     }
        //     const { data } = await supabase.storage.from("exams/uploads/questions").getPublicUrl("/" +filepath)
        //     const data_url = {
        //     path: data.publicUrl
        //     }
        //     console.log(data.publicUrl)

        //     const { files, error } = await supabase
        //     .from('exam_test_content_files')
        //     .insert([
        //         { exam_test_id: exam_test_contents[0].exam_test_id, exam_test_content_id: exam_test_contents[0].exam_test_content_id, file_url: data.publicUrl, file_type: props.question.file_type, is_question: false },
        //     ])
        //     .select()

        //     if(error ){
        //         response.error= true
        //     response.message= 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.'
        //     response.data= null
        //     return response
        //     }
          
        //     // setBerkasUrl(data.publicUrl)
        //     // setBerkasUrl((data.publicUrl).toString())
        //     // if(name == "Bird-Certificate"){
        //     //   berkasUrl.a = data.publicUrl.toString()
        //     // }
        //     // if(name == "KK"){
        //     //   berkasUrl.b = data.publicUrl.toString()
        //     // }
        //     // if(name == "Parent-KTP"){
        //     //   berkasUrl.c = data.publicUrl.toString()
        //     // }
        //     // if(name == "Pas-Photo"){
        //     //   berkasUrl.d = data.publicUrl.toString()
        //     // }
        //     // if(name == "Surat-Kesanggupan"){
        //     //   berkasUrl.e = data.publicUrl.toString()
        //     // }
        //     // if(name == "Syahadah"){
        //     //   berkasUrl.f = data.publicUrl.toString()
        //     // }
        //     // if(name == "Photo-Sampul-Ijazah"){
        //     //   berkasUrl.g = data.publicUrl.toString()
        //     // }
        //     // berkasUrl.a = data.publicUrl.toString()
        //     // console.log(berkasUrl)
        // //     return data.publicUrl
        // //     // const { data, error } = await supabase.storage.from('participant-documents').createSignedUrl(participant_id+ "/" +filepath, 3600)

        // //     const path = {
        // //       signedUrl: data.signedUrl.toString()?? ""
        // //     } 

        // //     if (data) {
        // //       console.log('signedUrl > ', data.signedUrl)
        // //       console.log('data_ > ', data_)
        // //       return path
        // //     }
        // //   }
        // }                              
        if(error || !exam_test_contents || exam_test_contents.length ==0) {
            // {error: true, message: 'Gagal menambahkan data Ujian', data: null }
            response.error= true
            response.message= 'Gagal menambahkan data Pertanyaan'
            response.data= null
            return response
            // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
        }else{
            console.log(exam_test_contents)
            // const options = {...props.options, exam_test_content_id : exam_test_contents[0].id}
            // const options_ = options.map((value) => ({...value, exam_test_content_id : exam_test_contents[0].id}))
            const newOptions = options.map((value) => {return {option: value, exam_test_content_id : exam_test_contents[0].id, type: 'MC'}})
            // options.m
            console.log('options',newOptions)
            const { data: exam_test_content_options, error } = await supabase
                            .from('exam_test_content_options')
                                .insert([
                                    newOptions[0]
                                ])
                                // .eq('id', props.id)
                                .select()

                                if(exam_test_content_options || exam_test_content_options.length>0 || Object.values(exam_test_content_options).filter(value => value == props.questions.answer)[0] ){
                                    const option_id = Object.values(exam_test_content_options).filter(value => value == props.questions.answer)[0]
                                    console.log('option_id', option_id)
                                    const { data: exam_test_contents, error } = await supabase
                            .from('exam_test_contents')
                                .update([
                                    {exam_test_content_option_id: option_id}
                                ])
                                .eq('id', exam_test_contents[0].id)
                                .select()
                                }

            // if(props.options?.is_image){
            //     // const upload = async (props.question.file, name ) => {
            //     const filepath = `${exam_test_content_options[0].id.subtring(0,5)}-${Date.now()}`
            //     // const pid = participant.id?participant.id:participant_id
            //     const { data_, error_ } = await supabase
            //         .storage
            //         .from('exams/uploads/questions')
            //         .upload("/" + filepath, props.question.file,
            //         {cacheControl: '3600', upsert: true}
            //         )
            //     if (error_) {
            //     console.error("Gagal Upload Gambar", error_.message)
            //     return null
            //     }
            //     const { data } = await supabase.storage.from("exams/uploads/questions").getPublicUrl("/" +filepath)
            //     // const data_url = {
            //     // path: data.publicUrl
            //     // }
            //     console.log(data.publicUrl)

            //     const { files, error } = await supabase
            //     .from('exam_test_content_files')
            //     .insert([
            //         { exam_test_id: exam_test_contents[0].exam_test_id, exam_test_content_id: exam_test_contents[0].id, exam_test_content_option_id: exam_test_content_options[0].id, file_url: data.publicUrl, file_type: props.question.file_type, is_question: false},
            //     ])
            //     .select()

            //     if(error ){
            //         response.error= true
            //     response.message= 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.'
            //     response.data= null
            //     return response
            //     }
          
            // }
           

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
                                    {deleted_at : new Date().toISOString()}
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