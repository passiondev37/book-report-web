<template>
    <v-card-text class="pt-0">
        <fileActionsComponent 
            v-bind:filesSelected="filesSelected" 
            @downloadFiles="downloadFiles"
            @moveFiles="openMoveFiles"
            @archiveFiles="openArchiveFiles"
            :projectId="projectId" />
        <v-container fluid class="pt-0">
            <v-layout row justify-end>
                <v-flex xs2 class="px-2">
                    <v-select
                        v-bind:items="organization.fileCountByTags"
                        v-model="tag"
                        item-text="desc"
                        item-value="tag"
                        label="All tags"
                        single-line
                        bottom
                    ></v-select>
                </v-flex>
                <v-flex xs2 class="px-2">
                    <v-select
                        v-bind:items="organization.fileCountByType"
                        v-model="type"
                        item-text="desc"
                        item-value="type"
                        label="All file types"
                        single-line
                        bottom
                    ></v-select>
                </v-flex>
                <v-flex xs2 class="px-2">
                    <v-select
                        v-bind:items="organization.fileCountBySize"
                        v-model="size"
                        item-text="desc"
                        item-value="sizeGroup"
                        label="All file sizes"
                        single-line
                        bottom
                    ></v-select>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-data-table
                        :headers="headers"
                        :items="organization.files"
                        :total-items="organization.fileCount"
                        :rows-per-page-items="rowsPerPageItems"
                        :pagination.sync="pagination"
                        v-model="selectedFiles"
                        item-key="EntityID"
                        select-all
                        class="fileList elevation-1"
                >

                    <template slot="items" slot-scope="props">

                        <td>
                            <v-checkbox
                                primary
                                hide-details
                                v-model="props.selected"
                            ></v-checkbox>
                        </td>

                        <td>
                            <v-menu offset-y>
                                <v-btn flat icon color="gray" slot="activator">
                                    <font-awesome-icon icon="bars" />
                                </v-btn>
                                <v-list>
                                    <v-list-tile v-for="item in menu" :key="item.title" @click="menuAction(item.action, props.item)">
                                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </td>

                        <td class="nameHeader" @click="showPreview(props.item.EntityID)">
                            <font-awesome-icon :icon="getIcon(props.item.Extension)" size="lg" pull="left" />
                            <strong v-text="props.item.Name + '.' + props.item.Extension"></strong>
                        </td>

                        <td>
                            <span class="tag" v-for="tag in props.item.Tags" :key="tag" v-text="tag"></span>
                        </td>

                        <td class="date">
                            <span v-text="formatDate(props.item.ChangedOn)"></span>
                        </td>

                    </template>

                </v-data-table>
            </v-layout>
        </v-container>

        <v-dialog v-model="dialogArchive" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />Archive files
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogArchive=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    Confirm that you want to archive the selected files.
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="archiveFiles">Yes</v-btn>
                    <v-btn outline @click.stop="dialogArchive=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogMove" max-width="500px">
            <v-card>
                <v-card-title>
                    Move File
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs4>
                            <v-subheader>Destination Type</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                            <v-radio-group v-model="destType" :mandatory="true" row>
                                <v-radio label="Folder" value="0" />
                                <v-radio label="Project" value="1" />
                            </v-radio-group>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs4>
                            <v-subheader>Destination</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                            <v-select v-if="destType === '0'"
                                v-bind:items="organization.folders"
                                v-model="destFolder"
                                item-text="Name"
                                item-value="EntityID"
                                label=""
                                single-line
                                bottom
                            ></v-select>
                            <v-select v-else
                                v-bind:items="organization.projects"
                                v-model="destProject"
                                item-text="Name"
                                item-value="EntityID"
                                label=""
                                single-line
                                bottom
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn outline @click="moveFiles"
                        :disabled="!(this.destType === '0' && this.destFolder) 
                            && !(this.destType === '1' && this.destProject)">
                        Move
                    </v-btn>
                    <v-btn flat @click.stop="dialogMove=false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogReprocess" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />Re-process
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogReprocess=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    Confirm that you want to re-process the selected files.
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="reprocessCurFile">Yes</v-btn>
                    <v-btn outline @click.stop="dialogReprocess=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card-text>
</template>

