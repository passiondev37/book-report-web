<template>
    <v-card class="grey lighten-4 elevation-0 card-medium">
        <v-card-title class="indigo white--text"><span class="headline">My Profile</span></v-card-title>
        <v-card-text>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader class="subheader">Email</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-bind:value="user.emails[0]" label="Email" disabled></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader class="subheader">First Name</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader class="subheader">Last Name</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-layout row>
                <v-flex xs12>
                    <v-btn flat color="primary" @click.native="save">Save</v-btn>
                    <v-btn flat class="indigo--text" @click.native="close">Close</v-btn>
                </v-flex>
            </v-layout>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                user: this.$store.state.userProfile.user,
            }
        },
        methods: {
            save() {
                this.$store.dispatch("userProfile/saveProfile");
                this.close()
            },
            close() {
                this.$store.dispatch("navigateTo", "/", { root: true })
            }
        }
    }
</script>