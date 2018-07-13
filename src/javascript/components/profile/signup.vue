<template>
    <v-card class="card-small">
        <v-card-media src="images/logo-grid.png" height="96px" padding="30px"></v-card-media>
        <v-card-text class="login-input">
            <v-form v-model="valid" ref="form">
                <v-text-field
                    v-model="email"
                    label="Enter Email"
                    required
                    v-bind:rules="emailRules"
                    v-bind:disabled="$store.state.userProfile.displayProgressBar"
                >
                </v-text-field>
                <!-- <v-text-field
                    v-model="password"
                    label="Enter your password"
                    hint="At least 8 characters"
                    min="8" type="password"
                    required
                    v-bind:rules="passwordRules"
                    v-bind:disabled="$store.state.userProfile.displayProgressBar"
                >
                </v-text-field>
                <v-text-field
                    v-model="passwordRepeat"
                    label="Enter password again"
                    hint="At least 8 characters"
                    min="8" type="password"
                    required
                    v-bind:rules="passwordRules"
                    v-bind:disabled="$store.state.userProfile.displayProgressBar"
                >
                </v-text-field> -->
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn flat class="indigo--text" @click.native="signUp">Register me</v-btn>
        </v-card-actions>
        <v-progress-linear v-if="$store.state.displayProgressBar" v-bind:indeterminate="true"></v-progress-linear>
        <v-alert
            dismissible="dismissible"
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

    export default {
        data() {
            return {
                valid: false,

                email: "",
                // password: "",
                // passwordRepeat: "",

                emailRules: [
                    (v) => !!v || "E-mail is required",
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid"
                ],
                // passwordRules: [
                //     (v) => !!v || "Password is required",
                //     (v) => v.length > 7 || "At least 8 characters",
                //     (v) => v === this.password || "Password should match"
                // ]
            }
        },
        beforeMount() {
            console.info(":// Display signup component")
        },
        methods: {

            signUp() {

                if (this.$refs.form.validate()) {

                    this.$store.dispatch(
                        "userProfile/signUp",
                        { email: this.email },
                        { root: true }
                    )

                }
            }

        }
    }
</script>