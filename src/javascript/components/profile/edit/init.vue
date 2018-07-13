<template>
    <v-card class="grey lighten-4 elevation-0 card-medium">
        <v-card-title class="indigo white--text">
            <span class="headline">Profile Information</span>
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="saveProfileForm">
                <v-layout row>
                    <v-flex xs4>
                        <v-subheader class="subheader">First Name</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field 
                            v-model="firstName" 
                            label="First Name"
                            :rules="firstNameRules"
                            required />
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs4>
                        <v-subheader class="subheader">Last Name</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field
                            v-model="lastName"
                            label="Last Name"
                            :rules="lastNameRules"
                            required />
                    </v-flex>
                </v-layout>
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
                <v-flex xs12>
                    <v-btn flat color="primary" @click.native="save">Save</v-btn>
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
    import urls from "../../../router/urls"

    export default {
        data() {
            return {
                // Forms data
                valid: false,

                firstName: "",
                lastName: "",
                password: "",
                passwordRepeat: "",

                // Forms check
                firstNameRules: [
                    (v) => !!v || 'First Name is required'
                ],
                lastNameRules: [
                    (v) => !!v || 'Last Name is required'
                ],
                passwordRules: [
                    (v) => !!v || "Password is required",
                    (v) => v.length > 7 || "At least 8 characters",
                    (v) => v === this.password || "Password should match"
                ]
            }
        },
        computed: {
        },
        methods: {
            async save() {
                if (this.$refs.saveProfileForm.validate()) {
                    let result = await this.$store.dispatch(
                        "userProfile/initProfile",
                        {
                            firstName: this.firstName,
                            lastName: this.lastName,
                            newPassword: this.password
                        },
                        { root: true }
                    )

                    if (result) {
                        if (this.$route.query && this.$route.query.engagementId) {
                            let acceptRejectUrl = "/engagements/" + this.$route.query.engagementId
                                + "?decision=" + this.$route.query.decision
                            this.$store.dispatch("navigateTo", acceptRejectUrl, {root: true})
                        } else {
                            this.$store.dispatch("navigateTo", urls.engagements, { root: true })
                        }
                    }
                }
            },

            close() {
                this.$store.dispatch("navigateTo", "/", { root: true })
            }
        }
    }
</script>