<script setup>
    import "@/assets/styles/index.scss";
    import { onMounted } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { ROUTES_PATHS } from "@/constants";

    const route = useRoute();

    // Функция для проверки активен ли путь
    const isPathActive = (path) => {
        return route.path === path;
    };
</script>

<template>
    <div class="menu">
        <div class="logo">
            <router-link :to="ROUTES_PATHS.HOME">
                <img src="../assets/images/logo.png" alt="Лого">
            </router-link>
        </div>
        <el-menu class="el-menu-vertical-demo nav" :router="true">
            <el-menu-item :class="['item', isPathActive(ROUTES_PATHS.HOME) && 'active']" :index="ROUTES_PATHS.HOME">
                <el-icon :size="24"><Food /></el-icon>
            </el-menu-item>
            <el-menu-item :class="['item', isPathActive(ROUTES_PATHS.CATEGORIES) && 'active']" :index="ROUTES_PATHS.CATEGORIES">
                <el-icon :size="24"><Dish /></el-icon>
            </el-menu-item>
            <el-menu-item :class="['item', isPathActive(ROUTES_PATHS.AREAS) && 'active']" :index="ROUTES_PATHS.AREAS">
                <el-icon :size="24"><KnifeFork /></el-icon>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style lang="scss" scoped>
    @import "../assets/styles/variables.scss";

    .logo {
        padding: 0 15px 15px;
        border-bottom: 1px solid $border;

        & img {
            width: 40px;
            height: 40px;
        }
    }

    .menu {
        height: 100vh;
        padding: 20px 5px 0;
        border-right: 1px solid $border;
    }

    .nav {
        border: none;
    }

    .item {
        color: $violet;

        &.active {
            color: $pink;
        }
    }
</style>