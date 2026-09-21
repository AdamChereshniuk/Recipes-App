<script setup>
    import { useAuth } from '@/composable/useAuth';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import complaint_icon from "@/assets/images/report.svg";
    import { useRecipes } from '@/composable/useRecipe';
    import { useProfile } from '@/composable/useProfile';
    import empty_star from "@/assets/images/empty-star.svg";
    import full_star from "@/assets/images/full-star.svg";
    import { useComplaints } from '@/composable/useComplaints';
    import cross from "@/assets/images/cross.svg";
import { ROUTES_PATHS } from '@/constants';

    const { user } = useAuth();
    const { profile, fetchProfile, addToFavorites, isRecipeInFavorites, removeFromFavorites } = useProfile();
    const { fetchRecipes } = useRecipes();
    const { fetchMyComplaints, createComplaint, updateComplaint, deleteComplaint } = useComplaints();
    const route = useRoute();

    // Переменные
    const recipeId = route?.params.id;

    // Refs
    const userRef = ref();
    const recipe = ref(fetchRecipes().then(data => {
        return data.filter(recipeEl => recipeEl.id == recipeId)[0];
    }));
    // fetchRecipes().then(data => {
    //     recipe.value = data.filter(recipeEl => recipeEl.id == recipeId)[0];
    //     recipeUpdated.value = data.filter(recipeEl => recipeEl.id == recipeId)[0];
    // });
    const isComplaintModalOpen = ref(false);
    const isMealFavorite = ref(false);
    const complaint = ref({
        title: "",
        text: "",
        user_id: user.value !== null && user.value !== undefined && user.value.id,
        recipe_id: recipeId,
    });
    const complaintUpdated = ref({
        title: "",
        text: "",
        user_id: null,
        recipe_id: null,
    });
    const isThereAComplaintToThisRecipeFromThisUser = ref(false);
    const isSuccess = ref(false);
    const complaintError = ref("");

    // Заполняем refs
    isRecipeInFavorites(user.value !== null && user.value !== undefined && user.value.id, recipeId).then(data => isMealFavorite.value = data);
    fetchRecipes().then(data => {
        recipe.value = {...data.filter(recipeEl => recipeEl.id == recipeId)[0]};
    });
    fetchProfile(user.value !== null && user.value !== undefined && user.value.id).then(data => userRef.value = data);
    fetchMyComplaints(user.value !== null && user.value !== undefined && user.value.id).then(data => {        
        if(data == undefined || data.length == 0) {
            isThereAComplaintToThisRecipeFromThisUser.value = false;
            return;
        };
        
        const complaintsList = data;

        for(const complaintEl of complaintsList) {
            if(complaintEl.recipe_id == recipeId && complaintEl.user_id == user.value.id) {
                isThereAComplaintToThisRecipeFromThisUser.value = true;
                complaint.value = complaintEl;
                complaintUpdated.value = complaintEl;
            };
        };
    });

    // Функции
    const openComplaintModal = () => isComplaintModalOpen.value = true;
    const closeComplaintModal = () => isComplaintModalOpen.value = false;
    const sendComplaint = async() => {
        const complaintUpdatedValue = complaintUpdated.value;

        if(isThereAComplaintToThisRecipeFromThisUser.value) {
            if(complaintUpdatedValue.title.trim() !== "" && complaintUpdatedValue.text.trim() !== "") {
                updateComplaint(complaintUpdatedValue.id, {
                    title: complaintUpdatedValue.title,
                    text: complaintUpdatedValue.text,
                });
                isSuccess.value = true;
            };
        } else {
            if(complaintUpdatedValue.title.trim() !== "" && complaintUpdatedValue.text.trim() !== "") {
                complaintUpdatedValue.user_id = user.value.id;
                complaintUpdatedValue.recipe_id = recipeId;
                createComplaint(complaintUpdatedValue.title.trim(), complaintUpdatedValue.text.trim(), complaintUpdatedValue.user_id, complaintUpdatedValue.recipe_id);
                isSuccess.value = true;
            };
        };
    };
    const toggleIsRecipeInFavorites = () => {
        if(isMealFavorite.value) {
            removeFromFavorites(user.value.id, recipeId);
            isMealFavorite.value = false;
        } else {
            addToFavorites(user.value.id, recipeId);
            isMealFavorite.value = true;
        };
    };
    const removeComplaint = () => deleteComplaint(complaintUpdated.value.id);
    const getRecipePath = (id) => {
        return `${ROUTES_PATHS.RECIPE.split(":")[0]}${id}`;
    };

    // onMounted
    onMounted(() => {
        fetchRecipes();
    });
