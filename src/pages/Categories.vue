<script setup>
    import AppButton from '@/components/AppButton.vue';
    import AppLayout from '@/layouts/AppLayout.vue';
    import { getAllCategoriesFromLocalStorage, setCategoriesToLocalStorage } from '@/utils';
    import { ref } from 'vue';

    const categoriesFromLocalStorage = ref(JSON.parse(getAllCategoriesFromLocalStorage()));
    const categoriesUpdatedFromLocalStorage = ref([...JSON.parse(getAllCategoriesFromLocalStorage())]);

    const addCategory = () => categoriesUpdatedFromLocalStorage.value.push({ "strCategory": "" });
    const removeCategory = (index) => categoriesUpdatedFromLocalStorage.value.splice(index, 1);
    const saveChanges = () => {
        setCategoriesToLocalStorage(categoriesUpdatedFromLocalStorage.value);
        window.location.href = "/";
    };
</script>

<template>
    <AppLayout>
        <template #title> Категории </template>
        <template #controls>
            <AppButton text="Сохранить" @click="saveChanges" />
        </template>
        <template #inner>
            <div class="row" v-if="categoriesUpdatedFromLocalStorage !== null || categoriesUpdatedFromLocalStorage.length !== 0" v-for="(categorie, index) in categoriesUpdatedFromLocalStorage" :key="`${index}`">
                <div class="col">
                    <el-input v-model="categoriesUpdatedFromLocalStorage[index].strCategory" placeholder="Категория" />
                </div>
                <div class="col col-small button">
                    <AppButton text="Удалить" @click="() => removeCategory(index)" />
                </div>
            </div>
            <div class="" style="padding-bottom: 10px; font-size: 18px;" v-if="categoriesUpdatedFromLocalStorage == null || categoriesUpdatedFromLocalStorage.length == 0">Нет категорий...</div>
            <AppButton text="Добавить категорию" @click="addCategory" />
        </template>
    </AppLayout>
</template>