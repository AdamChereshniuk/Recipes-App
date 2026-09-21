<script setup>
    import { getAllUsersFromLocalStorage } from '@/utils/getAllUsersFromLocalStorage';
    import { setUsersToLocalStorage } from '@/utils/setUsersToLocalStorage';
    import { ref } from 'vue';
</script>

<template>
    <div class="reset-password">
        <div class="container">
            Hello
            <!-- <div class="title">Восстановить пароль</div>
            <div v-if="tokenParam !== resetPasswordToken" style="color: red;">Токены не совпадают</div>
            <div v-if="tokenParam === resetPasswordToken">
                <div class="reset-password__wrapper">
                    <span class="reset-password-email">{{ emailToResetPassword }}</span>
                    <input type="text" placeholder="Новый пароль" class="input" v-model="newPassword">
                </div>
                <span class="reset-password__error" v-if="error !== ''">{{ error }}</span>
                <button class="btn" @click="setNewPassword">Готово</button>
            </div> -->
        </div>
    </div>
</template>

<style lang="scss">
    .reset-password {
        padding: 80px 0;

        &-email {
            display: flex;
            align-items: center;
            border-radius: 4px;
            padding: 10px 20px;
            background-color: #ccc;
            color: #666666;
            height: 100%;
        }

        &__wrapper {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            align-items: center;
            gap: 24px;
            margin: 20px 0;
        }

        &__error {
            display: block;
            color: red;
            margin-bottom: 20px;
        }
    }
</style>