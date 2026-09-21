<script setup>
    import { ROUTES_PATHS } from "@/constants";
    import { supabase } from "@/lib/supabase";
    import { Meals } from "@/data";
    import { ref } from "vue";
    import cross from "@/assets/images/cross.svg";

    // Переменные
    const meals = Meals;

    // Refs
    const isPasswordResetModalOpen = ref(false);
    const emailForPasswordReset = ref("");
    const passwordResetModalError = ref("");
    const isSuccess = ref(false);

    const error = ref("");
    const userData = ref({
        email: "",
        password: "",
    });

    // Методы
    async function loginUserToSupabase(email, password) {
        error.value = "";

        const { data, err } = await supabase.auth.signInWithPassword({ email: email, password: password });

        if (err) {
            error.value = "Неверный email или пароль";
            return;
        };

        window.location.href = ROUTES_PATHS.HOME;
    };
    const loginUser = (e) => {
        e.preventDefault();

        const userDataObj = userData.value;

        if(userDataObj.email !== "" && userDataObj.password !== "") {
            loginUserToSupabase(userDataObj.email, userDataObj.password);
        } else if(userDataObj.email == "" || userDataObj.password == "") {
            error.value = "Заполните все поля";
        };
    };

    const sendPasswordResetEmail = async() => {
        const clearEmail = emailForPasswordReset.value.trim().replaceAll(" ", "");

        // Проверяем clearEmail
        if (clearEmail == "") {
            passwordResetModalError.value = "Введите email";
            return;
        };

        // Отправляем запрос
        try {
            await supabase.auth.resetPasswordForEmail(clearEmail);
            isSuccess.value = true;
        } catch (err) {
            passwordResetModalError.value = err.message || "Ошибка при отправке письма";
        };
    };
    const openPasswordResetModal = () => isPasswordResetModalOpen.value = true;
    const closePasswordResetModal = () => isPasswordResetModalOpen.value = false;
    // const sendPasswordResetEmail = () => {
    //     const emailForPasswordResetValue = emailForPasswordReset.value;

    //     const userFromLocalStorage = allUsers.filter(user => user.email === emailForPasswordResetValue)[0];

    //     if(emailForPasswordResetValue === null || emailForPasswordResetValue === "" || emailForPasswordResetValue.length < 11 || !emailForPasswordResetValue.includes("@gmail.com")) {
    //         passwordResetModalError.value = "Введите корректный email";
    //         return;
    //     } else if(userFromLocalStorage === undefined) {
    //         passwordResetModalError.value = "Пользователь с таким email не существует";
    //         return;
    //     };

    //     const clearEmail = emailForPasswordResetValue.trim().replaceAll(" ", "");
    //     const token = clearEmail.split("@")[0];
    //     const link = `http://localhost:5173/reset-password?token=${token}`; // https://adamchereshniuk.github.io/Recipes-App/reset-password?token=
        
    //     emailjs.init("Fdqu7e4pn5UfQo5io");
    //     emailjs.send(
    //         "service_44nj9uy",
    //         "template_f392zdj",
    //         {
    //             email: clearEmail,
    //             link: link,
    //         },
    //     )
    //     .then(response => {
    //         isSuccess.value = true;
    //         localStorage.setItem("resetPasswordToken", token);
    //     })
    //     .catch(error => console.log("Возникла ошибка:", error));
    // };
</script>

<template>
    <div class="login">
        <div class="container">
            <div class="login__inner">
                <div class="login__content">
                    <span class="title">Вход</span>
                    <form class="login-form" @submit="loginUser">
                        <div class="login-form__inputs">
                            <input class="login-form__input" type="email" placeholder="Email" v-model="userData.email">
                            <input class="login-form__input" type="password" placeholder="Пароль" v-model="userData.password">
                        </div>

                        <span class="login-form__error" v-if="error !== ''">{{ error }}</span>

                        <div class="login-form__bottom">
                            <div class="login-form__bottom-texts">
                                <span class="login-form__bottom-text">
                                    Ещё нет аккаунта?
                                    <router-link :to="ROUTES_PATHS.REGISTER">Регистрация</router-link>
                                </span>
                                <span class="login-form__bottom-text">
                                    Забыли пароль?
                                    <div @click="openPasswordResetModal">Восстановить</div>
                                </span>
                            </div>
                            <button class="btn" type="submit">Войти</button>
                        </div>
                    </form>
                </div>
                <div class="login__images">
                    <img :src="meal.strMealThumb" :alt="meal.strMeal" v-for="meal in meals.filter((meal, index) => index < 3)">
                </div>
            </div>
        </div>
    </div>
    <div class="modal" v-if="isPasswordResetModalOpen">
        <div class="modal__box">
            <button class="modal__cross" @click="closePasswordResetModal">
                <img class="modal__cross-img" :src="cross" alt="Крестик">
            </button>
            <div class="modal__content" v-if="isSuccess == false">
                <span class="modal__title">Восстановление пароля</span>
                <input class="modal__input" type="email" placeholder="Email" v-model="emailForPasswordReset">
                <span class="modal__error" v-if="passwordResetModalError !== ''">{{ passwordResetModalError }}</span>
                <div class="modal__btns">
                    <button class="modal__cancel-btn" @click="closePasswordResetModal">Отмена</button>
                    <button class="modal__submit-btn" @click="sendPasswordResetEmail">Отправить</button>
                </div>
            </div>
            <div class="modal__content" v-if="isSuccess == true">
                <span class="title" style="color: #FF9500;">Готово!</span>
                <span style="margin-top: 10px; text-align: center;">Письмо с ссылкой на восстановление пароля отправлена на {{ emailForPasswordReset }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../assets/styles/index.scss";

    .login {
        padding: 60px 0;

        &__inner {
            display: flex;
            flex-direction: column;
        }
        
        &-form {
            display: flex;
            flex-direction: column;

            &__inputs {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                align-items: center;
                gap: 30px;
                margin-top: 40px;
            }

            &__input {
                font-family: "Montserrat", sans-serif;
                font-size: 16px;
                font-weight: 400;
                padding: 12px 16px;
                border: none;
                outline: none;
                border-bottom: 1px solid #000;
                color: #000;

                &::placeholder {
                    color: #000;
                }
            }

            &__bottom {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 50px;

                &-texts {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                &-text {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;

                    & > a, & > div {
                        display: block;
                        color: #FF9500;
                        background-color: transparent;
                        border: none;
                        outline: none;
                        font-family: "Montserrat", sans-serif;
                        font-size: 16px;
                        font-weight: 500;
                        margin: 0;
                        padding: 0;
                        cursor: pointer;
                    }
                }
            }

            &__error {
                display: block;
                margin-top: 25px;
                color: red;
            }
        }

        &__images {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: center;
            gap: 20px;
            margin-top: 100px;

            & > img {
                width: 100%;
                height: 100%;
                max-height: 360px;
                border-radius: 20px;
            }
        }
    }
</style>