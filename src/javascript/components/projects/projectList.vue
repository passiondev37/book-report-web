<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-card-text class="headline">
                Projects
                <v-btn outline fab small to="/projects/new" v-show="organization.engagements.length">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-card-text>
        </v-layout>
        <v-layout row wrap v-show="!organization.engagements.length">
            <v-card-text class="subheading">
                Please create an <a v-bind:href="'/#/engagements/new'">engagement</a> before you create projects
            </v-card-text>
        </v-layout>
        <v-layout row wrap>
            <v-btn outline to="/projects/new" v-show="organization.engagements.length">Add project</v-btn>
            <v-btn outline :disabled="!curProject" @click="showInviteForm" v-show="organization.projects.length">Invite user</v-btn>
            <v-btn outline :disabled="!curProject" @click="openProjectDetails(curProject)" v-show="organization.projects.length">Open</v-btn>
            <v-btn outline :disabled="!curProject" @click="dialogDeleteProject=true" v-show="organization.projects.length">Delete project</v-btn>
        </v-layout>
        <v-layout row wrap v-show="organization.projects.length">
            <v-data-table
                v-bind:headers="headers"
                :items="organization.projects"
                hide-actions
                class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr :active="curProject && (props.item.EntityID === curProject.EntityID)"
                            @click="curProject = props.item"
                            @dblclick = "openProjectDetails(props.item)">
                        <td>
                            {{ props.item.Name }}
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>

        <v-dialog v-model="dialogInviteUser" max-width="500px">
            <v-form v-model="inviteFormValid" ref="inviteForm" lazy-validation>
                <v-card>
                    <v-card-title class="title light-blue darken-3 white--text">Send Invite for {{ curProject && curProject.Name }}</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="userEmail"
                            label="Email"
                            :rules="emailRules"
                            required
                        ></v-text-field>
                        <v-text-field
                            label="Message"
                            v-model="inviteMessage"
                            multi-line
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn outline @click="inviteUser" :disabled="!inviteFormValid">Send Invitation</v-btn>
                        <v-btn flat @click.stop="dialogInviteUser=false">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <v-dialog v-model="dialogInvitationSent" max-width="500px">
            <v-card>
                <v-card-title class="title light-blue darken-3 white--text">
                    Invitation Sent
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogInvitationSent=false" color="white">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    Your invite has been sent!
                </v-card-text>
                <v-card-actions>
                    <v-btn outline @click="dialogInvitationSent=false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDeleteProject" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />
                    Remove "{{ curProject && curProject.Name }}"?
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogDeleteProject=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-actions>
                    <v-btn flat @click="removeCurProject">Yes</v-btn>
                    <v-btn outline @click.stop="dialogDeleteProject=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

</template>

<script>
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faCheckSquare } from '@fortawesome/fontawesome-free-regular/index'
    import organizationProjectService from "../../service/network/organizationProjectsService"

    export default {
        components: {
            FontAwesomeIcon
        },
        name: "projects",
        data() {
            return {
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                        }
                ],
                organization: this.$store.state.organization,
                curProject: null,

                dialogInviteUser: false,
                inviteFormValid: true,
                userEmail: '',
                inviteMessage: '',
                emailRules: [
                    (v) => !!v || 'Email is required',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
                ],

                dialogDeleteProject: false,
                dialogInvitationSent: false
            }
        },
        beforeMount() {
            console.info(":// Display Projects component")

            this.$store.dispatch("organization/loadEngagements")
            this.$store.dispatch("organization/loadProjects")
        },
        methods: {
            showInviteForm () {
                this.$refs.inviteForm.reset()
                this.inviteMessage = `Dear,\n`
                    + `I'd like to invite you to my project.\n`
                    + `Kind regards,\n`
                    + `${this.$store.state.userProfile.user.displayName}`
                this.inviteFormValid = true
                this.dialogInviteUser = true
            },

            async inviteUser () {
                if (this.$refs.inviteForm.validate()) {
                    console.log("[ Vuex ]: inviteUser() in projects component")

                    try {
                        let project = Object.assign({}, this.curProject)
                        project.ProjectUser = {
                            Email: this.userEmail,
                            Message: this.inviteMessage,
                            ProjectID: project.EntityID
                        }

                        const response = await organizationProjectService.updateProject(project)

                        if (response.EntityID) {
                            this.dialogInviteUser = false
                            this.dialogInvitationSent = true
                        } else console.log("[ Vuex ]: error invite user")
                    } catch (e) {
                        console.error("[ Vuex ]: Error invite user")
                    }
                }
            },

            async removeCurProject () {
                this.dialogDeleteProject = false

                if (this.curProject) {
                    console.log("[ Vuex ]: removeCurProject() in project list component")

                    try {
                        const response = await organizationProjectService.
                            deleteProject(this.curProject.EntityID)

                        if (response) this.$store.dispatch("organization/loadProjects")
                        else console.log("[ Vuex ]: Error deleting a project")
                    } catch (e) {
                        console.error("[ Vuex ]: Error deleting a project")
                    }
                }
            },

            openProjectDetails (project) {
                this.curProject = project

                if (this.curProject) {
                    this.$router.push({ name: "Project", params: { projectId: this.curProject.EntityID } })
                }
            }
        }
    }
</script>
