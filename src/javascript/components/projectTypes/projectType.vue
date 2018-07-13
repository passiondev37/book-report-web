<template>
    <v-layout row wrap>
        <v-flex xs8>
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

                <v-expansion-panel expand v-if="projectType">
                    <v-expansion-panel-content v-bind:value="true">
                        <div slot="header">Milestones</div>
                        <v-card>
                            <v-layout row wrap>
                                <v-text-field
                                    v-model="milestoneName"
                                    label="Name"
                                    :counter="50"
                                    :error-messages="errors.collect('milestone name')"
                                    v-validate="'required|max:50'"
                                    data-vv-name="milestone name"
                                    class="ma-2"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    v-model="estimatedDuration"
                                    label="Estimated Duration"
                                    :error-messages="errors.collect('estimated duration')"
                                    v-validate="'required|numeric'"
                                    data-vv-name="estimated duration"
                                    hint="in days"
                                    class="ma-2"
                                    required
                                ></v-text-field>
                                <v-btn outline fab small @click="addMilestone">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </v-layout>
                            <v-data-table
                                v-bind:headers="headers"
                                :items="milestones"
                                hide-actions
                                class="elevation-1">
                                <template slot="items" slot-scope="props">
                                    <tr>
                                        <td>{{ props.item.Name }}</td>
                                        <td>{{ props.item.EstimatedDuration }}</td>
                                        <td>
                                            <v-btn flat @click="removeMilestone(props.item)">Remove</v-btn>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-btn @click="submit">Save</v-btn>
                <v-btn @click="cancel">Cancel</v-btn>
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import moment from 'moment'
    import organizationProjectsService from "../../service/network/organizationProjectsService"

    export default {
        $validates: true,
        name: "ProjectType",
        props: ['projectTypeId', 'projectType'],
        beforeMount() {
            console.info(":// Create / Update Project Type component")

            this.name = (this.projectType && this.projectType.Name) || ''
            this.milestones = (this.projectType && this.projectType.Milestones) || []
        },
        data() {
            return {
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                        },
                    {
                        text: 'Estimated Duration (in days)',
                        align: 'left',
                        sortable: false,
                        value: 'estimatedDuration'
                        },
                    {
                        sortable: false
                        }
                ],
                name: null,
                milestones: [],
                milestoneName: null,
                estimatedDuration: null
            }
        },
        methods: {
            async submit () {
                let valid = await this.$validator.validate("name", this.name)
                if (valid) {
                    console.log("[ Vuex ]: submit() in create/edit project type component")

                    try {
                        let projectType = Object.assign({}, this.projectType || {}, {})
                        projectType.Name = this.name
                        projectType.Milestones = this.milestones
                        const response = await organizationProjectsService.createUpdateProjectType(projectType, !this.projectType)

                        if (response && response.EntityID) {
                            if (this.projectType) {
                                this.$router.go(-1)
                            } else {
                                this.$router.replace({name: "Edit Project Type", 
                                    params: {projectTypeId: response.EntityID,
                                        projectType: response}})
                            }
                        } else console.log("[ Vuex ]: error create/edit project type")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create/edit project type")
                    }
                }
            },
            async addMilestone () {
                let valid = await this.$validator.validate("milestone name", this.milestoneName)
                valid = await this.$validator.validate("estimated duration", this.estimatedDuration) && valid
                if (valid) {
                    this.milestones.push({
                        Name: this.milestoneName,
                        EstimatedDuration: this.estimatedDuration
                    })
                }
            },
            removeMilestone (milestone) {
                this.milestones.splice(this.milestones.indexOf(milestone), 1)
            },
            cancel () {
                this.$router.go(-1)
            }
        },
        components: {
        }
    }
</script>