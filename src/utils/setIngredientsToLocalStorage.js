export const setIngredientsToLocalStorage = (ingredients) => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
};