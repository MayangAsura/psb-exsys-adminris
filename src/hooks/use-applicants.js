// import { useForm } from "react-hook-form";
// import { defaultApplicantValues, applicantSchema } from "../schemas/applicants";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { applicantService } from "../services/api/applicants";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import supabase from "../services/database-server";

// const useApplicants = () => {
//   const navigate = useNavigate();
//   const [results, setResults] = useState({});
//   const [error, setError] = useState(null);
//   const [requestData, setRequestData] = useState({});
//   const [notified, setNotified] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(applicantSchema),
//     defaultValues: defaultApplicantValues,
//     mode: "onChange", // Add mode to trigger validation on change
//   });

//   // Update requestData when form values change
//   useEffect(() => {
//     const subscription = form.watch((value) => {
//       setRequestData(value);
//     });
//     return () => subscription.unsubscribe();
//   }, [form]);

//   const { mutate: onEdit, isPending } = useMutation({
//     mutationFn: async (formData) => {
//       console.log('Submitting data:', formData);
      
//       // Validate form data 
//       try {
//         applicantSchema.parse(formData);
//       } catch (validationError) {
//         console.error('Validation error:', validationError);
//         throw new Error('Data validation failed');
//       }

//       const { data: data_appl, error: supabaseError } = await supabase.rpc("edit_new_applicant", {
//         _email: formData.email,
//         _full_name: formData.full_name,
//         _gender: formData.gender,
//         _media: formData.media,
//         _password: formData.password,
//         _phone_number: formData.phone_number,
//         _school_id: parseInt(formData.school_id),
//         _subschool: formData.subschool
//       });

//       if (supabaseError) {
//         console.error('Supabase error:', supabaseError);
//         throw supabaseError;
//       }

//       return data_appl;
//     },
//     onSuccess: (data) => {
//       if (data) {
//         setResults(data);
//         console.log('Success:', data);

//         if (data.f1 !== '01') {
//           sendNotif(data);
//         }
        
//         // Reset form on successful submission
//         form.reset();
//       }
//     },
//     onError: (error) => {
//       console.error('Mutation error:', error);
//       setError(error.message || "An error occurred");
      
//       // Set form errors based on the error response
//       if (error.message?.includes('email')) {
//         form.setError('email', { type: 'manual', message: error.message });
//       } else if (error.message?.includes('phone')) {
//         form.setError('phone_number', { type: 'manual', message: error.message });
//       }
//     },
//   });

//   const sendNotif = async (_results) => {
//     if (!requestData.phone_number || !requestData.full_name) {
//       console.error('Missing phone number or name for notification');
//       return;
//     }

//     const new_phone_number = '62' + requestData.phone_number.slice(1);
//     const messageData = [{
//       "phone": new_phone_number,
//       "message": `Assalamu'alaikum, Alhamdulillah Ananda ${requestData.full_name} telah terdaftar di Aplikasi PSB RIS TA. 26/27. 
//       No. Pendaftaran: ${_results?.f3}
//       Login Aplikasi: https://psb.rabbaanii.sch.id/login
      
//       Ananda dapat login dengan No. Pendaftaran atau No. WhatsApp terdaftar untuk melanjutkan pendaftaran. Ayah/Bunda disilahkan bergabung ke tautan Grup WA Pendaftar https://bit.ly/GROUPWA-PPDBRIS2627 untuk informasi lebih lanjut.
      
//       Jazaakumullahu khayran wa Baarakallaahu fiikum.
      
//       -- PSB RABBAANII ISLAMIC SCHOOL - CS RABBAANII --
//       - Mohon simpan nomor ini untuk mendapatkan update informasi -`
//     }];

//     console.log('Notification data:', messageData);
//     // Implement your notification sending logic here
//   };

//   const onSubmit = (data) => {
//     console.log('Form data submitted:', data);
//     setError(null); // Clear previous errors
//     onEdit(data);
//   };

//   return {
//     onSubmit: form.handleSubmit(onSubmit), // Properly wrapped handleSubmit
//     results,
//     form,
//     loading: isPending,
//     error, 
//     notified
//   };
// };

// export { useApplicants };

import { useForm } from "react-hook-form";

import { defaultApplicantValues, applicantSchema } from "../schemas/applicants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {applicantService} from "../services/api/applicants";
import { useNavigate } from "react-router-dom";
// import Swal from "../../utils/Swal";
import { useState } from "react";
import { da } from "zod/v4/locales";
import supabase from "../services/database-server";
// import axios from '../../api/local-server';
// import axios from '../../api/prod-server';
// import { useSonner } from "@/hooks/use-sonner";
// import { useRoutes } from "react-router-dom";
// import { useRouter } from "next/navigation";

