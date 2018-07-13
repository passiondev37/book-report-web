<template>
    <v-flex xs12 sm3>
        <v-select
            label="Tag..."
            prepend-icon="search"
            multiple
            tags
            @input="searchFiles"
            v-model="organization.searchTag"
            :items="tags"
        ></v-select>
    </v-flex>
</template>

<script>
    import debounce from "lodash.debounce"
    import store from "store"

    export default {
        beforeMount () {
            this.$store.dispatch("organization/loadTags")
        },
        computed: {
            tags () {
                return this.organization.tags.map(tag => tag.Name)
            }
        },
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