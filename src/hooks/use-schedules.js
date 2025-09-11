import { useForm } from "react-hook-form";

import { defaultLoginValues, loginSchema } from "../schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import Swal from "../../utils/Swal";
import { useState } from "react";
// import { useSonner } from "@/hooks/use-sonner";
// import { useRoutes } from "react-router-dom";
// import { useRouter } from "next/navigation";

const useLogin = () => {
  // const { sonner } = useSonner();
  // const { replace } = useRoutes();
  // const [modal_data, setmodal_data] = useState({
  //   title: "Login Berhasil",
  //   message: "Mengarahkan ke halaman pengisian formulir.",
  //   text: "OK",
  //   url: "/home"
  // })
  const [results, setResults] = useState({code: '01', data: null})
  // let results
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  const { mutate: onLogin, isPending } = useMutation({
    mutationFn: (data) => {
      return ScheduleService.create({name: data.name, started_at: data.started_at, ended_at: data.ended_at, max_participants:data.max_participants
        , school_id: data.school_id});
    },
    onSuccess: (data) => {

      if(data){
        // {modal_show && (xx
        setResults({...results, code: '00', data: data})

        // localStorage.setItem('token', data?.token)
        // localStorage.setItem('token-refresh', data?.token_refresh)
        // if (data?.token_refresh) {
        // console.log(data.token_refresh)
        // Cookies.set('token-refresh', data.token_refresh, {
        //     expires: 1, // Expires in 1 day
        //     secure: false, // Secure in production
        //     sameSite: 'strict', // CSRF protection
        //     path: '/' // Accessible across entire site
        // });
        // }

        // navigate('/home')

        //   const token = Cookies.get('token-refresh')
        // // }
        // // results = data
        // console.log('results use login', results)
        // <Swal dataModal={modal_data}  />
          // setDestroy={setDestroy}
        // )}
        // navigate("/home");
      }
      // sonner.success("Login berhasil!");

      // Redirect to dashboard
    },
    onError: (error) => {
      // sonner.error((error).message || "Login gagal. Silakan coba lagi.");
    },
  });

  const onSubmit = (data) => {
    onLogin(data);
  };

  // const results = () => {
  //   return 
  // }

  return {
    onSubmit,
    form,
    results,
    loading: isPending,
  };
};

export { useLogin };

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   schedulesefaultValues,
// //   UserProfileFormData,
//   schedulesSchema,
// } from "../schemas/schedules";
// import useUserStore from "@/stores/user";
// import {useSchedules} from "../hooks/use-schedules"
// import supabase from "@/services/database-server";
// // import { supabase } from "@/lib/supabase/client";
// import { useSonner } from "@/hooks/use-sonner";
// import { QUERIES } from "@/configs/tanstack";

// export function useSchedules() {
//   const queryClient = useQueryClient();
//   const { user } = useUserStore();
//   const { sonner } = useSonner();

//   // Profile form
//   const profileForm = useForm({
//     resolver: zodResolver(userProfileSchema),
//     defaultValues: userProfileDefaultValues,
//     mode: "onSubmit",
//   });

//   // Update profile mutation
//   const addScheduleMutation = useMutation({
//     mutationFn: async (data) => {
//       if (!user) throw new Error("User not found");

//       const { error } = await supabase
//         .from("users")
//         .update({
//           fullname: data.fullname,
//           email: data.email,
//           nickname: data.nickname || null,
//           birth_place: data.birth_place || null,
//           birth_date: data.birth_date || null,
//           phone_number: data.phone_number || null,
//           gender: data.gender || null,
//           address: data.address || null,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", user.id);

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [QUERIES.USER.UPDATE_USER] });
//       sonner.success("Berhasil menambahkan jadwal");
//     },
//     onError: (error) => {
//       sonner.error(`Gagal menambahkan jadwal: ${error.message}`);
//     },
//   });

//   const handleAddSchedule = (data) => {
//     updateProfileMutation.mutate(data);
//   };

//   // Update profile form values when user data is loaded
//   useEffect(() => {
//     if (user) {
//       profileForm.reset({
//         fullname: user.fullname,
//         email: user.email,
//         nickname: user.nickname || "",
//         birth_place: user.birth_place || "",
//         birth_date: user.birth_date || "",
//         phone_number: user.phone_number || "",
//         gender: user.gender ?? "",
//         address: user.address || "",
//       });
//     }
//   }, [user, profileForm]);

//   return {
//     user,
//     profileForm,
//     handleUpdateProfile,
//     isUpdatingProfile: updateProfileMutation.isPending,
//   };
// }
