<script setup>
  import { onMounted } from 'vue';
  import { RouterView } from 'vue-router';
  import { useRootStore } from './stores/root';
  import { getAllAreasFromLocalStorage, getAllCategoriesFromLocalStorage, getAllIngredientsFromLocalStorage, getAllMealsFromLocalStorage, setMealsToLocalStorage } from './utils';
  import { setAllToLocalStorage } from './utils/setAllToLocalStorage';
  import { Meals, Areas, Categories, Ingredients, Users } from './data';
  import { getAllUsersFromLocalStorage } from './utils/getAllUsersFromLocalStorage';
import Header from './components/Header.vue';

  const rootStore = useRootStore();

  // Функция для получения удобного массива ингредиентов
  const getNormalizeRecipeIngredients = (meal) => {
    const normalizedIngredients = [];

    for(let i = 1; i <= 20; i++) {
      if(meal[`strIngredient${i}`] !== "") {
        const ingr = {
          title: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`],
        };

        normalizedIngredients.push(ingr);
      };
    };

    return normalizedIngredients;
  };

  if(
    getAllMealsFromLocalStorage() == "" || getAllAreasFromLocalStorage() == "" || getAllCategoriesFromLocalStorage() == "" || getAllIngredientsFromLocalStorage() == "" || getAllUsersFromLocalStorage() == ""
    ||
    getAllMealsFromLocalStorage() == null || getAllAreasFromLocalStorage() == null || getAllCategoriesFromLocalStorage() == null || getAllIngredientsFromLocalStorage() == null || getAllUsersFromLocalStorage() == null
  ) {
    setAllToLocalStorage(Meals, Areas, Categories, Ingredients, Users);

    // Создадим новый список блюд со свойством strIngredients
    const localStorageMealsCopy = JSON.parse(getAllMealsFromLocalStorage());
    let newLocalStorageMeals = [];

    for (let i = 0; i < [...localStorageMealsCopy].length; i++) {
      newLocalStorageMeals.push(localStorageMealsCopy[i]);
      newLocalStorageMeals[i]["strIngredients"] = getNormalizeRecipeIngredients(newLocalStorageMeals[i]);
    };

    setMealsToLocalStorage(newLocalStorageMeals);
  };

  // Заполним состояния в Pinia
  rootStore.getAreas();
  rootStore.getCategories();
  rootStore.getIngredients();
</script>

<template>
  <Header />
  <RouterView />
</template>