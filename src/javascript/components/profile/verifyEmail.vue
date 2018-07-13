<template>
    <v-container text-xs-center>
        <v-progress-circular indeterminate :size="70" :width="7" color="purple" />
    </v-container>
</template>

<script>
    import store from "../../store"
    import urls from "../../router/urls"

    export default {
        props: ['token'],
        data() {
            return {
            }
        },
        beforeMount() {
            console.info(":// Display verifyEmail component")
            this.verifyEmail()
        },
        methods: {
            verifyEmail() {
                this.$store.dispatch(
                    "userProfile/verifyEmail",
                    { token: this.token },
                    { root: true }
                )
            }
        }
    }
</script>
