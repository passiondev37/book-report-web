<template>
    <v-layout row wrap>
        <v-flex xs8>
            <form>
                <v-select
                    v-bind:items="members"
                    v-model="member"
                    item-text="DisplayName"
                    item-value="UserID"
                    label="Project member"
                    :error-messages="errors.collect('member')"
                    v-validate="'required'"
                    data-vv-name="member"
                    return-object
                    required
                ></v-select>

                <v-text-field
                    v-model="documents"
                    label="Documents"
                    multi-line />

                <v-text-field
                    v-model="message"
                    label="Message"
                    multi-line
                ></v-text-field>

                <v-btn @click="submit">Save</v-btn>
                <v-btn @click="cancel">Cancel</v-btn>
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import organizationProjectsService from "../../service/network/organizationProjectsService"
    import organizationDocumentRequestService from "../../service/network/organizationDocumentRequestService"
    
    export default {
        $validates: true,
        name: "DocumentRequest",
        props: ['projectId'],
        beforeMount() {
            console.info(":// Create / Update Document Request component")

            this.loadLocalProject()
            this.loadProjectDetails()
        },
        data() {
            return {
                organization: this.$store.state.organization,
                project: {},
                member: null,
                message: '',
                documents: '',
                members: []
            }
        },
        computed: {

        },
        methods: {
            loadLocalProject () {
                let projects = this.organization.projects
                if (projects) {
                    let filteredProjects = projects.filter(project => project.EntityID == this.projectId)
                    if (filteredProjects && filteredProjects.length > 0) {
                        this.project = filteredProjects[0]
                    }
                }
            },
            async loadProjectDetails () {
                console.log("[ Vuex ]: loadProjectDetails() in project component")

                try {
                    const project = await organizationProjectsService.getProject(this.projectId)

                    if (project) {
                        this.project = Object.assign({}, this.project, project)
                    } else console.log("[ Vuex ]: empty project details")
                } catch (e) {
                    console.error("[ Vuex ]: Error loading project details from service")
                }
            },
            prepareDocumentRequest () {
                return {
                    Message: this.message,
                    ProjectID: this.projectId,
                    RequestedFrom: this.member.DisplayName,
                    RequestedFromID: this.member.UserID,
                    Documents: this.documents
                }
            },
            async submit () {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in create document request component")

                    try {
                        let documentRequest = this.prepareDocumentRequest()
                        const response = await organizationDocumentRequestService.createDocumentRequest(documentRequest)

                        if (response && response.EntityID) this.$router.go(-1)
                        else console.log("[ Vuex ]: error create document request")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create document request")
                    }
                }
            },
            cancel () {
                this.$router.go(-1)
            },
            composeMessage () {
                this.message = `Hello ${this.member && this.member.DisplayName || ''},\n\n`
                    + this.documents
                    + `\n\nKind regards,\n`
                    + `${this.$store.state.userProfile.user.displayName}`
            }
        },
        components: {
        },
        watch: {
            member: {
                handler: function (newValue) {
                    this.composeMessage()
                },
                immediate: true
            },
            documents: {
                handler: function (newValue) {
                    this.composeMessage()
                },
                immediate: true,
                deep: true
            },
            'project.Members': {
                handler: function (newValue) {
                    if (newValue) {
                        this.members = newValue.filter(member => member.UserID != this.$store.state.userProfile.user.id)
                    }
                },
                deep: true   
            }
        }
    }
</script>