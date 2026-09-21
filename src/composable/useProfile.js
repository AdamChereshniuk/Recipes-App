import { onMounted, ref } from "vue"
import { supabase } from "@/lib/supabase"

export function useProfile() {
  const profile = ref(null);
  const error = ref(null);

    // Получить свой профиль
    async function fetchProfile(userId) {
        const { data, err } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (err) {
            error.value = err.message;
        } else {
            profile.value = data;
            return data;
        };
    };

    // Обновить профиль
    async function updateProfile(userId, updates) {
        const { data, err } = await supabase.from("profiles").update(updates).eq("id", userId).select().single();
        if (err) error.value = err.message;
        else profile.value = data;
        return data;
    };

    // Добавить рецепт в избранное
    async function addToFavorites(userId, recipeId) {
        const { data, err } = await supabase.rpc("add_favorite", {
            user_id: userId,
            recipe_id: recipeId,
        });
        if (err) error.value = err.message;
        return data;
    };

    async function isRecipeInFavorites(userId, recipeId) {
        const { data, error: err } = await supabase.from("profiles").select("favorite_ids").eq("id", userId).contains("favorite_ids", [recipeId]).limit(1);

        if (err) {
            console.error("Ошибка проверки избранного:", err);
            return false;
        };
        
        return data && data.length > 0;
    };

    async function removeFromFavorites(userId, recipeId) {
        const { error } = await supabase.rpc("remove_favorite", {
            user_id: userId,
            recipe_id: recipeId,
        });

        if (error) throw error;
    };

    return {
        profile, error,
        fetchProfile, updateProfile, addToFavorites, isRecipeInFavorites, removeFromFavorites,
    };
};