<template>
    <v-card class="grey lighten-4 elevation-0 card-medium">
        <v-card-title class="indigo white--text">
            <!-- Reset route--><span class="headline" v-if="currentView.resetPassword">Reset Password</span>
            <!-- Restored route--><span class="headline" v-else-if="currentView.resetPasswordCompleted">Reset Complete</span>
            <!-- Default changing pass route--><span class="headline" v-else>Change Password</span>
        </v-card-title>
        <!-- Reset route-->
        <v-card-text class="reset-password-card" v-if="currentView.resetPassword">
            <v-layout row>
                <v-flex xs4>
                    <v-subheader class="subheader-message">
                        Enter your email address you used to register.
                        We'll send you an email with your username and a link to
                        reset your password.
                    </v-subheader>
                </v-flex>
                <v-flex xs8 class="text-input">
                    <v-form v-model="valid" ref="resetPasswordForm">
                        <v-text-field
                            v-model="email"
                            label="Email"
                            required
                            v-bind:rules="emailRules"
                        >
                        </v-text-field>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-card-text>
        <!-- Restored route-->
        <v-card-text class="reset-password-card" v-else-if="currentView.resetPasswordCompleted">
            <v-layout row>
                <v-flex xs12>
                    <v-subheader class="subheader-message">
                        A message is sent to your email address with your username and
                        a link to reset your password. Please check your email.
                    </v-subheader>
                </v-flex>
            </v-layout>
        </v-card-text>
        <!-- Default changing pass route-->
        <v-card-text v-else>
            <v-form v-model="valid" ref="savePasswordForm">
                <v-layout row>
                    <v-flex xs4>
                        <v-subheader>New Password</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field
                            v-model="password"
                            label="Enter new password"
                            hint="At least 8 characters"
                            min="8" type="password"
                            v-bind:rules="passwordRules"
                            v-bind:disabled="$store.state.userProfile.displayProgressBar"
                            required
                        >
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs4>
                        <v-subheader>Confirm Password</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field
                            v-model="passwordRepeat"
                            label="Confirm password"
                            hint="At least 8 characters"
                            min="8" type="password"
                            v-bind:rules="passwordRules"
                            v-bind:disabled="$store.state.userProfile.displayProgressBar"
                            required
                        >
                        </v-text-field>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-layout row>
                <!-- Reset route-->
                <v-flex xs12 v-if="currentView.resetPassword">
                    <v-btn flat color="primary" @click.native="resetPassword">Reset</v-btn>
                    <v-btn flat class="indigo--text" @click.native="close">Cancel</v-btn>
                </v-flex>
                <!-- Restored route-->
                <v-flex xs12 v-else-if="currentView.resetPasswordCompleted">
                    <v-btn flat color="primary" href="#/login">Login</v-btn>
                </v-flex>
                <!-- Default changing pass route-->
                <v-flex xs12 v-else>
                    <v-btn flat color="primary" @click.native="savePassword">Save</v-btn>
                    <v-btn flat class="indigo--text" @click.native="close">Close</v-btn>
                </v-flex>
            </v-layout>
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
    export default {
        data() {
            return {
                // Forms data
                valid: false,

                email: "",
                password: "",
                passwordRepeat: "",

                // Forms check
                emailRules: [
                    (v) => !!v || "E-mail is required",
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid"
                ],
                passwordRules: [
                    (v) => !!v || "Password is required",
                    (v) => v.length > 7 || "At least 8 characters",
                    (v) => v === this.password || "Password should match"
                ]
            }
        },
        computed: {
            // URL router
            currentView() {
                return {
                    resetPassword: this.$route.name === "Profile | Reset Password",
                    resetPasswordCompleted: this.$route.name === "Profile | Reset Complete"
                }
            }
        },
        methods: {
            savePassword() {
                if (this.$refs.savePasswordForm.validate()) {
                    this.$store.dispatch(
                        "userProfile/savePassword",
                        this.password,
                        { root: true }
                    )
                }
            },

            resetPassword() {

                if (this.$refs.resetPasswordForm.validate()) {
                    this.$store.dispatch(
                        "userProfile/resetPassword",
                        { Email: this.email },
                        { root: true }
                    )
                }

            },

            close() {
                this.$store.dispatch("navigateTo", "/", { root: true })
            }
        }
    }
</script>