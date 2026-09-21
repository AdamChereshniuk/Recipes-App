import { ROUTES_PATHS } from "@/constants";
import { supabase } from "@/lib/supabase";
import { onMounted, ref } from "vue";

export function useRecipes() {
  const recipes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Получить все рецепты
  async function fetchRecipes() {
    loading.value = true;
    const { data, err } = await supabase.from("recipes").select("*").order("created_at", { ascending: false });
    if (err !== undefined) {
      error.value = err.message;
    } else {
      recipes.value = data;
    };
    return data;
    loading.value = false;
  };

  // Получить рецепты текущего пользователя
  async function fetchMyRecipes(userId) {
    const { data, err } = await supabase.from("recipes").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (err) error.value = err.message;
    else recipes.value = data;
  };

  // Создать рецепт
  async function createRecipe(recipeData, userId) {
    const { data, err } = await supabase.from("recipes").insert({ ...recipeData, user_id: userId }).select().single();
    if (err) {
      error.value = err.message;
      console.log(err.message);
    };
    window.location.href = ROUTES_PATHS.HOME;
    return data;
  };

  // Обновить рецепт
  async function updateRecipe(id, updates) {
    const { data, err } = await supabase.from("recipes").update(updates).eq("id", id).select().single();
    if (err) {
      error.value = err.message;
      console.log(err.message);
    };
    window.location.href = ROUTES_PATHS.HOME;
    return data;
  };

  // Удалить рецепт
  async function deleteRecipe(id) {
    const { err } = await supabase.from("recipes").delete().eq("id", id);
    if (err) error.value = err.message;
    window.location.href = ROUTES_PATHS.HOME;
  };

  onMounted(() => fetchRecipes());

  return {
    recipes, loading, error,
    fetchRecipes, fetchMyRecipes,
    createRecipe, updateRecipe, deleteRecipe
  };
};