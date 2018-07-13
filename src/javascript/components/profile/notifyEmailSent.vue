<template>
    <v-card class="card-small">
        <v-card-text>We'll send a verification email shortly.</v-card-text>
    </v-card>
</template>

<script>

    export default {
        data() {
            return {
            }
        },
        beforeMount() {
            console.info(":// Display notifyEmailSent component")
        },
        methods: {

        }
    }
</script>