</script>

<template>
    <div class="recipe-view">
        <div class="container">
            <div class="recipe-view__wrapper">
                <img class="recipe-view__img" :src="recipe.image_url" :alt="recipe.title">
                <div class="recipe-view__content">
                    <span class="recipe-view__title">{{ recipe.title }}</span>
                    <p class="recipe-view__text">{{ recipe.description }}</p>
                    <div class="recipe-view__btns">
                        <div v-if="user !== undefined">
                            <router-link class="btn" :to="`/recipes/${recipe.id}`" v-if="userRef !== undefined && userRef !== null && userRef.meals_ids.includes(String(recipe.id))">Редактировать</router-link>
                        </div>
                        <div>
                            <router-link class="recipe-view__favorite-btn" :to="ROUTES_PATHS.LOGIN" v-if="user == undefined || user == null">
                                <img :src="empty_star" alt="Избранное">
                            </router-link>
                            <button class="recipe-view__favorite-btn" v-if="user !== undefined && user !== null" @click="toggleIsRecipeInFavorites">
                                <img :src="isMealFavorite ? full_star : empty_star" alt="Избранное">
                            </button>
                        </div>
                        <button class="recipe-view__complaint-btn" @click="openComplaintModal">
                            <img :src="complaint_icon" alt="Пожаловаться">
                            Пожаловаться
                        </button>
                    </div>
                </div>
            </div>
            <p class="recipe-view__instructions">{{ recipe.instructions }}</p>
            <div class="recipe-view__ingredients-wrapper">
                <h3 class="recipe-view__ingredients-title">Ингредиенты</h3>
                <span v-if="recipe.ingredients.length == 0">Ингредиентов нет...</span>
                <ul class="recipe-view__ingredients" v-if="recipe.ingredients.length !== 0">
                    <li class="recipe-view__ingredient" v-for="(ingredient, ingredientIndex) in recipe.ingredients">
                        <span class="recipe-view__ingredient-index">{{ ingredientIndex + 1 }}.</span>
                        <span class="recipe-view__ingredient-title">{{ ingredient }}</span>
                    </li>
                </ul>
            </div>
            <div class="recipe-view__btns">
                <!-- <button class="btn" v-if="user !== null && user !== undefined"> -->
                    <div v-if="user !== null && user !== undefined">
                        <router-link class="btn" :to="getRecipePath(recipeId)" v-if="user.id && recipe.user_id == user.id">Редактировать</router-link>
                    </div>
                <!-- </button> -->
            </div>
        </div>
        <div class="modal" v-if="isComplaintModalOpen">
            <div class="modal__box">
                <button class="modal__cross" @click="closeComplaintModal">
                    <img class="modal__cross-img" :src="cross" alt="Крестик">
                </button>
                <div class="modal__content">
                    <span class="title" style="margin-bottom: 20px;">{{ isSuccess ? "Готово!" : "Оставить жалобу" }}</span>
                    <span class="modal__text" v-if="isSuccess">Ваша жалоба отправлена и будет рассмотрена в ближайшее время</span>
                    <div style="display: flex; flex-direction: column; gap: 20px; width: 100%;" v-if="!isSuccess">
                        <input class="input" type="text" placeholder="Заголовок" v-model="complaintUpdated.title">
                        <textarea class="textarea" placeholder="Опишите проблему..." rows="5" v-model="complaintUpdated.text"></textarea>
                    </div>
                    <div v-if="complaintError !== ''" style="color: red; padding-bottom: 15px;">{{ complaintError }}</div>
                    <div class="modal__btns" v-if="!isSuccess">
                        <button class="modal__cancel-btn" @click="closeComplaintModal">Отмена</button>
                        <button class="modal__submit-btn" @click="sendComplaint">Отправить</button>
                    </div>
                    <button class="suptitle modal__remove-btn" v-if="isThereAComplaintToThisRecipeFromThisUser && !isSuccess" @click="removeComplaint">Удалить жалобу</button>
                </div>
            </div>
        </div>
    </div>

    <!-- <AppLayout>
        <template #title> Просмотр рецепта "{{ recipe.strMeal }}" </template>
        <template #controls>
            <AppButton text="Редактировать" @click="() => handleOnEditBtnClick(recipe.idMeal)" />
        </template>
        <template #inner>
            <div class="view-wrapper">
                <div>
                    <div class="row-img">
                        <img :src="recipe.strMealThumb" :alt="recipe.strMeal">
                    </div>
                    <div class="row view-wrapper-content">
                        <div class="view-wrapper-id">ID: {{ recipe.idMeal }}</div>
                        <div class="suptitle view-wrapper-suptitle">{{ recipe.strMeal }}</div>
                        <el-tag class="tag" v-for="(tag, key) in recipe.strTags" :key="key" type="primary">{{ tag }}</el-tag>
                        <div class="view-wrapper-category">Категория: {{ recipe.strCategory.toLowerCase() }}</div>
                        <div class="view-wrapper-area">Кухня: {{ recipe.strArea !== null ? recipe.strArea.toLowerCase() : "не определено" }}</div>
                        <div class="view-wrapper-text">{{ recipe.strInstructions }}</div>
                    </div>
                    <div class="suptitle">Ингредиенты</div>
                    <div class="view-wrapper-ingredients">
                        <div class="row" v-for="(ingredient, index) in recipe.strIngredients">
                            <div>{{ index + 1 }}</div>
                            <div>{{ recipe.strIngredients[index].title }}</div>
                            <div>{{ recipe.strIngredients[index].measure }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppLayout> -->
</template>

<style lang="scss">
    @import "@/assets/styles/index.scss";

    .recipe-view {
        &__wrapper {
            display: flex;
            gap: 20px;
            margin-top: 44px;
        }

        &__img {
            width: 387px;
            min-width: 387px;
            height: 312px;
            min-height: 312px;
            border-radius: 20px;
        }

        &__content {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        &__title {
            font-size: 36px;
            font-weight: 600;
        }

        &__text {
            margin: 0;
        }

        &__data {
            display: flex;
            align-items: center;
            gap: 40px;
        }

        &__country, &__category {
            font-size: 20px;
            font-weight: 500;

            & > span {
                color: #FF9500;
            }
        }

        &__btns {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-top: auto;
        }

        &__favorite-btn {
            background-color: transparent;
            border: none;
            outline: none;
            cursor: pointer;
        }

        &__complaint-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            border: none;
            outline: none;
            background-color: transparent;
            font-family: "Montserrat";
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;

            & > img {
                width: 25px;
                height: 25px;
            }
        }

        &__instructions {
            margin: 0;
            padding: 0;
            margin-top: 20px;
        }

        &__ingredients {
            display: flex;
            flex-direction: column;
            gap: 10px;
            list-style: none;
            margin: 0;
            padding: 0;

            &-wrapper {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin: 0;
                padding: 0;
                margin: 15px 0 40px;
            }

            &-title {
                font-size: 32px;
                font-weight: 600;
                color: #FF9500;
                margin: 0;
                padding: 0;
                margin-bottom: 10px;
            }
        }

        &__ingredient {
            display: grid;
            grid-template-columns: 25px 320px 500px;
            gap: 10px;

            & span {
                font-size: 20px;
                font-weight: 500;
            }

            & > span:first-child {
                color: #FF9500;
            }
        }
    }
</style>