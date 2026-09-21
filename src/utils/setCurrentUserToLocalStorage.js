export const setCurrentUserToLocalStorage = (currentUser) => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
};