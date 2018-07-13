<template>
    <v-card height="200px" class="card-medium">
        <v-card-title>
            <v-toolbar>
                <v-toolbar-title>Components
                    <v-spacer></v-spacer>
                    <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
                    <v-toolbar-items class="hidden-sm-and-down">
                        <v-btn flat href="#/profile">Profile Edit</v-btn>
                        <v-btn flat href="#/profile/password">Profile Password</v-btn>
                        <v-btn flat href="#/profile/password/reset">Password reset</v-btn>
                        <v-btn flat href="#/library">Library</v-btn>
                    </v-toolbar-items>
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>
    </v-card>
</template>

<script>
    import store from "../store"
    import urls from "../router/urls"
    
    export default {
        name: "index",
        data() {
            return {}
        },
        beforeMount() {
            console.info(":// Display Dashboard component")
        }
    }
</script>