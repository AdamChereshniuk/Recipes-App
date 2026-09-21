<script setup>
    import { ROUTES_PATHS } from "@/constants";
    import { supabase } from "@/lib/supabase";
    import { Meals } from "@/data";
    import { ref } from "vue";

    // Переменные
    const meals = Meals;

    // Refs
    const error = ref("");
    const newUser = ref({
        firstName: "",
        lastName: "",
        nickname: "",
        avatarUrl: "https://avatars.mds.yandex.net/i?id=3987ef4f15ef6522457807f94791211125e6f471-4337050-images-thumbs&n=13",
        email: "",
        password: "",
    });

    // Методы
    async function registerUserToSupabase(email, password, firstName, lastName, nickname, avatarUrl) {
        error.value = "";

        const { data, err } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    nickname: nickname,
                    avatar_url: avatarUrl,
                },
            },
        });

        if (err) {
            if (err.code === "UserAlreadyExists") {
                error.value = "Такой email уже зарегистрирован";
            } else {
                error.value = err.code;
            };

            return;
        };

        window.location.href = ROUTES_PATHS.LOGIN;
    };
    const registerUser = () => {
        const newUserObj = newUser.value;

        if(newUserObj.firstName !== "" && newUserObj.lastName !== "" && newUserObj.nickname !== "" && newUserObj.email !== "" && newUserObj.password !== "" && newUserObj.avatarUrl !== "") {
            registerUserToSupabase(newUserObj.email, newUserObj.password, newUserObj.firstName, newUserObj.lastName, newUserObj.nickname, newUserObj.avatarUrl);
        } else if(newUserObj.firstName == "" || newUserObj.lastName == "" || newUserObj.nickname == "" || newUserObj.email == "" || newUserObj.password == "" || newUserObj.avatarUrl == "") {
            error.value = "Заполните все поля";
        };
    };
</script>

<template>
    <div class="register">
        <div class="container">
            <div class="register__inner">
                <div class="register__content">
                    <span class="title">Регистрация</span>
                    <form class="register-form" @submit.prevent="registerUser">
                        <div class="register-form__inputs">
                            <input class="register-form__input" type="text" placeholder="Имя" v-model="newUser.firstName">
                            <input class="register-form__input" type="text" placeholder="Фамилия" v-model="newUser.lastName">
                        </div>
                        <div class="register-form__inputs">
                            <input class="register-form__input" type="email" placeholder="Email" v-model="newUser.email">
                            <input class="register-form__input" type="password" placeholder="Пароль" v-model="newUser.password">
                        </div>
                        <div class="register-form__inputs">
                            <input class="register-form__input" type="text" placeholder="Никнейм" v-model="newUser.nickname">
                            <input class="register-form__input" type="text" placeholder="Ссылка на аватар" v-model="newUser.avatarUrl">
                        </div>

                        <span class="register-form__error" v-if="error !== ''">{{ error }}</span>

                        <div class="register-form__bottom">
                            <span class="register-form__bottom-text">
                                Уже есть аккаунт?
                                <router-link :to="ROUTES_PATHS.LOGIN">Войти</router-link>
                            </span>
                            <button class="btn" type="submit">Зарегистрироваться</button>
                        </div>
                    </form>
                </div>
                <!-- <div class="register__images">
                    <img :src="meal.strMealThumb" :alt="meal.strMeal" v-for="meal in meals.filter((meal, index) => index < 3)">
                </div> -->
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../assets/styles/index.scss";

    .register {
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

                &-text {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;

                    & > a {
                        display: block;
                        color: #FF9500;
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