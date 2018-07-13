<template>
    <v-flex xs12 sm3>
        <v-text-field 
            label="Content..." 
            prepend-icon="search"
            @input="searchFiles"
            v-model="organization.searchContent" />
    </v-flex>
</template>

<script>
    import debounce from "lodash.debounce"
    import store from "store"

    export default {
        data () {
            return {
                organization: this.$store.state.organization
            }
        },
        methods: {
            searchFiles() {
                this.sendSearchRequest()
            },
            sendSearchRequest: debounce(() => {
                store.dispatch("organization/loadFileListAdvanced")
            }, 500)
        }
    }
</script>