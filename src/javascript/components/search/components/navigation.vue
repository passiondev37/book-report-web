<template>
    <v-layout row>
        <v-flex xs12>
            <v-btn class="ma-0 mb-2 mr-3" flat color="primary" @click="goToBasicSearch">Back to basic search</v-btn>
            <edit-organization-tag />
        </v-flex>
    </v-layout>
</template>

<script>
    import EditOrganizationTag from "./editOrganizationTag.vue"

    export default {
        components: {
            EditOrganizationTag
        },
        data () {
            return {}
        },
        methods: {
            goToBasicSearch () {
                this.$store.commit("organization/setLibrarySearchMode", 'basic')
            }
        }
    }
</script>