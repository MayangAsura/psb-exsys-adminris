import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  schedulesefaultValues,
//   UserProfileFormData,
  schedulesSchema,
} from "../schemas/schedules";
import useUserStore from "@/stores/user";
import {useSchedules} from "../hooks/use-schedules"
import supabase from "@/services/database-server";
// import { supabase } from "@/lib/supabase/client";
import { useSonner } from "@/hooks/use-sonner";
import { QUERIES } from "@/configs/tanstack";

export function useSchedules() {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { sonner } = useSonner();

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userProfileDefaultValues,
    mode: "onSubmit",
  });

  // Update profile mutation
  const addScheduleMutation = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("users")
        .update({
          fullname: data.fullname,
          email: data.email,
          nickname: data.nickname || null,
          birth_place: data.birth_place || null,
          birth_date: data.birth_date || null,
          phone_number: data.phone_number || null,
          gender: data.gender || null,
          address: data.address || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.USER.UPDATE_USER] });
      sonner.success("Berhasil menambahkan jadwal");
    },
    onError: (error) => {
      sonner.error(`Gagal menambahkan jadwal: ${error.message}`);
    },
  });

  const handleAddSchedule = (data) => {
    updateProfileMutation.mutate(data);
  };

  // Update profile form values when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullname: user.fullname,
        email: user.email,
        nickname: user.nickname || "",
        birth_place: user.birth_place || "",
        birth_date: user.birth_date || "",
        phone_number: user.phone_number || "",
        gender: user.gender ?? "",
        address: user.address || "",
      });
    }
  }, [user, profileForm]);

  return {
    user,
    profileForm,
    handleUpdateProfile,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
