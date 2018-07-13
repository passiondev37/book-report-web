import User from "../../models/user"
import localStorageService from "../../service/local/storage"
import userProfileService from "../../service/network/userProfileService"
import { warningAlert } from "../../models/alert"
import organization from "./organization"

import urls from "../../router/urls"

export default {
    namespaced: true,
    state: {
        user: localStorageService.getUser(),
        profileMenu: [
            {
                title: "Profile",
                icon: "account_circle",
                url: urls.profile
            },
            {
                title: "Change password",
                icon: "mode_edit",
                url: urls.profileChangePassword
            },
            {
                title: "Logout",
                icon: "eject",
                url: urls.logout
            }
        ]
    },
    mutations: {
        loginUser (state, userData) {
            console.log(`[ Vuex ]: OK Auth, saving to localStorage: `, userData)

            state.user = localStorageService.setUser(new User(userData))
        },

        clearUser(state, shouldRemove = false) {
            console.log(`[ Vuex ]: clearUser, shouldRemove = ${shouldRemove}`)

            state.user = localStorageService.setGuest(state.user, shouldRemove)

        }
    },
    actions: {
        async saveProfile({ state, dispatch }) {
            const { firstName, lastName } = state.user;
            console.log(`[ Vuex ]: saving User profile: user.firstName = ${firstName}, user.lastName = ${lastName}`)

            state.user.displayName = `${firstName} ${lastName}`

            localStorageService.setUser(state.user)

            try {
                const data = {
                    'FirstName': firstName,
                    'LastName': lastName
                }
                const result = await userProfileService.updateUser(state.user.id, data)

                if (result) {
                    console.log("Close component view")
                    dispatch("navigateTo", urls.index, { root: true })
                }

            } catch (networkException) {
                console.error("[ Vuex ]: networkException in saveProfile: ", networkException.message)
            }
        },

        async savePassword({ state, dispatch }, newPassword) {
            console.log(`[ Vuex ]: <savePassword> action in store`)

            try {

                const result = await userProfileService.changePasswordForUser(state.user, newPassword)

                if (result) {
                    console.log("Close component view")
                    dispatch("navigateTo", urls.index, { root: true })
                }

            } catch (networkException) {
                console.error("[ Vuex ]: networkException in changePasswordForUser: ", networkException.message)
            }
        },

        async initProfile({ state, dispatch }, data) {
            console.log(`[ Vuex ]: <initProfile> action in store`)

            const { firstName, lastName, newPassword } = data

            state.user.firstName = firstName
            state.user.lastName = lastName
            state.user.displayName = `${firstName} ${lastName}`

            localStorageService.setUser(state.user)

            try {
                const changePasswordResult = await userProfileService.changePasswordForUser(state.user, newPassword)

                const data = {
                    'FirstName': firstName,
                    'LastName': lastName
                }
                const updateProfileResult = await userProfileService.updateUser(state.user.id, data)

                if (changePasswordResult && updateProfileResult) {
                    console.log("Close component view")
                    return true
                }

            } catch (networkException) {
                console.error("[ Vuex ]: networkException in initProfile: ", networkException.message)
            }

            return false
        },

        async resetPassword({ dispatch }, emailData) {
            console.log(`[ Vuex ]: <resetPassword> action in store with [email: ${emailData.Email}]`)

            try {
                const result = await userProfileService.resetPasswordToEmail(emailData)

                console.log(`Result in resetPassword:`, result)

                if (result) {
                    console.log("Display sent result component view")
                    dispatch("navigateTo", urls.profileResetPasswordCompleted, { root: true })
                }

            } catch (networkException) {
                console.error("[ Vuex ]: networkException in resetPassword: ", networkException.message)
            }
        },

        async logIn ({ state, commit, dispatch }, userFormAuthData) {
            console.log(
            `[ Vuex ]: <Login> action in store with [username: ${userFormAuthData.username}]`
            );

            try {
                await userProfileService.logInWithCredentials(userFormAuthData)

                if (this.state.userProfile.user.emailConfirmed) {
                    await organization.actions.loadProjects(commit)
                    if (organization.state.projects.length > 0) {
                        dispatch("navigateTo", urls.projects, { root: true })
                    } else {
                        dispatch("navigateTo", urls.engagements, { root: true })
                    }
                }

            } catch (networkException) {
                console.error("[ Vuex ]: networkException in logIn: ", networkException.message)
            }
        },
        async signUp ({ state, commit, dispatch }, newUserData) {
            console.log(`[ Vuex ]: <Sign Up> action with data: `, newUserData);

            // dispatch(
            //     "notification/showAlert",
            //     new warningAlert("Registering coming soon..."),
            //     { root: true }
            // );
            try {
                await userProfileService.signupWithEmail(newUserData)
            } catch (networkException) {
                console.error("[ Vuex ]: networkException in signUp: ", networkException.message)
            }

        },
        async verifyEmail ({ dispatch }, tokenData) {
            console.log(
            `[ Vuex ]: <VerifyEmail> action in store with [token: ${tokenData.token}]`
            );

            try {
                await userProfileService.verifyEmailWithToken(tokenData)
                            
                dispatch("navigateTo", urls.profileInit, { root: true })
            } catch (networkException) {
                console.error("[ Vuex ]: networkException in verifyEmail: ", networkException.message)
            }
        },
        async verifyEmailFromEngagement ({ dispatch }, tokenData) {
            console.log(
            `[ Vuex ]: <VerifyEmail> action in store with [token: ${tokenData.token}]`
            );

            try {
                await userProfileService.verifyEmailWithToken({ token: tokenData.token })
                let queryString = 
                    "?engagementId=" + tokenData.engagementId
                    + "&decision=" + tokenData.decision
                dispatch("navigateTo", urls.profileInit + queryString, { root: true })
            } catch (networkException) {
                console.error("[ Vuex ]: networkException in verifyEmail: ", networkException.message)
            }
        },
        logOut ({ state, commit, dispatch }) {
            console.log(`[ Vuex ]: <logOut> action`)

            commit("clearUser")
            dispatch("navigateTo", "/login", { root: true })
        }
    }
}