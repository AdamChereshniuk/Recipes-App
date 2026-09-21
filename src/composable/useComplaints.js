import { supabase } from "@/lib/supabase";
import { ref } from "vue";

export function useComplaints() {
  const complaints = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Получить все жалобы текущего пользователя
  async function fetchMyComplaints(userId) {
    loading.value = true;
    error.value = null;

    const { data, err } = await supabase.from("complaints").select("*, recipes(title)").eq("user_id", userId).order("created_at", { ascending: false });

    if (err) error.value = err.message;
    else complaints.value = data;

    loading.value = false;
    
    return data;
  };

  // Получить жалобу по ID
  async function fetchComplaintById(id) {
    error.value = null;

    const { data, err } = await supabase.from("complaints").select("*, recipes(title)").eq("id", id).single();

    if (err) error.value = err.message;

    return data;
  };

  // Создать жалобу
  async function createComplaint(title, text, userId, recipeId) {
    error.value = null;

    const { data, err } = await supabase.from("complaints").insert({ title: title, text: text, user_id: userId, recipe_id: recipeId}).select().single();

    if (err) {
      error.value = err.message;
      throw err;
    };

    return data;
  };

  // Редактировать жалобу
  async function updateComplaint(id, updates) {
    error.value = null;

    const { data, err } = await supabase.from("complaints").update(updates).eq("id", id).select().single();

    if (err) {
      error.value = err.message;
      throw err;
    };

    return data;
  };

  // Удалить жалобу
  async function deleteComplaint(id) {
    error.value = null;

    const { err } = await supabase.from("complaints").delete().eq("id", id);

    if (err) {
      error.value = err.message;
      throw err;
    };

    window.location.href = window.location.href;
  };

  return {
    complaints, loading, error,
    fetchMyComplaints, fetchComplaintById, createComplaint, updateComplaint, deleteComplaint,
  };
};