<script>
    import organization from "../../store/account/organization"
    import organizationFileService from "../../service/network/organizationFileService.js"
    import moment from '../../../../node_modules/moment'
    import fileActionsComponent from "./fileActions.vue"

    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faBars } from '@fortawesome/fontawesome-free-solid/index'
    import * as far from '@fortawesome/fontawesome-free-regular/index'

    export default {
        props: ['projectId'],
        components: {
            FontAwesomeIcon,
            fileActionsComponent
        },
        data() {
            return {
                headers: [
                    {
                        sortable: false
                    },
                    {
                        text: "Name",
                        align: "left",
                        value: "name"
                    },
                    {
                        text: "Tags",
                        value: "tags",
                        align: "left"
                    },
                    {
                        text: "Date modified",
                        value: "date"
                    }
                ],
                menu: [
                    { title: 'Archive', action: 'archive' },
                    { title: 'Details', action: 'details' },
                    { title: 'Download', action: 'download' },
                    { title: 'Move', action: 'move' },
                    { title: 'Re-process', action: 'reprocess' }
                ],
                rowsPerPageItems: [10,100,200,500],
                pagination: {sortBy: "date", rowsPerPage: this.$store.state.organization.pageSize},
                organization: this.$store.state.organization,
                tag: null,
                type: null,
                size: -1,

                selectedFiles: [],
                activeFiles: [],
                curActionItem: null,

                dialogArchive: false,
                dialogReprocess: false,

                dialogMove: false,
                destType: "0",
                destFolder: null,
                destProject: null
            }
        },
        beforeMount() {
            console.info(":// Display FileList component")
            console.log(this.organization.pageSize)
            this.$store.dispatch("organization/clearFilter")
            this.$store.dispatch("organization/loadFileList")
        },
        computed: {
            filesSelected () {
                return this.selectedFiles && this.selectedFiles.length > 0
            }
        },
        methods: {
            showPreview (fileId) {
                this.$emit('showPreview', fileId)
            },
            formatDate: function (value){
                return moment(value).format('L')
            },
            getIcon (extension) {
                let ext = extension.toLowerCase()
                if (ext === 'txt' || ext === 'rtf' || ext === 'text') {
                    return far.faFileAlt
                } else if (ext === 'zip' || ext === 'rar') {
                    return far.faFileArchive
                } else if (ext === 'mp3' || ext === 'wav' || ext === 'mid') {
                    return far.faFileAudio
                } else if (ext === 'js' || ext === 'html' || ext === 'htm' || ext === 'cpp') {
                    return far.faFileCode
                } else if (ext === 'xls' || ext === 'xlsx') {
                    return far.faFileExcel
                } else if (ext === 'png' || ext === 'jpg') {
                    return far.faFileImage
                } else if (ext === 'pdf') {
                    return far.faFilePdf
                } else if (ext === 'ppt' || ext === 'pptx') {
                    return far.faFilePowerpoint
                } else if (ext === 'avi' || ext === 'mp4' || ext === 'flv') {
                    return far.faFileVideo  
                } else if (ext === 'doc' || ext === 'docx') {
                    return far.faFileWord
                }
                return far.faFile
            },
            initMoveDialog () {
                this.destType = "0"
                this.destFolder = null
                this.destProject = null
                this.$store.dispatch("organization/loadFolders")
                this.$store.dispatch("organization/loadProjects")
            },
            menuAction (action, file) {
                this.curActionItem = file
                this.activeFiles = [file]

                if (action === "archive") {    
                    this.dialogArchive = true
                } else if (action === "details") {
                    this.$router.push({ name: "File", params: { fileId: file.EntityID } })
                } else if (action === "download") {
                    window.open(organizationFileService.getFileLink(file.EntityID), "_blank")
                } else if (action === "move") {
                    this.initMoveDialog()
                    this.dialogMove = true
                } else if (action === "reprocess") {
                    this.dialogReprocess = true
                }
            },
            async archiveFiles () {
                this.dialogArchive = false

                if (this.activeFiles) {
                    console.log("[ Vuex ]: archiveFiles() in file list component")

                    const promises = this.activeFiles.map(async (one) => {
                        one.Archived = true
                        try {
                            const file = await organizationFileService.updateFile(one)

                            if (!(file && file.EntityID)) console.log("[ Vuex ]: Error archiving a file")
                        } catch (e) {
                            console.error("[ Vuex ]: Error archiving a file")
                        }
                    })

                    await Promise.all(promises)

                    this.$store.dispatch("organization/loadFileList")
                }
            },
            async reprocessCurFile() {
                this.dialogReprocess = false

                if (this.curActionItem) {
                    console.log("[ Vuex ]: reprocessCurFile() in file list component")

                    try {
                        const file = await organizationFileService.reprocessFile(this.curActionItem.EntityID)

                        if (file) {}
                        else console.log("[ Vuex ]: Error reprocessing a file")
                    } catch (e) {
                        console.error("[ Vuex ]: Error reprocessing a file")
                    }
                }
            },
            async moveFiles () {
                this.dialogMove = false

                if (this.activeFiles) {
                    console.log("[ Vuex ]: moveFiles() in file list component")

                    let fileIds = this.activeFiles.map(file => file.EntityID)

                    try {
                        let destination = this.destType === "0" ? this.destFolder : this.destProject
                        const result = await organizationFileService.moveFiles(fileIds,
                            destination, this.destType)

                        if (result) this.$store.dispatch("organization/loadFileList")
                        else console.log("[ Vuex ]: Error moving files")
                    } catch (e) {
                        console.error("[ Vuex ]: Error moving files")
                    }
                }
                
            },
            downloadFiles () {
                let fileIds = this.selectedFiles.map(file => file.EntityID)

                window.open(organizationFileService.getFilesLink(fileIds), "_blank")
            },
            openMoveFiles () {
                this.activeFiles = this.selectedFiles

                this.initMoveDialog()
                this.dialogMove = true
            },
            openArchiveFiles () {
                this.activeFiles = this.selectedFiles

                this.dialogArchive = true
            }
        },
        watch: {
            pagination: function(newValue) {
                if (newValue) {
                    let paginationData = {"currentPage": newValue.page, "pageSize": newValue.rowsPerPage}
                    this.$store.commit("organization/setPagination", paginationData)
                    this.$store.dispatch("organization/loadFileList")
                }
            },
            tag: function(newValue) {
                this.$store.commit("organization/setTag", newValue)
                this.$store.dispatch("organization/loadFileList")
            },
            type: function(newValue) {
                this.$store.commit("organization/setType", newValue)
                this.$store.dispatch("organization/loadFileList")
            },
            size: function(newValue) {
                this.$store.commit("organization/setSize", newValue)
                this.$store.dispatch("organization/loadFileList")
            }
        }
    }
</script>