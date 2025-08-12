import { z } from "zod";

export const schedulesSchema = z.object({
  fullname: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .nonempty("Nama lengkap wajib diisi"),
  email: z.email("Alamat email tidak valid").nonempty("Email wajib diisi"),
  nickname: z.string().nonempty("Nama panggilan wajib diisi"),
  birth_place: z.string().nonempty("Tempat lahir wajib diisi"),
  birth_date: z.string().nonempty("Tanggal lahir wajib diisi"),
  phone_number: z
    .string()
    .nonempty("Nomor telepon wajib diisi")
    .refine((val) => val.startsWith("62"), {
      message: "Nomor telepon harus diawali 62",
    }),
  gender: z
    .union([z.enum(["Male", "Female"]), z.literal(""), z.null()])
    .refine((val) => val === "Male" || val === "Female", {
      message: "Jenis kelamin wajib diisi",
    }),
  address: z.string().nonempty("Alamat wajib diisi"),
});

// export type UserProfileFormData = z.infer<typeof schedulesSchema>;

export const userProfileDefaultValues = {
  fullname: "",
  email: "",
  nickname: "",
  birth_place: "",
  birth_date: "",
  phone_number: "",
  gender: "",
  address: "",
};