const useApplicants = () => {
  // const { sonner } = useSonner();
  // const { replace } = useRoutes();
  const navigate = useNavigate()
  const [results, setResults] = useState({})
  const [error, setError] = useState({})
  const [requestData, setRequestData] = useState({})
  const [notified, setNotified] = useState(false)
  const {register} = applicantService()


  const form = useForm({
    resolver: zodResolver(applicantSchema),
    defaultValues: defaultApplicantValues,
  });

  const { mutate: onEdit, isPending } = useMutation({
    mutationFn: async (data) => {
      setRequestData(prev => ({...prev, phone_number: data.phone_number, full_name: data.full_name}))
      console.log('data>', data, requestData.phone_number, requestData)
      const { data: data_appl, error } = await supabase.rpc("edit_applicant", {
            _full_name : data.full_name,
            _gender : data.gender,
            _email : data.email,
            _password : data.password,
            _media : data.media,
            _school_id : parseInt(data.school_id),
            _subschool : data.subschool,
            _phone_number : data.phone_number,
          });
        return data_appl
      // return register(
      //       data.email,
      //       data.full_name,
      //       data.gender,
      //       data.media,
      //       data.password,
      //       data.phone_number,
      //       data.school_id,
      //       data.subschool
      //     );
    },
    onSuccess: (data) => {
      if(data){
        setResults(data)

        if(data.f1 !== '01'){
          sendNotif(data)
        }
      }
      // sonner.success("Register berhasil!");

      // Redirect to dashboard
      // if()
      // navigate("/login");
    },
    onError: (error) => {
      setError(error)
      console.log('pendaftaran error ', error)
      // sonner.error((error).message || "Register gagal. Silakan coba lagi.");
    },
  });

  const sendNotif = async (_results) => {
    // console.log('phone_number', phone_number)
    console.log('phone_number', requestData.full_name)
      const new_phone_number = '62'+ requestData.phone_number.slice(1)
    const data = [{
            "phone": new_phone_number,
            // "phone": "6285778650040",
            "message": `Assalamu'alaikum, Alhamdulillah Ananda ${requestData.full_name} telah terdaftar di Aplikasi PSB RIS TA. 26/27. 
            No. Pendaftaran: ${_results?.f3}
            Login Aplikasi: https://psb.rabbaanii.sch.id/login
            
            Ananda dapat login dengan No. Pendaftaran atau No. WhatsApp terdaftar untuk melanjutkan pendaftaran. Ayah/Bunda disilahkan bergabung ke tautan Grup WA Pendaftar https://bit.ly/GROUPWA-PPDBRIS2627 untuk informasi lebih lanjut.
            
            Jazaakumullahu khayran wa Baarakallaahu fiikum.
            
            -- PSB RABBAANII ISLAMIC SCHOOL - CS RABBAANII --
            - Mohon simpan nomor ini untuk mendapatkan update informasi -`
            // "message": "Assalamu'alaikum, Alhamdulillah ananda telah terdaftar di sistem kami dengan No. Registrasi . "
    
          }]
          // console.log(data)
    
          // setSuccess(true)
          // setModalShow(true)
    
          
              // try {
              //   const response = await axios.post("/api/auth/send-notif", {message: data , type: 'form-success', token: null},
              //   {
              //     headers: {'Content-Type': 'application/json' }
              //   }
              //   );
              //   // 
              //   console.log(JSON.stringify(response)); //console.log(JSON.stringify(response));
              //   if(response.data.status==200 || response.data.status==204){
              //     setNotified(true)
              //     // persistor.purge();
              //     // // Reset to default state reset: async () => { useCart.persist.clearStorage(); set((state) => ({ ...initialState, })); },
              //     // localStorage.removeItem("persist:auth")
              //     // Cookies.remove("jwt")
              //     // dispatch(logout())
              //     // navigate('/login')
              //   }
              // } catch (error) {
              //   console.log(error)
              //   setNotified(false)
              // } finally {
              //   setNotified(false)
              //   // setIsLoading(false)
              // }
  }

  const onSubmit = (data) => {
    console.log('data on edit', data)
    onEdit(data);
  };

  return {
    onSubmit,
    results,
    form,
    loading: isPending,
    error, 
    notified
  };
};

export { useApplicants };
