<template>
    <div>
        <v-layout row wrap>
            <v-card-text class="headline">
                Engagements
                <v-btn outline fab small to="/engagements/new">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-card-text>
        </v-layout>
        <v-layout row wrap v-show="organization.engagements.length">
            <v-btn outline :disabled="!curEngagement" 
                :to="'/engagements/' + ((curEngagement && curEngagement.EntityID) || '')">Edit engagement</v-btn>
            <v-btn outline :disabled="!curEngagement" @click="addProjectTo(curEngagement)">Add project</v-btn>
        </v-layout>
        <v-layout row wrap v-show="organization.engagements.length">
            <v-card-text>
                <v-data-table
                    v-bind:headers="headers"
                    :items="organization.engagements"
                    hide-actions
                    class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <tr :active="curEngagement && (props.item.EntityID === curEngagement.EntityID)" 
                                @click="curEngagement = props.item"
                                @dblclick="goToEditEngagement(props.item)">
                            <td>
                                <span class="amber white--text pa-1" 
                                        v-if="props.item.Status === 0 || props.item.Status === 1">Proposed</span>
                                {{ props.item.Name }}
                            </td>
                            <td>{{ props.item.StartDate }}</td>
                            <td>{{ props.item.EndDate | formatDate }}</td>
                            <td>
                                <ul>
                                    <li v-for="project in props.item.Projects">{{ project.Name }}</li>
                                </ul>
                            </td>
                            <td>
                                <v-btn flat color="primary" @click="addProjectTo(props.item)">Add project</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-layout>

        <v-dialog v-model="dialogAddProject" max-width="500px">
            <v-form v-model="formValid" ref="form" lazy-validation>
                <v-card>
                    <v-card-title>Create Project</v-card-title>
                    <v-card-text>
                        Fields marked with <span class="red--text">*</span> are required.
                        <v-text-field
                            label="Name"
                            v-model="projectName"
                            :rules="nameRules"
                            required
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn outline @click="createProject" :disabled="!formValid">Done</v-btn>
                        <v-btn flat @click.stop="dialogAddProject=false">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
    import organization from "../../store/account/organization"
    import organizationProjectService from "../../service/network/organizationProjectsService"

    export default {
        beforeMount() {
            console.info(":// Display Engagements component")
            this.$store.dispatch("organization/loadEngagements")
        },
        data() {
            return {
                organization: this.$store.state.organization,
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                        },
                    {
                        text: 'Start Date',
                        align: 'left',
                        sortable: false,
                        value: 'startDate'
                        },
                    { 
                        text: 'End Date',
                        align: 'left',
                        sortable: false, 
                        value: 'endDate'
                        },
                    { 
                        text: 'Projects',
                        align: 'left',
                        sortable: false, 
                        value: 'projects'
                        },
                    { 
                        text: '',
                        sortable: false 
                        }
                ],
                items: [],

                curEngagement: null,

                dialogAddProject: false,
                projectName: '',
                nameRules: [
                    (v) => !!v || 'Name is required'
                ],
                formValid: true
            }
        },
        computed: {

        },
        methods: {
            addProjectTo (engagement) {
                this.curEngagement = engagement

                this.formValid = true
                this.projectName = ''
                this.dialogAddProject = true
            },
            async createProject () {
                if (this.$refs.form.validate()) {
                    this.dialogAddProject = false

                    console.log("[ Vuex ]: createProject() in engagements component")

                    try {
                        let project = {
                            EngagementID: this.curEngagement.EntityID,
                            Name: this.projectName
                        }
                        const response = await organizationProjectService.createProject(project)

                        if (response) {
                            this.$store.dispatch("organization/loadEngagements")
                        } else console.log("[ Vuex ]: error create project")
                    } catch (e) {
                        console.error("[ Vuex ]: Error create project")
                    }
                }
            },
            goToEditEngagement (engagement) {
                this.$router.push({ name: "Engagement", params: { engagementId: engagement.EntityID } })
            }
        },
        components: {
        }
    }
</script>