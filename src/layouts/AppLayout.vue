<script setup>
    import "@/assets/styles/index.scss";
    import AppMenu from "../components/AppMenu.vue";
</script>

<template>
    <div class="root">
        <div class="menu-wrapper">
            <AppMenu />
        </div>
        <main class="main">
            <header class="header">
                <h1 class="title">
                    <slot name="title"></slot>
                </h1>
                <slot name="search"></slot>
                <div class="controls">
                    <slot name="controls"></slot>
                </div>
            </header>
            <div class="inner">
                <slot name="inner"></slot>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>
    @import "../assets/styles/variables.scss";

    .root {
        display: flex;
    }

    .menu-wrapper {
        width: 70px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .main {
        flex: 1;
        padding: 20px 16px;
    }

    .title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: $violet;
    }

    .inner {
        padding-top: 40px;
    }
</style>