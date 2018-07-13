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
                    placeholder="A name for the Engagement"
                    required />

                <v-text-field
                    v-model="description"
                    label="Description"
                    placeholder="Briefly describe the Engagement"/>

                <v-text-field
                    v-model="organization"
                    label="Client Organization"
                    placeholder="The name of the client's organization"/>

                <v-text-field
                    v-model="email"
                    label="Client Contact's Email"
                    :error-messages="errors.collect('email')"
                    v-validate="'required|email'"
                    data-vv-name="email"
                    placeholder="Your client contact's email address"
                    required />

                <v-text-field
                        v-model="message"
                        label="Message"
                        :error-messages="errors.collect('message')"
                        v-validate="'required'"
                        data-vv-name="message"
                        multi-line
                        required
                        rows="2"
                        placeholder="This message will be sent to the client contact along with the request to initiate the Engagement via an Accept link"/>

                <v-text-field
                    v-model="schedules"
                    label="Schedules"
                    placeholder="The types of work which will be performed on this Engagement"
                    multi-line
                    rows="1"/>

                <v-text-field
                    v-model="projectName"
                    label="Project Name"
                    :counter="50"
                    :error-messages="errors.collect('project name')"
                    v-validate="'required|max:50'"
                    data-vv-name="project name"
                    placeholder="A name for this Engagement's initial Project"
                    required />

                <v-select
                    v-bind:items="scheduleArray"
                    v-model="projectSchedule"
                    label="Project Type" />

                <v-text-field
                    v-model="requestMessage"
                    label="Initial Information Request"
                    placeholder="This is the place to ask for the documents you need to get started.  The text entered here will show up as an Information Request on the Projecy's timeline."
                    multi-line
                    rows="2"/>

                <v-btn @click="submit">Create Engagement</v-btn>
                <v-btn to="/engagements">Cancel</v-btn>
                <!-- <v-btn @click="clear">clear</v-btn> -->
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import organizationEngagementService from "../../service/network/organizationEngagementService.js"
    import { formatDate } from "../../util/helpers"
    import moment from 'moment'

    export default {
        $validates: true,
        beforeMount() {
            console.info(":// Create Engagement component")
        },
        data() {
            return {
                name: '',
                description: '',
                schedules: '',
                email: '',
                organization: '',
                message: '',
                projectName: '',
                projectSchedule: '',
                requestMessage: ''
            }
        },
        computed: {
            scheduleArray () {
                return this.schedules.split(',').map(schedule => schedule.trim())
            }
        },
        methods: {
            prepareEngagement () {
                let engagement = {
                    Name: this.name,
                    ProspectEmail: this.email,
                    ShowOrganizations: false,
                    Message: this.message,
                    NewOrganizationName: "default Organization",
                    Schedules: [],
                    ProjectName: this.projectName,
                    ProjectSchedule: this.projectSchedule,
                    RequestMessage: this.requestMessage
                }

                if (this.schedules && this.schedules.trim().length) {
                    engagement.Schedules = this.scheduleArray
                }
                if (this.description && this.description.trim().length) {
                    engagement.Description = this.description
                }
                if (this.organization && this.organization.trim().length) {
                    engagement.OrganizationName = this.organization
                }

                return engagement
            },
            async submit () {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in create engagement component")

                    try {
                        let engagement = this.prepareEngagement()
                        const response = await organizationEngagementService.createEngagement(engagement)

                        if (response && response.EntityID) this.$router.go(-1)
                        else console.log("[ Vuex ]: error create engagement")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create engagement")
                    }
                }
            },
            clear () {
                this.name = ''
                this.description = ''
                this.schedules = ''
                this.email = ''
                this.organization = ''
                this.message = ''
                this.projectName = ''
                this.projectSchedule = ''
                this.requestMessage = ''
                this.$validator.clean()
            }
        },
        components: {
        }
    }
</script>