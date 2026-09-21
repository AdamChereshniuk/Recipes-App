<script setup>
    import AppButton from '@/components/AppButton.vue';
    import AppLayout from '@/layouts/AppLayout.vue';
    import { getAllAreasFromLocalStorage, setAreasToLocalStorage } from '@/utils';
    import { ref } from 'vue';

    const areasFromLocalStorage = ref(JSON.parse(getAllAreasFromLocalStorage()));
    const areasUpdatedFromLocalStorage = ref([...JSON.parse(getAllAreasFromLocalStorage())]);

    const addArea = () => areasUpdatedFromLocalStorage.value.push({ "strArea": "", "strCountry": "" });
    const removeArea = (index) => areasUpdatedFromLocalStorage.value.splice(index, 1);
    const saveChanges = () => {
        setAreasToLocalStorage(areasUpdatedFromLocalStorage.value);
        window.location.href = "/";
    };
</script>

<template>
    <AppLayout>
        <template #title> Кухни </template>
        <template #controls>
            <AppButton text="Сохранить" @click="saveChanges" />
        </template>
        <template #inner>
            <div class="row" v-if="areasUpdatedFromLocalStorage !== null || areasUpdatedFromLocalStorage.length !== 0" v-for="(area, index) in areasUpdatedFromLocalStorage" :key="`${index}`">
                <div class="col">
                    <el-input v-model="areasUpdatedFromLocalStorage[index].strArea" placeholder="Кухня" />
                </div>
                <div class="col">
                    <el-input v-model="areasUpdatedFromLocalStorage[index].strCountry" placeholder="Страна" />
                </div>
                <div class="col col-small button">
                    <AppButton text="Удалить" @click="() => removeArea(index)" />
                </div>
            </div>
            <div class="" style="padding-bottom: 10px; font-size: 18px;" v-if="areasUpdatedFromLocalStorage == null || areasUpdatedFromLocalStorage.length == 0">Нет кухонь...</div>
            <AppButton text="Добавить кухню" @click="addArea" />
        </template>
    </AppLayout>
</template>