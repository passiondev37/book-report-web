<template>
    <v-card-text>
        <v-container fluid>
            <v-layout row>
                <v-flex xs7>
                    <v-text-field 
                        solo 
                        label="Search..." 
                        prepend-icon="search" 
                        @input="searchType" 
                        v-model="organization.basicSearchQuery" />
                </v-flex>
                <v-flex xs5>
                    <v-btn flat color="primary" @click="goToAdvancedSearch">Advanced search</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card-text>
</template>

<script>
    import debounce from "lodash.debounce"
    import store from "store"

    export default {
        data() {
            return {
                organization: this.$store.state.organization
            }
        },
        methods: {
            searchType() {
                this.sendSearchRequest()
            },
            sendSearchRequest: debounce(() => {
                store.dispatch("organization/loadFileListForBasicSearch")
            }, 500),
            goToAdvancedSearch () {
                this.$store.commit("organization/setLibrarySearchMode", 'advanced')
            }
        },

        components: {
        }
    }
</script>