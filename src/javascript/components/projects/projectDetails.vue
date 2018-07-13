<template>
    <v-layout row wrap align-center class="app-layout">
        <v-flex class="app-container-flex">
            <v-layout row wrap>
                <v-flex xs6 class="headline text-xs-left">{{ project.Name }} Details</v-flex>
                <v-flex xs6 class="text-xs-right">
                    <v-btn outline @click="dialogDownloadAllFiles=true">Download All Files</v-btn>
                    <v-btn outline>Invite user</v-btn>
                </v-flex>
            </v-layout>

            <v-divider />

            <form>
                <v-text-field
                    v-model="name"
                    label="Name"
                    :counter="50"
                    :error-messages="errors.collect('name')"
                    v-validate="'required|max:50'"
                    data-vv-name="name"
                    required
                ></v-text-field>

                <v-select
                    v-bind:items="organization.engagements"
                    v-model="engagement"
                    item-text="Name"
                    item-value="EntityID"
                    label="Engagement"
                    :error-messages="errors.collect('engagement')"
                    v-validate="'required'"
                    data-vv-name="engagement"
                    required
                ></v-select>

                <v-select
                    v-bind:items="schedules"
                    v-model="schedule"
                    label="Schedule"
                ></v-select>

                <v-expansion-panel expand>
                    <v-expansion-panel-content v-bind:value="true">
                        <div slot="header">Files</div>
                        <v-card>
                            <file-search-and-display :projectId="projectId" />
                        </v-card>
                    </v-expansion-panel-content>

                    <v-expansion-panel-content v-bind:value="true">
                        <div slot="header">Document Requests</div>
                        <v-card>
                            <document-requests :projectId="projectId" />
                        </v-card>
                    </v-expansion-panel-content>

                    <v-expansion-panel-content v-bind:value="true">
                        <div slot="header">Milestones</div>
                        <v-card>
                            <milestones :projectId="projectId" />
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-btn @click="update">Done</v-btn>
                <v-btn to="/projects">Cancel</v-btn>
            </form>

            <v-btn color="primary" @click="showPreview">Show Preview</v-btn>
            <a v-bind:href="url" target="_blank">View Full</a>
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
        </v-flex>

        <v-dialog v-model="dialogDownloadAllFiles" width="500px">
            <v-card>
                <v-card-title style="flex-wrap: nowrap">
                    <span>
                        <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />
                        A zip will be created with all the files in the project and downloadable link to the zip will be emailed to you
                    </span>
                    <v-btn flat icon @click.stop="dialogDownloadAllFiles=false" style="flex: 0 0 auto">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>Confirmation required.</v-card-text>
                <v-card-actions>
                    <v-btn flat @click="downloadAllFiles">Yes</v-btn>
                    <v-btn outline @click.stop="dialogDownloadAllFiles=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import organizationProjectsService from "../../service/network/organizationProjectsService"
    import FilePreview from "../files/filePreview.vue"
    import moment from 'moment'
    import FileSearchAndDisplay from "../files/fileSearchAndDisplay.vue"
    import DocumentRequests from "../documentRequests/documentRequests.vue"
    import Milestones from "../milestones/milestones.vue"
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faCheckSquare } from '@fortawesome/fontawesome-free-regular/index'

    export default {
        $validates: true,
        name: 'projectDetails',
        components: {
            FilePreview,
            FileSearchAndDisplay,
            DocumentRequests,
            Milestones,
            FontAwesomeIcon
        },
        props: ['projectId'],
        data() {
            return {
                organization: this.$store.state.organization,
                project: {},
                preview: false,
                previewFileId: '',
                schedules: [],

                name: '',
                engagement: null,
                schedule: null,
                dialogDownloadAllFiles: false
            }
        },
        beforeMount () {
            this.loadLocalProject()
            this.loadProjectDetails()
            this.$store.dispatch("organization/loadEngagements")

            this.$store.commit("organization/setProjectId", this.projectId)
        },
        computed: {
            url () {
                return "#/file/viewer/" + this.previewFileId + "/1"
            }
        },
        methods: {
            fillProjectDetails (project) {
                this.name = project.Name
                this.engagement = project.EngagementID
                this.schedule = project.Schedule
            },
            loadLocalProject () {
                let projects = this.organization.projects
                if (projects) {
                    let filteredProjects = projects.filter(project => project.EntityID == this.projectId)
                    if (filteredProjects && filteredProjects.length > 0) {
                        this.project = filteredProjects[0]
                        this.fillProjectDetails(this.project)
                    }
                }
            },
            async loadProjectDetails () {
                console.log("[ Vuex ]: loadProjectDetails() in project component")

                try {
                    const project = await organizationProjectsService.getProject(this.projectId)

                    if (project) {
                        this.project = Object.assign({}, this.project, project)
                        this.fillProjectDetails(this.project)
                    } else console.log("[ Vuex ]: empty project details")
                } catch (e) {
                    console.error("[ Vuex ]: Error loading project details from service")
                }
            },
            showPreview() {
                this.previewFileId = '01a1645fd0ad48b4865b66d693203cae'
                this.preview = true;
            },
            prepareProject () {
                let project = Object.assign({}, this.project, {})

                project.Name = this.name
                project.EngagementID = this.engagement
                project.Schedule = this.schedule

                return project
            },
            async update() {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in save project component")

                    try {
                        let project = this.prepareProject()
                        const response = await organizationProjectsService.updateProject(project)

                        if (response && response.EntityID) this.$router.go(-1)
                        else console.log("[ Vuex ]: error save project")

                    } catch (e) {
                        console.error("[ Vuex ]: Error save project")
                    }
                }
            },
            downloadAllFiles () {
                this.dialogDownloadAllFiles = false
            }
        },
        watch: {
            engagement: function (newValue, oldValue) {
                if (oldValue) {
                    this.schedule = null
                }

                let engagements = this.organization.engagements
                if (engagements) {
                    let filteredEngagements = engagements.filter(engagement => engagement.EntityID == this.engagement)
                    if (filteredEngagements && filteredEngagements.length > 0) {
                        this.schedules = filteredEngagements[0].Schedules
                    }
                }
            },
            "organization.engagements": function (newValue) {
                let engagements = newValue
                if (engagements && this.engagement) {
                    let filteredEngagements = engagements.filter(engagement => engagement.EntityID == this.engagement)
                    if (filteredEngagements && filteredEngagements.length > 0) {
                        this.schedules = filteredEngagements[0].Schedules
                    }
                }
            }
        }

    }
</script>
<!-- styling for the component -->
<style>

</style>
