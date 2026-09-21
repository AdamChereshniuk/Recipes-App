<script setup>
    import { useRecipes } from "@/composable/useRecipe";
    import { useAuth } from "@/composable/useAuth";
    import { useRoute } from "vue-router";
    import { onMounted, ref } from "vue";
    import cross from "@/assets/images/cross.svg";

    // useAuth && useRecipes && useRoute
    const { user } = useAuth();
    const { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } = useRecipes();
    const route = useRoute();

    // Переменные
    const recipeId = route?.params.id;

    // Refs
    const isCreatingMode = ref(recipeId === "new");
    const isDeleteRecipeModalOpen = ref(false);
    const recipe = ref();
    const recipeUpdated = ref();

    // Заполняем recipe и recipeUpdated
    if(isCreatingMode.value) {
        const emptyRecipe = {
            title: "",
            description: "",
            ingredients: [],
            instructions: "",
            image_url: "https://avatars.mds.yandex.net/i?id=b1656c0db64c8ea25846894aa107879994744ac8-4526725-images-thumbs&n=13",
        };
        recipe.value = emptyRecipe;
        recipeUpdated.value = emptyRecipe;
    } else {
        fetchRecipes().then(data => {
            recipe.value = data.filter(recipeEl => recipeEl.id == recipeId)[0];
            recipeUpdated.value = data.filter(recipeEl => recipeEl.id == recipeId)[0];
        });
    };

    // Методы
    const addIngredient = () => recipeUpdated.value.ingredients.push("");
    const removeIngredient = (index) => recipeUpdated.value.ingredients.splice(index, 1);
    const openDeleteRecipeModal = () => isDeleteRecipeModalOpen.value = true;
    const closeDeleteRecipeModal = () => isDeleteRecipeModalOpen.value = false;
    const removeRecipe = () => deleteRecipe(recipeId);
    const saveChanges = () => {
        if(isCreatingMode.value) {
            createRecipe(recipeUpdated.value, user.value.id);
        } else {
            updateRecipe(recipeUpdated.value.id, recipeUpdated.value).then(data => console.log(data));
        };
    };

    // onMounted
    onMounted(() => {
        fetchRecipes();
    });
</script>

<template>
    <div class="recipe" v-if="recipeUpdated !== undefined">
        <div class="container">
            <span class="recipe__title" v-if="isCreatingMode">Новый рецепт</span>
            <span class="recipe__title" v-if="!isCreatingMode">Рецепт "{{ recipeUpdated.title }}"</span>
            <form class="recipe-form">
                <div class="recipe-form__inputs">
                    <input class="input" type="text" placeholder="Название" v-model="recipeUpdated.title">
                    <input class="input" type="text" placeholder="Ссылка на изображение" v-model="recipeUpdated.image_url">
                </div>
                <input class="input" type="text" placeholder="Описание" v-model="recipeUpdated.description">
                <textarea class="textarea" placeholder="Инструкции для приготовления" rows="10" v-model="recipeUpdated.instructions"></textarea>
            </form>
            <div class="recipe-ingredients">
                <span class="recipe-ingredients__title">Ингредиенты</span>
                <span v-if="recipeUpdated.ingredients.length == 0">Ингредиентов нет...</span>
                <ul class="recipe-ingredients__list" v-if="recipeUpdated.ingredients.length !== 0">
                    <li class="recipe-ingredients__item" v-for="(ingredient, ingredientIndex) in recipeUpdated.ingredients">
                        <span class="recipe-ingredients__item-index">{{ ingredientIndex + 1 }}.</span>
                        <input class="input" type="text" placeholder="Ингредиент" v-model="recipeUpdated.ingredients[`${ingredientIndex}`]">
                        <button class="btn" @click="() => removeIngredient(ingredientIndex)">Удалить</button>
                    </li>
                </ul>
                <button class="recipe-ingredients__btn" @click="addIngredient">Добавить ингредиент</button>
            </div>
            <div class="recipe__btns">
                <button class="btn" @click="saveChanges">Сохранить</button>
                <button class="btn" @click="openDeleteRecipeModal" v-if="!isCreatingMode">Удалить рецепт</button>
            </div>
        </div>
        <div class="modal" v-if="isDeleteRecipeModalOpen">
            <div class="modal__box">
                <button class="modal__cross" @click="closeDeleteRecipeModal">
                    <img class="modal__cross-img" :src="cross" alt="Крестик">
                </button>
                <div class="modal__content">
                    <span class="title">Удалить рецепт</span>
                    <p class="modal__text">Вы действительно хотите безвозвратно удалить рецепт "{{ recipeUpdated.title }}"?</p>
                </div>
                <div class="modal__btns">
                    <button class="modal__cancel-btn" @click="closeDeleteRecipeModal">Отмена</button>
                    <button class="modal__submit-btn" @click="removeRecipe">Удалить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../assets/styles/variables.scss";
    
    .recipe {
        padding: 60px 0;

        &__title {
            display: block;
            margin-bottom: 50px;
            font-size: 36px;
            font-weight: 600;
        }

        &-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;

            &__inputs {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                align-items: center;
                gap: 20px;
            }

            &__categories {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                align-items: center;
                gap: 20px;
            }

            &__category {
                position: relative;
                width: 100%;

                & > span {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #000;
                    border-radius: 10px;
                    cursor: pointer;
                }
            }
        }

        &-ingredients {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;

            &__title {
                font-size: 32px;
                font-weight: 600;
                color: #FF9500;
            }

            &__list {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin: 0;
                padding: 0;
            }

            &__item {
                display: flex;
                align-items: center;
                gap: 20px;
                
                &-index {
                    font-size: 20px;
                    font-weight: 500;
                    color: #FF9500;
                }
            }

            &__btn {
                width: fit-content;
                color: #FF9500;
                background-color: transparent;
                border: none;
                outline: none;
                font-family: "Montserrat";
                font-size: 20px;
                font-weight: 500;
                cursor: pointer;
            }
        }

        &__btns {
            display: flex;
            align-items: center;
            gap: 20px;
        }
    }

    .areas-modal {
        width: 100%;
        min-width: 300px;
        max-width: 300px;
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
            height: 100%;
            max-height: 300px;
            overflow: scroll;
        }

        &__item {
            cursor: pointer;
        }
    }
</style>