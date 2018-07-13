<template>
    <v-container fluid class="text-xs-center pb-0">
        <v-layout row wrap>
            <v-flex xs12 sm7 md7>
                <v-btn
                    dark
                    color="indigo darken-1"
                    @click="openFileUploadDialog">
                    Upload
                </v-btn>
                <v-btn dark color="info" @click.stop="dialogAddFolder=true">Add folder</v-btn>
            </v-flex>
            <v-flex xs12 sm5 md5>
                <v-btn outline fab small :disabled="!filesSelected" @click="downloadFiles">
                    <v-icon>file_download</v-icon>
                </v-btn>
                <v-btn outline fab small :disabled="!filesSelected" @click="moveFiles">
                    <v-icon>open_with</v-icon>
                </v-btn>
                <v-btn outline fab small :disabled="!filesSelected" @click="archiveFiles">
                    <v-icon>delete</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialogAddFolder" max-width="500px">
            <v-card>
                <v-card-title>
                    Create folder
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap class="text-xs-center">
                        Fields marked with&nbsp;<span class="red--text">*</span>&nbsp;are required.
                    </v-layout>
                    <v-layout row wrap>
                        <v-text-field
                            v-model="folderName"
                            label="Name"
                            :counter="50"
                            :error-messages="errors.collect('folder name')"
                            v-validate="'required|max:50'"
                            data-vv-name="folder name"
                            required
                        ></v-text-field>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="addFolder">
                        Done
                    </v-btn>
                    <v-btn flat @click.stop="dialogAddFolder=false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUploadFile" persistent max-width="600px">
            <v-card class="upload-dialog">
                <v-card-title>
                    Upload Files
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-select v-if="!projectId"
                                label="Add files to"
                                :items="organization.projects"
                                item-text="Name"
                                item-value="EntityID"
                                v-model="project"
                                bottom />
                        </v-flex>
                        <v-flex xs12>
                            <!-- <v-select
                                label="Select a tag or create a new one"
                                autocomplete
                                :loading="loading"
                                multiple
                                cache-items
                                chips
                                :items="searchedTags"
                                :search-input.sync="tagKey"
                                v-model="tags" /> -->
                            <!-- <v-select
                                v-model="tags"
                                label="Select a tag or create a new one"
                                chips
                                tags
                                :items="organizationTags" /> -->
                        </v-flex>
                        <dropzone ref="dropzone" :projectId="newProjectId" @queuecomplete="queuecomplete" />    
                        <!-- <v-flex xs12 class="drop-box">
                            <file-upload
                                ref="upload"
                                :multiple="true"
                                :drop="true"
                                v-model="files">
                                Drop documents here or select them
                            </file-upload>
                        </v-flex>
                        <v-flex xs6 offset-xs6>
                            <v-checkbox label="Treat ZIP as multiple files" v-model="flattenZip" />
                        </v-flex> -->
                        <!-- <v-flex>
                            <v-list>
                                <v-list-tile v-for="file in files" :key="file.id">
                                    <v-list-tile-content>
                                        <v-list-tile-title v-text="file.name + ' (' + (file.size * file.progress / 100) + ' Bytes/' + file.size + ' Bytes)'" />
                                        <v-progress-linear v-model="file.progress" style="margin:0"></v-progress-linear>
                                    </v-list-tile-content>
                                    <v-list-tile-action class="pull-right">
                                        <v-btn fab dark small color="black" @click.prevent="removeFile(file)">
                                            <v-icon dark>close</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                        </v-flex> -->
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="uploadFiles"
                            :loading="this.uploading"
                            :disabled="this.uploading">
                        Upload
                    </v-btn>
                    <v-btn flat @click.stop="cancelUpload">Cancel</v-btn>
                </v-card-actions>
                <!-- <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs5 offset-xs1>
                            Number of files: {{ files.length }}
                        </v-flex>
                        <v-flex xs6>
                            Total size: {{ uploadSize | fixed2 }} KB/{{ totalUploadSize | fixed2 }} KB
                        </v-flex>
                        <v-flex xs5 offset-xs1 class="mt-3">
                            Total progress: {{ totalProgress | fixed2 }}%
                        </v-flex>
                    </v-layout>
                </v-card-text> -->
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import organizationFolderService from "../../service/network/organizationFolderService.js"
    import organizationProjectService from "../../service/network/organizationProjectsService"
    import organizationUploadSetService from "../../service/network/organizationUploadSetService.js"
    import settings from "../../settings.js"
    import moment from 'moment'
    import dropzone from './vueDropzone'

    export default {
        $validates: true,
        components: {
            dropzone
        },
        props: {
            filesSelected: Boolean,
            projectId: String
        },
        beforeMount () {
            this.$store.dispatch("organization/loadFolders")
            this.$store.dispatch("organization/loadTags")
            this.$store.dispatch("organization/loadProjects")
        },
        data () {
            return {
                dialogAddFolder: false,
                dialogUploadFile: false,
                folderName: null,
                organization: this.$store.state.organization,
                folder: null,
                project: null,
                // tags: [],
                files: [],
                // flattenZip: false,
                loading: false,
                searchedTags: [],
                tagKey: null,
                uploadSet: null,
                uploading: false
            }
        },
        computed: {
            postAction () {
                return settings.API_ENDPOINT + "/file/"
            },
            // totalUploadSize () {
            //     let sum = 0
            //     for (const file of this.files) {
            //         sum += file.size
            //     }
            //     return sum / 1000
            // },
            // uploadSize () {
            //     let sum = 0
            //     for (const file of this.files) {
            //         sum += file.size * file.progress
            //     }
            //     return sum / 1000 / 100
            // },
            // totalProgress () {
            //     if (this.totalUploadSize == 0) {
            //         return 0
            //     }

            //     return this.uploadSize / this.totalUploadSize * 100
            // },
            organizationTags () {
                return this.organization.tags.map(tag => tag.Name)
            },
            newProjectId () {
                return this.projectId || this.project
            }
        },
        methods: {
            async addFolder () {
                let valid = await this.$validator.validate("folder name", this.folderName)
                if (valid) {
                    this.dialogAddFolder = false

                    console.log("[ Vuex ]: addFolder() in file actions component")

                    try {
                        let folder = { Name: this.folderName }
                        const response = await organizationFolderService.createFolder(folder)

                        if (response && response.EntityID) this.$store.dispatch("organization/loadFolders")
                        else console.log("[ Vuex ]: error create folder")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create folder")
                    }
                }
            },
            removeFile (file) {
                this.$refs.upload.remove(file)
            },
            async uploadFiles () {
                // for (const index in this.files) {
                //     let file = this.files[index]
                //     file.postAction = encodeURI(this.postAction + "?" +
                //         "tags=" + this.tags.join(",") +
                //         "&folderId=" + this.folder +
                //         "&X-Progress-ID=" + index +
                //         "&flattenZip=" + this.flattenZip)
                //     file.headers["Authorization"] = `Basic ${this.$store.state.userProfile.user.token}`
                // }
                // this.$refs.upload.active = true

                if (this.$refs.dropzone.dropzone.files.length == 0) {
                    return
                }

                this.$refs.dropzone.dropzone.processQueue()
                this.uploading = true

                const now = new Date()
                this.uploadSet = {
                    "StartTimeUtc": moment.utc(now).format(),
                    "StartTimeLocal": moment(now).format()
                }
                if (this.projectId) {
                    this.uploadSet["ProjectID"] = this.projectId
                }
                this.uploadSet = await organizationUploadSetService.createUpdateUploadSet(this.uploadSet)
            },
            openFileUploadDialog () {
                if (this.organization.folders && this.organization.folders.length > 0) {
                    this.folder = this.organization.folders[0].EntityID
                }
                if (this.organization.projects && this.organization.projects.length > 0 && !this.project) {
                    this.project = this.organization.projects[0].EntityID
                }
                // this.tags = []
                // this.$refs.upload.clear()
                // this.flattenZip = false
                this.uploadSet = null
                this.dialogUploadFile = true
            },
            downloadFiles () {
                this.$emit("downloadFiles")
            },
            moveFiles () {
                this.$emit("moveFiles")
            },
            archiveFiles () {
                this.$emit("archiveFiles")
            },
            cancelUpload () {
                // this.$refs.upload.active = false
                this.$refs.dropzone.dropzone.removeAllFiles(true)
                this.uploading = false
                this.dialogUploadFile = false
            },
            queryTags (v) {
                this.loading = true
                // Simulated ajax query
                setTimeout(() => {
                    this.searchedTags = this.organizationTags.filter(e => {
                        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
                    })
                    this.loading = false
                }, 500)
            },
            queuecomplete () {
                if (this.uploading) {
                    this.files = this.$refs.dropzone.dropzone.getAcceptedFiles() 
                    this.$refs.dropzone.dropzone.removeAllFiles(true)
                    this.uploading = false
                    this.dialogUploadFile = false
                }
            }
        },
        watch: {
            tagKey (val) {
                val && this.queryTags(val)
            },
            'dialogUploadFile': function (newVal, oldVal) {
                if (oldVal && this.uploadSet) {
                    const now = new Date()
                    this.uploadSet["EndTimeUtc"] = moment.utc(now).format()
                    this.uploadSet["EndTimeLocal"] = moment(now).format()
                    this.uploadSet["Files"] = this.files.map(file => {
                        let EntityID = file.uploadURL.split('?')[0]
                        EntityID = EntityID.split('\/')
                        EntityID = EntityID[EntityID.length - 1].split('.')[0]
                        return  {
                                    "EntityID": EntityID,
                                    "FileName": file["name"]
                                }
                    })
                    organizationUploadSetService.createUpdateUploadSet(this.uploadSet)
                }
            }
        }
    }
</script>
