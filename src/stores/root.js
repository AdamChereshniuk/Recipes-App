import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getAllAreasFromLocalStorage } from '@/utils/getAllAreasFromLocalStorage';
import { getAllCategoriesFromLocalStorage } from '@/utils/getAllCategoriesFromLocalStorage';
import { getAllIngredientsFromLocalStorage } from '@/utils/getAllIngredientsFromLocalStorage';

export const useRootStore = defineStore('root', () => {
  const areas = ref(null);
  const categories = ref(null);
  const ingredients = ref(null);

  const getAreas = () => {
    const allAreas = JSON.parse(getAllAreasFromLocalStorage());

    areas.value = allAreas;
  };
  const getCategories = () => {
    const allCategories = JSON.parse(getAllCategoriesFromLocalStorage());

    categories.value = allCategories;
  };
  const getIngredients = () => {
    const allIngredients = JSON.parse(getAllIngredientsFromLocalStorage());

    ingredients.value = allIngredients;
  };

  return { areas, categories, ingredients, getAreas, getCategories, getIngredients };
});