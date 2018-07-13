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

                <v-select
                    v-bind:items="organization.engagements"
                    v-model="engagement"
                    item-text="Name"
                    item-value="EntityID"
                    label="Engagement"
                    :error-messages="errors.collect('engagement')"
                    v-validate="'required'"
                    data-vv-name="engagement"
                    return-object
                    required
                ></v-select>

                <v-select
                    v-bind:items="(engagement || {}).Schedules"
                    v-model="schedule"
                    label="Schedule"
                ></v-select>

                <!-- <v-select
                    v-bind:items="organization.projectTypes"
                    v-model="type"
                    item-text="Name"
                    item-value="EntityID"
                    label="Type"
                    :error-messages="errors.collect('type')"
                    v-validate="'required'"
                    data-vv-name="type"
                    required /> -->

                <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="startDateMenu"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    ref="startDateMenu"
                    :return-value.sync="startDate"
                >
                    <v-text-field
                        slot="activator"
                        label="Start Date"
                        v-model="startDate"
                        prepend-icon="event"
                        :error-messages="errors.collect('startDate')"
                        v-validate="'required'"
                        data-vv-name="startDate"
                        readonly
                        required
                    ></v-text-field>
                    <v-date-picker v-model="startDate" no-title scrollable actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>

                <v-btn @click="submit">Create</v-btn>
                <v-btn to="/projects">Cancel</v-btn>
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import organizationProjectsService from "../../service/network/organizationProjectsService"
    import { formatDate } from "../../util/helpers"
    import moment from 'moment'
    import organization from "../../store/account/organization"

    export default {
        $validates: true,
        beforeMount() {
            console.info(":// Create Project component")
            this.$store.dispatch("organization/loadEngagements")
            // this.$store.dispatch("organization/loadProjectTypes")
        },
        data() {
            return {
                organization: this.$store.state.organization,
                name: '',
                engagement: null,
                schedule: null,
                // type: null,
                startDate: null,
                startDateMenu: false
            }
        },
        computed: {

        },
        methods: {
            prepareProject () {
                let project = {
                    Name: this.name,
                    StartDate: formatDate(this.startDate),
                    EngagementID: this.engagement.EntityID,
                    // ProjectTypeID: this.type
                }

                if (this.schedule) {
                    project.Schedule = this.schedule
                }

                return project
            },
            async submit () {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in create project component")

                    try {
                        let project = this.prepareProject()
                        const response = await organizationProjectsService.createProject(project)

                        if (response && response.EntityID) this.$router.replace({ name: "Project", params: { projectId: response.EntityID } })
                        else console.log("[ Vuex ]: error create project")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create project")
                    }
                }
            }
        },
        components: {
        },
        watch: {
            engagement: function (newValue) {
                this.schedule = null
            }
        }
    }
</script>