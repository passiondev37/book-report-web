<template>
    <v-card class="card-small">
        <img src="images/bookreport.png" style="margin-left: 80px;padding-top: 20px;"></img>
        <v-card-text class="login-input">
            <v-form v-model="valid" ref="form">
                <v-text-field
                    v-model="username"
                    label="Enter Username"
                    required
                    v-bind:rules="emailRules"
                    v-bind:disabled="$store.state.userProfile.displayProgressBar"
                >
                </v-text-field>
                <v-text-field
                    v-model="password"
                    label="Enter your password"
                    hint="At least 8 characters"
                    min="8" type="password"
                    required
                    @keyup.enter="logIn"
                    v-bind:rules="passwordRules"
                    v-bind:disabled="$store.state.userProfile.displayProgressBar"
                >
                </v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn flat color="primary" @click.native="logIn">Login</v-btn>
            <v-btn flat class="indigo--text" @click.native="signUp">SignUp</v-btn>
            <v-btn flat class="indigo--text" @click.native="resetPassword">Reset password</v-btn>
        </v-card-actions>
        <v-progress-linear v-if="$store.state.displayProgressBar" v-bind:indeterminate="true"></v-progress-linear>
        <v-alert
            dismissible
            :color="alert.type"
            v-model="$store.state.notification.alerts[index]"
            v-for="(alert, index) in $store.state.notification.alerts"
            v-text="alert.message"
            :key="index"
        >
        </v-alert>
    </v-card>
</template>

<script>
    import store from "../../store"
    import urls from "../../router/urls"
    import { errorAlert } from "../../models/alert"

    export default {
        data() {
            return {
                valid: false,

                username: this.$store.state.userProfile.user.username || "",
                password: "",

                emailRules: [
                    (v) => !!v || "E-mail is required",
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid"
                ],
                passwordRules: [
                    (v) => !!v || "Password is required",
                    (v) => v.length > 7 || "At least 8 characters"
                ]
            }
        },
        beforeMount() {
            console.info(":// Display login component")
        },
        methods: {
            logIn() {

                if (this.$refs.form.validate()) {

                    const authData = { username: this.username, password: this.password };

                    this.$store.dispatch(
                        "userProfile/logIn",
                        authData,
                        { root: true }
                    )

                }

                else {
                    // Run Vuex alerts dispatch
                    this.$store.dispatch(
                        "notification/showAlert",
                        new errorAlert("Please fill username and password."),
                        { root: true }
                    )
                }
            },
            signUp() {

                this.$store.commit("userProfile/clearUser", true)
                this.$store.dispatch("navigateTo", urls.signup)

            },
            resetPassword() {
                this.$store.dispatch("navigateTo", urls.profileResetPassword)
            }
        }
    }
</script>