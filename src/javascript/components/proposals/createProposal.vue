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
                ></v-text-field>

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

                <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="endDateMenu"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    ref="endDateMenu"
                    :return-value.sync="endDate"
                >
                    <v-text-field
                        slot="activator"
                        label="End Date"
                        v-model="endDate"
                        prepend-icon="event"
                        :error-messages="errors.collect('endDate')"
                        v-validate="'required'"
                        data-vv-name="endDate"
                        readonly
                        required
                    ></v-text-field>
                    <v-date-picker v-model="endDate" no-title scrollable actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.endDateMenu.save(endDate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>

                <v-text-field
                    v-model="schedules"
                    label="Schedules"
                    hint="Audit Work, Valuation Work etc..."
                    multi-line
                ></v-text-field>

                <v-text-field
                    v-model="email"
                    label="Prospect Email"
                    :error-messages="errors.collect('email')"
                    v-validate="'required|email'"
                    data-vv-name="email"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="organization"
                    label="Organization"
                ></v-text-field>

                <v-text-field
                    v-model="message"
                    label="Message"
                    :error-messages="errors.collect('message')"
                    v-validate="'required'"
                    data-vv-name="message"
                    multi-line
                    required
                ></v-text-field>

                <v-btn @click="submit">Send Proposal</v-btn>
                <v-btn to="/proposals">Cancel</v-btn>
                <!-- <v-btn @click="clear">clear</v-btn> -->
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import organizationProposalService from "../../service/network/organizationProposalService.js"
    import { formatDate } from "../../util/helpers"
    import moment from 'moment'

    export default {
        $validates: true,
        beforeMount() {
            console.info(":// Create Proposal component")
        },
        data() {
            return {
                name: '',
                description: '',
                startDate: null,
                startDateMenu: false,
                endDate: null,
                endDateMenu: false,
                schedules: '',
                email: '',
                organization: '',
                message: ''
            }
        },
        computed: {

        },
        methods: {
            prepareProposal () {
                let proposal = {
                    Name: this.name,
                    ProspectEmail: this.email,
                    ShowOrganizations: false,
                    Message: this.message,
                    StartDate: formatDate(this.startDate),
                    NewOrganizationName: "default Organization",
                    Schedules: []
                }

                if (this.schedules && this.schedules.trim().length) {
                    proposal.Schedules = this.schedules.split(",")
                }
                if (this.endDate) {
                    proposal.EndDate = moment(this.endDate).toISOString()
                }
                if (this.description && this.description.trim().length) {
                    proposal.Description = this.description
                }
                if (this.organization && this.organization.trim().length) {
                    proposal.OrganizationName = this.organization
                }

                return proposal
            },
            async submit () {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in create proposal component")

                    try {
                        let proposal = this.prepareProposal()
                        const response = await organizationProposalService.createProposal(proposal)

                        if (response) this.$router.go(-1)
                        else console.log("[ Vuex ]: error create proposal")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create proposal")
                    }
                }
            },
            clear () {
                this.name = ''
                this.description = ''
                this.startDate = null
                this.endDate = null
                this.schedules = ''
                this.email = ''
                this.organization = ''
                this.message = ''
                this.$validator.clean()
            }
        },
        components: {
        }
    }
</script>