export const setAreasToLocalStorage = (areas) => {
    localStorage.setItem("areas", JSON.stringify(areas));
};