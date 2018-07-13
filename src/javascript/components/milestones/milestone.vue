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

                <v-text-field
                    v-model="description"
                    label="Description"
                    multi-line
                ></v-text-field>

                <v-select
                    v-bind:items="stats"
                    v-model="status"
                    label="Status"
                    v-if="milestone"
                ></v-select>

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
                        label="Estimated Start Date"
                        v-model="startDate"
                        prepend-icon="event"
                        :error-messages="errors.collect('estimated start date')"
                        v-validate="'required'"
                        data-vv-name="estimated start date"
                        readonly
                        required
                    ></v-text-field>
                    <v-date-picker v-model="startDate" no-title scrollable actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>

                <v-text-field
                    v-model="duration"
                    label="Estimated Duration (Days)"
                    :error-messages="errors.collect('estimated duration')"
                    v-validate="'required|numeric'"
                    data-vv-name="estimated duration"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="endDate"
                    label="Estimated End Date"
                    required
                    disabled
                    v-if="!!duration"
                ></v-text-field>

                <v-btn @click="submit">Save</v-btn>
                <v-btn @click="cancel">Cancel</v-btn>
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import moment from 'moment'
    import organizationMilestoneService from "../../service/network/organizationMilestoneService"
    import { formatDate } from "../../util/helpers"

    export default {
        $validates: true,
        name: "Milestone",
        props: ['projectId', 'ordinal', 'milestoneId', 'details'],
        beforeMount() {
            console.info(":// Create / Update Milestone component")
            this.milestone = this.details
            if (this.milestone) {
                this.fillMilestoneDetails()
                this.loadMilestoneDetails()
            }
        },
        data() {
            return {
                name: null,
                description: null,
                status: null,
                startDate: null,
                startDateMenu: false,
                duration: 7,
                stats: [
                    {text: "Not Started", value: 0},
                    {text: "In Progress", value: 1},
                    {text: "Complete", value: 2}
                ],
                milestone: null
            }
        },
        computed: {
            endDate: function () {
                if (!this.startDate) return ""
                let duration = parseInt(this.duration)
                return moment(this.startDate).add(duration, 'days').format("YYYY-MM-DD")
            }
        },
        methods: {
            fillMilestoneDetails () {
                this.name = this.milestone.Name
                this.description = this.milestone.Description
                this.status = this.milestone.Status
                this.startDate = moment(this.milestone.EstimatedStartDate).format("YYYY-MM-DD")
                this.duration = this.milestone.EstimatedDuration
            },
            async loadMilestoneDetails () {
                console.log("[ Vuex ]: loadMilestoneDetails() in milestone component")

                try {
                    const milestone = await organizationMilestoneService.getMilestone(this.projectId, this.milestone.EntityID)

                    if (milestone) {
                        this.milestone = Object.assign({}, this.milestone, milestone)
                        this.fillMilestoneDetails(this.milestone)
                    } else console.log("[ Vuex ]: empty milestone details")
                } catch (e) {
                    console.error("[ Vuex ]: Error loading milestone details from service")
                }
            },
            prepareMilestone () {
                let milestone
                if (this.milestone) {
                    milestone = Object.assign({}, this.milestone, {})
                    milestone.Status = this.status
                } else {
                    milestone = {
                        Ordinal: this.ordinal,
                        ProjectID: this.projectId,
                        Status: 0
                    }
                }

                milestone.EstimatedDuration = this.duration
                milestone.EstimatedEndDate = formatDate(this.endDate)
                milestone.EstimatedStartDate = formatDate(this.startDate)
                milestone.Name = this.name

                if (this.description) {
                    milestone.Description = this.description
                }

                return milestone
            },
            async submit () {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in create/edit milestone component")

                    try {
                        let milestone = this.prepareMilestone()
                        const response = await organizationMilestoneService.createUpdateMilestone(this.projectId, milestone, !this.milestone)

                        if (response && response.EntityID) this.$router.go(-1)
                        else console.log("[ Vuex ]: error create milestone")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create milestone")
                    }
                }
            },
            cancel () {
                this.$router.go(-1)
            }
        },
        components: {
        }
    }
</script>