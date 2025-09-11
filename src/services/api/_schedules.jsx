// import { supabase } from "@/lib/supabase/client";
// import { AuthReturn } from "../types";
// import PATHS from "@/configs/route";
import { email } from 'zod';
import axios from '../../api/local-server'
// import axios from '../../api/prod-server'
import Cookies from 'js-cookie'
import supabase from '../../client/supabase_client';
// import supabase from "../../client/supabase_client";

export class ScheduleService {
  static async create({name, started_at, ended_at, max_participants, school_id}){
    // const { error, data: userData } = await supabase.auth.signInWithPassword({
    //   email: email,
    //   password: password,
    // });

    // const response = {error: true, message: 'Gagal menambahkan data Jadwal', data: null }
    const { data: schedule, error } = await supabase
                            .from('exam_schedules')
                                .insert([
                                    {name, started_at, ended_at, max_participants}
                                ])
                                .select()
    if(error) {
        return false
        // response.map(response => {...response, error: false, message: 'Berhasil menambahkan data Jadwal', data: exam_schedules}) 
    }else{
        console.log(schedule)
        const { school, e } = await supabase
        .from('exam_schedule_schools')
        .insert([
            { exam_schedule_id: schedule[0].id, school_id: school_id },
        ])
        .select()

        if(e){
            return false
        }

        // // props.newSchedule.school_id = props.school_id

        // response.error= false
        // response.message= 'Berhasil menambahkan data Jadwal'
        // response.data= schedule[0].id
        return schedule
    }

    // const config = {
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     withCredentials: true
    // }
          // console.log(config)
          // ${backendURL}
    //login api          
    // const { data } = await axios.post(
    //     `api/auth/login`,
    //     { username, password },
    //     config
    // )
    // console.log('sebelum', data)
    // store user's token in local storage

    if (data?.status == 400) {
    //   if (error.code === "invalid_credentials") {
    //     throw new Error("Email atau password salah.");
    //   }
    //   if (error.code === "user_not_found") {
    //     throw new Error(
    //       "Pengguna tidak ditemukan. Silakan daftar terlebih dahulu."
    //     );
    //   }
    //   if (error.code === "too_many_requests") {
    //     throw new Error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
    //   }
      throw new Error(data?.message);
    }

    return data;
  }

  static async register(
            email,
            full_name,
            gender,
            media,
            password,
            phone_number,
            school_id,
            subschool
        ){
    const { data: data_appl, error } = await supabase.rpc("add_new_applicant", {
            _email : email,
            _full_name : full_name,
            _gender : gender,
            _media : media,
            _password : password,
            _phone_number : phone_number,
            _school_id : parseInt(school_id),
            _subschool : subschool
          });

    if (error) {
      throw new Error("Pendaftaran gagal.");
    }

    return data_appl
  }
//   static async logout(): Promise<void> {
//     const { error } = await supabase.auth.signOut();

//     if (error) {
//       throw new Error("Gagal logout.");
//     }
//   }

//   static async forgotPassword(email: string): Promise<void> {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: window.location.origin + PATHS.PUBLIC.CHANGE_PASSWORD,
//     });

//     if (error) {
//       throw new Error(`Gagal mengirim email reset password: ${error.message}`);
//     }
//   }

//   static async verifyPasswordResetToken(): Promise<boolean> {
//     const {
//       data: { session },
//       error,
//     } = await supabase.auth.getSession();

//     if (error || !session) {
//       throw new Error(
//         "Token reset password tidak valid atau sudah kedaluwarsa."
//       );
//     }

//     return true;
//   }

//   static async resetPassword(newPassword: string): Promise<void> {
//     const { error } = await supabase.auth.updateUser({
//       password: newPassword,
//     });

//     if (error) {
//       if (error.code === "over_email_send_rate_limit") {
//         throw new Error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
//       }

//       throw new Error(`Gagal mengatur ulang password: ${error.message}`);
//     }
//   }
}
