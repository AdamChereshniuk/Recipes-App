<script setup>
    const props = defineProps({
        meal: {
            type: {},
            default: {},
        },
    });
</script>

<template>
    <div class="recipe-card">
        <router-link :to="`/recipes/view/${meal.idMeal}`">
            <img class="recipe-card-img" :src="meal.strMealThumb" :alt="meal.strMeal">
            <div class="recipe-card-content">
                <div class="recipe-card-title">{{ meal.strMeal.substring(0, 35) }}...</div>
                <div class="recipe-card-text">
                    {{ meal.strInstructions.substring(0, 100) }}...
                </div>
            </div>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
    .recipe-card {
        display: flex;
        flex-direction: column;
        gap: 8px;

        &-img {
            width: 100%;
            height: 320px;
            border-radius: 10px;
        }

        &-title {
            font-size: 20px;
            font-weight: 500;
        }

        &-text {
            display: block;
            margin-top: auto;
        }
    }
</style>