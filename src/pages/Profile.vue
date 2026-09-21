<script setup>
    import { useProfile } from "@/composable/useProfile";
    import { useAuth } from "@/composable/useAuth";
    import { ROUTES_PATHS } from "@/constants";
    import { onMounted } from "vue";
    import { ref } from "vue";
    import user_icon from "@/assets/images/user.svg";

    // useAuth && useProfile
    const { user, logout } = useAuth();
    const { profile, error, fetchProfile, updateProfile } = useProfile();
    
    // Refs
    const newData = ref({
        firstName: user.value.user_metadata.first_name,
        lastName: user.value.user_metadata.last_name,
        email: user.value.user_metadata.email,
        nickname: user.value.user_metadata.nickname,
    });
    const emailForPasswordReset = ref(user.value.email);
    const currentPassword = ref("");
    const newPassword = ref("");
    const newDataError = ref("");
    const newPasswordError = ref("");

    // Методы
    async function updateProfileToSupabase(firstName, lastName, nickname, email, avatarUrl) {
        try {
            await updateProfile(user.value.id, {
                first_name: firstName,
                last_name: lastName,
                nickname: nickname,
                email: email,
            });

            // window.location.href = ROUTES_PATHS.PROFILE;
        } catch (err) {
            newDataError.value = err.message || "Ошибка при сохранении профиля";
        };
    };
    const setNewData = () => {
        const newDataFirstNameValue = newData.value.firstName.trim().replaceAll(" ", "");
        const newDataLastNameValue = newData.value.lastName.trim().replaceAll(" ", "");
        const newDataNicknameValue = newData.value.nickname.trim().replaceAll(" ", "");
        const newDataEmailValue = newData.value.email.trim().replaceAll(" ", "");
        const newDataAvatarUrlValue = newData.value.avatarUrl !== null && newData.value.avatarUrl !== undefined && newData.value.avatarUrl !== "" ? newData.value.avatarUrl.trim().replaceAll(" ", "") : undefined;

        if(newDataFirstNameValue !== "" && newDataLastNameValue !== "" && newDataNicknameValue !== "" && newDataEmailValue !== "") {
            updateProfileToSupabase(newDataFirstNameValue, newDataLastNameValue, newDataNicknameValue, newDataEmailValue, newDataAvatarUrlValue);
        } else if(newDataFirstNameValue == "" || newDataLastNameValue == "" || newDataNicknameValue == "" || newDataEmailValue == "") {
            newDataError.value = "Заполните все поля";
        };
    };
    const logoutUser = () => {
        logout();
    };

    // onMounted
    onMounted(async () => {
        if (user.value) await fetchProfile(user.value.id);
    });

    // const setNewPassword = () => {
    //     const emailForPasswordResetValue = emailForPasswordReset.value.trim().replaceAll(" ", "");
    //     const currentPasswordValue = currentPassword.value.trim().replaceAll(" ", "");
    //     const newPasswordValue = newPassword.value.trim().replaceAll(" ", "");
        
    //     if(emailForPasswordResetValue !== "" && currentPasswordValue !== "" && newPasswordValue !== "" && emailForPasswordResetValue === currentUser.email && currentPasswordValue === currentUser.password) {
    //         const currentUserCopy = {...currentUser};
    //         currentUserCopy.password = newPasswordValue;

    //         setCurrentUserToLocalStorage(currentUserCopy);
    //         setUsersToLocalStorage([
    //             ...users.filter(user => user.id !== currentUser.id),
    //             currentUserCopy,
    //         ]);

    //         window.location.href = ROUTES_PATHS.PROFILE;
    //     } else if(emailForPasswordResetValue == "" || currentPasswordValue == "" || newPasswordValue == "") {
    //         newPasswordError.value = "Заполните все поля";
    //     } else if(emailForPasswordResetValue !== currentUser.email) {
    //         newPasswordError.value = "Введите корректный email";
    //     } else if(currentPasswordValue !== currentUser.password) {
    //         newPasswordError.value = "Введите корректный текущий пароль";
    //     };
    // };
</script>

