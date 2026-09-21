<script setup>
    import { useAuth } from '@/composable/useAuth';
    import { useRecipes } from '@/composable/useRecipe';
    import { ROUTES_PATHS } from '@/constants';
    import { onMounted, ref } from 'vue';

    const { user } = useAuth();
    const { recipes, fetchRecipes } = useRecipes();

    const getRecipePath = (id, mode) => {
        if(mode == "view") {
            return `${ROUTES_PATHS.RECIPE_VIEW.split(":")[0]}${id}`;
        } else if(mode == "edit") {
            return `${ROUTES_PATHS.RECIPE.split(":")[0]}${id}`;
        };
    };

    onMounted(async() => {
        await fetchRecipes();
    });
</script>

<template>
    <div class="home">
        <div class="container">
            <div class="home__inner">
                <div v-if="recipes !== undefined">
                    <ul class="home__list" v-if="recipes.length !== 0">
                        <li v-for="recipe in recipes">
                            <router-link :to="getRecipePath(recipe.id, 'view')" class="home__item">
                                <img :src="recipe.image_url" :alt="recipe.title">
                                <div class="home__item-content">
                                    <h2 class="home__item-title">{{ recipe.title }}</h2>
                                    <p class="home__item-text">{{ recipe.description }}</p>
                                </div>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-if="recipes !== undefined">
                    <div class="home__empty-wrapper" v-if="recipes.length == 0">
                        <h1 class="home__empty-title title">Пока нет рецептов</h1>
                        <p class="home__empty-text text">Создайте рецепт и он появится здесь</p>
                        <router-link class="btn" :to="user !== null ? getRecipePath('new', 'edit') : ROUTES_PATHS.LOGIN">Создать рецепт</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .home {
        padding: 100px 0;

        &__inner {
            display: flex;
            flex-direction: column;
            gap: 22px;
        }

        &__list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        &__item {
            display: flex;
            flex-direction: column;
            gap: 12px;

            &-content {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            &-title {
                margin: 0;
                padding: 0;
            }

            &-text {
                margin: 0;
                padding: 0;
            }
        }

        &__empty {
            &-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 16px;
            }

            &-title, &-text {
                margin: 0;
                padding: 0;
            }
        }
    }
</style>