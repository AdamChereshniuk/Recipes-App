import { createRouter, createWebHistory } from "vue-router";
import { ROUTES_PATHS } from "@/constants/router.js";
import ResetPassword from "@/pages/ResetPassword.vue";
import RecipeView from "@/pages/RecipeView.vue";
import Register from "@/pages/Register.vue";
import Profile from "@/pages/Profile.vue";
import Recipe from "@/pages/Recipe.vue";
import Login from "@/pages/Login.vue";
import Home from "../pages/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTES_PATHS.HOME,
      name: "home",
      component: Home,
    },
    {
      path: ROUTES_PATHS.REGISTER,
      name: "register",
      component: Register,
    },
    {
      path: ROUTES_PATHS.LOGIN,
      name: "login",
      component: Login,
    },
    {
      path: ROUTES_PATHS.PROFILE,
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: ROUTES_PATHS.RECIPE_VIEW,
      name: "recipe_view",
      component: RecipeView,  
    },
    {
      path: ROUTES_PATHS.RECIPE,
      name: "recipe",
      component: Recipe,  
    },
    {
      path: ROUTES_PATHS.RESET_PASSWORD,
      name: "reset password",
      component: ResetPassword,  
    },
  ],
});

export default router;