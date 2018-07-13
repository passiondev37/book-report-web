<template>
    <v-flex class="align-items-center" xs12 sm3>
        <v-checkbox
            label="Include archive"
            v-model="organization.searchIncludeArchive"
            color="indigo"
            hide-details
        >
        </v-checkbox>
    </v-flex>
</template>

<script>
    export default {
        data () {
            return {
                organization: this.$store.state.organization
            }
        },
        watch: {
            "organization.searchIncludeArchive": function () {
                this.$store.dispatch("organization/loadFileListAdvanced")
            }
        }
    }
</script>