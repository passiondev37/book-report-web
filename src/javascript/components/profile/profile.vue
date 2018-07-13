<template>
    <component v-bind:is="currentView" ref="profileView"></component>
</template>

<script>
    // Dynamic components for profile edit
    import editProfileComponent from "./edit/edit.vue"
    import passwordComponent from "./edit/password.vue"
    import initProfileComponent from "./edit/init.vue"

    export default {
        name: "profile",
        components: {
            edit: editProfileComponent,
            password: passwordComponent,
            init: initProfileComponent
        },
        computed: {
            currentView() {
                // URL1 = ["password", "edit"]
                return this.$route.name === "Profile" 
                    ? "edit" 
                    : this.$route.name === "Profile Information" 
                        ? "init" 
                        : "password" // Default dynamic component is "edit.vue"
            }
        },
        beforeMount() {
            console.info(":// Display profile component with route", this.$route.params)
        }
    }
</script>