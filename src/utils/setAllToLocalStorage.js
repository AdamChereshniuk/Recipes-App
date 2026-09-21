import { setMealsToLocalStorage, setAreasToLocalStorage, setCategoriesToLocalStorage, setIngredientsToLocalStorage } from "./index";
import { setUsersToLocalStorage } from "./setUsersToLocalStorage";

export const setAllToLocalStorage = (meals, areas, categories, ingredients, users) => {
    setMealsToLocalStorage(meals);
    setAreasToLocalStorage(areas);
    setCategoriesToLocalStorage(categories);
    setIngredientsToLocalStorage(ingredients);
    setUsersToLocalStorage(users);
};