export const setCategoriesToLocalStorage = (categories) => {
    localStorage.setItem("categories", JSON.stringify(categories));
};