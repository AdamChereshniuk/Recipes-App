<script setup>
    import { useProfile } from "@/composable/useProfile";
    import { ROUTES_PATHS } from "@/constants/router";
    import { useAuth } from "@/composable/useAuth";
    import { onMounted, ref } from "vue";
    import search from "@/assets/images/search.svg";
    import user_icon from "@/assets/images/user.svg";
    import logo from "@/assets/images/logo.svg";
import { useRecipes } from "@/composable/useRecipe";

    // useAuth && useProfile
    const { user } = useAuth();
    const { profile, fetchProfile } = useProfile();
    const { recipes, fetchRecipes } = useRecipes();

    // Refs
    const isHeaderModalOpen = ref(false);
    const searchValue = ref("");
    const filteredMeals = ref([]);

    // Методы
    const getPath = (path) => {
        return `${ROUTES_PATHS[path]}`;
    };

    const onSearch = () => {
        isHeaderModalOpen.value = true;

        const searchValueVal = searchValue.value.toLowerCase().trim();

        if(searchValueVal.length == 0) {
            filteredMeals.value = [];
            return;
        };

        fetchRecipes().then(data => {
            filteredMeals.value = data.filter(recipeEl => recipeEl.title.toLowerCase().includes(searchValueVal) || recipeEl.description.toLowerCase().includes(searchValueVal) || recipeEl.instructions.toLowerCase().includes(searchValueVal));
        });
    };

    const handleClickOutside = (event) => {
        if (event.target.classList.value !== "header-search") isHeaderModalOpen.value = false;
    };
    document.addEventListener("click", (event) => handleClickOutside(event));

    // onMounted
    onMounted(async () => {
        if (user.value) await fetchProfile(user.value.id);
    });
    onMounted(async() => {
        await fetchRecipes();
    });
</script>

<template>
    <div class="header">
        <div class="container">
            <div class="header__inner">
                <router-link class="header__logo" :to="getPath('HOME')">
                    <img :src="logo" alt="Лого">
                </router-link>

                <div class="header__center">
                    <router-link class="btn" :to="getPath('LOGIN')" v-if="user == undefined || user == null">Добавить рецепт</router-link>
                    <router-link class="btn" to="/recipes/new" v-if="user !== undefined && user !== null">Добавить рецепт</router-link>
                    <div class="header-search">
                        <img :src="search" alt="Лупа">
                        <input class="header-search__input" placeholder="Введите запрос..." type="text" v-model="searchValue" @input="onSearch">
                        <div class="header-modal" v-if="isHeaderModalOpen">
                            <ul class="header-modal__list" v-if="filteredMeals.length !== 0">
                                <li class="header-modal__item" v-for="meal in filteredMeals">
                                    <router-link :to="`/recipes/view/${meal.id}`">{{ meal.title }}</router-link>
                                </li>
                            </ul>
                            <span class="header-modal__text" v-if="filteredMeals.length == 0">Ничего не найдено :(</span>
                        </div>
                    </div>
                </div>

                <div class="header__right">
                    <div class="header__btns" v-if="user == null">
                        <button class="header__btn">
                            <router-link :to="getPath('LOGIN')">Вход</router-link>
                        </button>
                        <span class="header__btn">|</span>
                        <button class="header__btn">
                            <router-link :to="getPath('REGISTER')">Регистрация</router-link>
                        </button>
                    </div>
                    <div class="header__user" v-if="user !== null">
                        <router-link :to="getPath('PROFILE')">
                            <img :src="user_icon" :alt="user.user_metadata.first_name">
                            <span>{{ user.user_metadata.first_name }} {{ user.user_metadata.last_name }}</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .header {
        padding-top: 30px;

        &__inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
        }

        &__logo {
            width: 56px;
            height: 40px;
        }

        &__center {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        &-search {
            position: relative;
            display: flex;
            align-items: center;
            gap: 14px;
            border: 1px solid #000;
            padding: 14px 28px;
            border-radius: 60px;

            &__input {
                background-color: transparent;
                border: none;
                outline: none;
                font-family: "Montserrat";
                font-size: 16px;
                font-weight: 400;
                color: #000;

                &::placeholder {
                    color: #666;
                }
            }
        }

        &-modal {
            width: 100%;
            min-width: 600px;
            max-width: 600px;
            padding: 20px;
            position: absolute;
            top: 120%;
            left: 0;
            background-color: #fff;
            box-shadow: 4px 4px 60px 0px rgba(0, 0, 0, 0.2);
            border-radius: 20px;

            &__list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin: 0;
                padding: 0;
                list-style: none;
            }
        }

        &__btns {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        &__btn {
            font-family: "Montserrat";
            font-weight: 500;
            font-size: 18px;
            background-color: transparent;
            border: none;
        }

        &__user > a {
            display: flex;
            align-items: center;
            gap: 16px;
            font-weight: 500;
            font-size: 18px;
        }
    }
</style>