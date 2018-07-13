<template>
    <div id="fileSearchAndDisplay">
        <basic-search v-if="organization.librarySearchMode === 'basic'"></basic-search>
        <advanced-search v-else></advanced-search>
        <fileListComponent v-on:showPreview="showPreview" :projectId="projectId"></fileListComponent>
        <v-dialog v-model="preview" fullscreen transition="dialog-bottom-transition" :overlay=false>
            <v-card>
                <v-toolbar dark color="primary" dense>
                    <v-btn icon @click.native="preview = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>File Preview</v-toolbar-title>
                </v-toolbar>
                <file-preview v-bind:documentId=previewFileId></file-preview>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import FileListComponent from "./fileList.vue"
    import FilePreview from "./filePreview.vue";
    import BasicSearch from "../search/basicSearch.vue"
    import AdvancedSearch from "../search/advancedSearch.vue"

    export default {
        name: 'fileSearchAndDisplay',
        props: ['projectId'],
        components: {
            FileListComponent,
            FilePreview,
            BasicSearch,
            AdvancedSearch
        },
        data () {
            return {
                organization: this.$store.state.organization,
                preview: false,
                previewFileId: ''
            }
        },
        methods: {
            showPreview(fileId) {
                this.previewFileId = fileId
                this.preview = true;
            }
        }
    }
</script>
<!-- styling for the component -->
<style scoped>

</style>