<template>
    <div class="profile">
        <div class="container">
            <div class="profile__inner">
                <div class="profile-top">
                    <div class="profile-top__user">
                        <img :src="user.user_metadata.avatar_url !== undefined && user.user_metadata.avatar_url !== null ? user.user_metadata.avatar_url : user_icon" :alt="user.user_metadata.first_name">
                        <span class="profile-top__name title">{{ user.user_metadata.first_name }} {{ user.user_metadata.last_name }}</span>
                    </div>
                    <div class="profile-top__data">
                        <span class="profile-top__nickname">@{{ user.user_metadata.nickname }}</span>
                        <span class="profile-top__email">{{ user.user_metadata.email }}</span>
                    </div>
                    <button class="btn" @click="logoutUser">Выйти из профиля</button>
                </div>
                <div class="profile-center">
                    <!-- <ul class="profile-center__list">
                        <li class="profile-center__item">
                            <span class="profile-center__item-suptitle">Рецепты</span>
                            <span class="profile-center__item-title">{{ user.user_metadata.mealsIds == null ? 0 : user.user_metadata.mealsIds }}</span>
                        </li>
                        <li class="profile-center__item">
                            <span class="profile-center__item-suptitle">Избранное</span>
                            <span class="profile-center__item-title">{{ user.user_metadata.favoriteIds == null ? 0 : user.user_metadata.favoriteIds }}</span>
                        </li>
                    </ul> -->
                </div>
                <div class="profile-bottom">
                    <ul class="profile-bottom__list">
                        <li class="profile-bottom__item">
                            <span class="title">Изменить данные</span>
                            <div class="profile-bottom__card">
                                <div class="profile-bottom__inputs">
                                    <input class="input" type="text" placeholder="Имя" v-model="newData.firstName">
                                    <input class="input" type="text" placeholder="Фамилия" v-model="newData.lastName">
                                </div>
                                <div class="profile-bottom__inputs">
                                    <input class="input" type="text" placeholder="Email" v-model="newData.email">
                                    <input class="input" type="text" placeholder="Никнейм" v-model="newData.nickname">
                                </div>
                                <input class="input" type="text" placeholder="Ссылка на аватар" v-model="newData.avatarUrl">
                                <span class="profile-bottom__error" v-if="newDataError !== ''">{{ newDataError }}</span>
                                <button class="btn" style="width: 100%;" @click="setNewData">Сохранить</button>
                            </div>
                        </li>
                        <li class="profile-bottom__item">
                            <span class="title">Новый пароль</span>
                            <div class="profile-bottom__card">
                                <input class="input" type="text" placeholder="Email" v-model="emailForPasswordReset">
                                <input class="input" type="text" placeholder="Текущий пароль" v-model="currentPassword">
                                <input class="input" type="text" placeholder="Новый пароль" v-model="newPassword">
                                <span class="profile-bottom__error" v-if="newPasswordError !== ''">{{ newPasswordError }}</span>
                                <button class="btn" style="width: 100%;" @click="() => {}">Сохранить</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../assets/styles/index.scss";

    .profile {
        padding: 100px 0;

        &-top {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;

            &__user {
                display: flex;
                align-items: center;
                gap: 20px;

                & > img {
                    width: 80px;
                    height: 80px;
                }
            }

            &__data {
                display: flex;
                align-items: center;
                gap: 40px;
            }

            &__nickname {
                font-weight: 500;
                color: #FF9500;
            }

            &__email {
                font-weight: 500;
            }
        }

        &-center {
            margin-bottom: 100px;

            &__list {
                display: flex;
                align-items: stretch;
                gap: 20px;
                margin: 0;
                padding: 0;
            }

            &__item {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 40px;
                padding: 20px;
                border-radius: 20px;
                border: 1px solid #FF9500;
                // height: 100%;
                width: 350px;

                &-suptitle {
                    font-size: 20px;
                    font-weight: 500;
                }

                &-title {
                    font-size: 24px;
                    font-weight: 700;
                }
            }
        }

        &-bottom {
            &__list {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
                padding: 0;
            }

            &__item {
                display: flex;
                flex-direction: column;
                gap: 30px;
                width: 100%;
            }

            &__card {
                display: flex;
                flex-direction: column;
                gap: 20px;
                padding: 20px;
                border-radius: 20px;
                box-shadow: 4px 4px 60px 0px rgba(0, 0, 0, 0.2);
                background-color: rgba(255, 255, 255, 1);
            }

            &__inputs {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                align-items: center;
                gap: 30px;
            }

            &__error {
                display: block;
                margin-top: 10px;
                color: red;
            }
        }
    }
</style>