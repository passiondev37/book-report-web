<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="headline">{{ file.Name }} Details</v-flex>
            <v-flex xs12><v-divider /></v-flex>

            <v-flex xs2><v-subheader>Name</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ file.Name }}</v-flex>

            <v-flex xs2><v-subheader>Size</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ file.Size }}</v-flex>

            <v-flex xs2><v-subheader>Type</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ file.Extension }}</v-flex>

            <v-flex xs2><v-subheader>Folder</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ file.FolderName || folder.Name }}</v-flex>

            <v-flex xs2><v-subheader>Content</v-subheader></v-flex>
            <v-flex xs10 class="grey lighten-3 elevation-1">
                <v-card-text>
                    {{ document.Abstract }}
                </v-card-text>
            </v-flex>

            <v-flex class="text-xs-right mt-3">
                <v-btn flat to="/library">Done</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import organization from "../../store/account/organization"
    import organizationFileService from "../../service/network/organizationFileService.js"
    import organizationFolderService from "../../service/network/organizationFolderService.js"

    export default {
        name: 'fileDetails',
        props: ['fileId'],
        data() {
            return {
                organization: this.$store.state.organization,
                file: {},
                document: {},
                folder: {}
            }
        },
        beforeMount() {
            this.loadLocalFile()
            this.loadFileDetails()
            this.loadDocumentDetails()
        },
        methods: {
            loadLocalFile() {
                let files = this.organization.files
                if (files) {
                    let filteredFiles = files.filter(file => file.EntityID == this.fileId)
                    if (filteredFiles && filteredFiles.length > 0) {
                        this.file = filteredFiles[0]
                    }
                }
            },

            async loadFileDetails() {
                console.log("[ Vuex ]: loadFileDetails() in file details component")

                try {
                    const file = await organizationFileService.getFileDetails(this.fileId)

                    if (file) {
                        this.file = Object.assign({}, this.file, file)
                    } else console.log("[ Vuex ]: empty file details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading file details from service")
                }
            },

            async loadDocumentDetails() {
                console.log("[ Vuex ]: loadDocumentDetails() in file details component")

                try {
                    const document = await organizationFileService.getDocumentDetails(this.fileId)

                    if (document) this.document = document
                    else console.log("[ Vuex ]: empty document details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading document details from service")
                }
            },

            async loadFolderDetails(folderId) {
                console.log("[ Vuex ]: loadFolderDetails() in file details component")

                try {
                    const folder = await organizationFolderService.getFolderDetails(folderId)

                    if (folder) this.folder = folder
                    else console.log("[ Vuex ]: empty folder details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading folder details from service")
                }
            }
        },
        watch: {
            file: {
                handler: function(newValue) {
                    if (newValue && newValue.FolderID) {
                        this.loadFolderDetails(newValue.FolderID)
                    }
                },
                deep: true
            }
        }
    }
</script>
<!-- styling for the component -->
<style>
    div.flex.d-flex {
        align-items: center
    }
</style>
