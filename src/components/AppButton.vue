<script setup>
    const props = defineProps({
        text: {
            type: String,
            default: "",
        },
    });
</script>

<template>
    <el-button type="primary" class="btn">{{ text }}</el-button>
</template>

<style lang="scss" scoped>
    @import "../assets/styles/variables.scss";

    .btn {
        font-size: 18px;
        padding: 20px 24px;
        border-radius: 4px;
        border: none;
        background-color: $violet;
    }
</style>