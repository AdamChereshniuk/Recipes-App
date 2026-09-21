export const setUsersToLocalStorage = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
};