export const getAllIngredientsFromLocalStorage = () => {
    return localStorage.getItem("ingredients");
};