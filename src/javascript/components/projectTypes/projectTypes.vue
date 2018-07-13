<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-btn to="/projectTypes/new">Add</v-btn>
            <v-btn :disabled="!curProjectType" @click="editCurProjectType">Edit</v-btn>
            <v-btn :disabled="!curProjectType" @click="dialogDeleteProjectType=true">Delete</v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-data-table
                v-bind:headers="headers"
                :items="projectTypes"
                hide-actions
                class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr :active="curProjectType && (props.item.EntityID === curProjectType.EntityID)"
                            @click="curProjectType = props.item">
                        <td>{{ props.item.Name }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>

        <v-dialog v-model="dialogDeleteProjectType" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />
                    Remove "{{ curProjectType && curProjectType.Name }}"?
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogDeleteProjectType=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-actions>
                    <v-btn flat @click="removeCurProjectType">Yes</v-btn>
                    <v-btn outline @click.stop="dialogDeleteProjectType=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import organizationProjectsService from "../../service/network/organizationProjectsService"
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faCheckSquare } from '@fortawesome/fontawesome-free-regular/index'

    export default {
        components: {
            FontAwesomeIcon
        },
        beforeMount() {
            console.info(":// Display Project Types component")

            this.loadProjectTypes()
        },
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
                projectTypes: [],
                curProjectType: null,
                dialogDeleteProjectType: false
            }
        },
        computed: {

        },
        methods: {
            async loadProjectTypes () {
                console.log("[ Vuex ]: loadProjectTypes() in project types component")

                try {
                    const projectTypes = await organizationProjectsService.getProjectTypes()

                    if (projectTypes) {
                        this.projectTypes = projectTypes
                    } else console.log("[ Vuex ]: empty project types")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading project types from service")
                }
            },
            editCurProjectType () {
                this.$router.push({name: "Edit Project Type", 
                    params: {projectTypeId: this.curProjectType.EntityID,
                        projectType: this.curProjectType}})
            },
            async removeCurProjectType () {
                this.dialogDeleteProjectType = false

                if (this.curProjectType) {
                    console.log("[ Vuex ]: removeCurProjectType() in project types component")

                    try {
                        const response = await organizationProjectsService.
                            deleteProjectType(this.curProjectType.EntityID)

                        if (response) this.loadProjectTypes()
                        else console.log("[ Vuex ]: Error deleting a project type")
                    } catch (e) {
                        console.error("[ Vuex ]: Error deleting a project type")
                    }
                }
            }
        }
    }
</script>