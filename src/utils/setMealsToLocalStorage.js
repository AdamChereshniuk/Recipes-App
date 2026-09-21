export const setMealsToLocalStorage = (meals) => {
    localStorage.setItem("meals", JSON.stringify(meals));
};