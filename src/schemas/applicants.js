import z from "zod";

export const applicantSchema = z.object({
  // username: z.string().min(3, { message: "Username tidak valid." }),
  // password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  full_name : z.string().min(3, { message: "Nama Lengkap tidak valid." }),
  gender : z.string().min(1, { message: "Jenis kelamin tidak valid." }),
  phone_number : z.string().min(3, { message: "No. WhatsApp tidak valid." }),
  regist_number : z.string().min(0, { message: "" }),
  email : z.email().min(3, {message: "Email tidak valid." }),
  school_id : z.string().max(1, { message: "Jenjang tidak valid." }),
  subschool : z.string().min(0, { message: "" }),
  password : z.string().min(0, { message: "" }),
  // confirm_password : z.string().min(1, { message: "Konfirmasi Password tidak valid." }),
  media : z.string().min(3, { message: "Media tidak valid." })
})
// .superRefine((data, ctx) => {
//         if (data.password !== data.confirm_password) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: 'Konfirmasi password tidak sama',
//             path: ['confirm_password'], // Attach the error to the confirmPassword field
//           });
//         }
//       });

// export type registerSchemaType = z.infer<typeof registerSchema>;

// export default values for the form
export const defaultApplicantValues= {
  full_name : "",
  gender : "",
  phone_number : "",
  regist_number : "",
  email : "",
  school_id : "" ,
  subschool : "",
  password : "",
  // confirm_password : "",
  media : ""
};
