<template>
    <div>
        <v-container text-xs-center v-show="token">
            <v-progress-circular indeterminate :size="70" :width="7" color="purple" />
        </v-container>
        <v-layout row wrap v-show="!token">
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
                        v-model="rejectionComments"
                        label="Rejection Comments"
                        multi-line
                        v-show="engagement.Rejected"
                    ></v-text-field>

                    <v-btn @click="submit">Done</v-btn>
                    <v-btn to="/engagements">Cancel</v-btn>
                </form>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import organization from "../../store/account/organization"
    import organizationEngagementService from "../../service/network/organizationEngagementService.js"
    import moment from 'moment'
    import { formatDate } from "../../util/helpers"
    import urls from "../../router/urls"

    export default {
        $validates: true,
        name: 'engagementDetails',
        props: ['engagementId'],
        data() {
            return {
                organization: this.$store.state.organization,
                name: '',
                description: '',
                startDate: null,
                startDateMenu: false,
                endDate: null,
                endDateMenu: false,
                schedules: '',
                rejectionComments: '',
                token: null,
                engagement: {
                    NewOrganizationName: "default Organization"
                }
            }
        },
        beforeMount() {
            if (this.$route.query && this.$route.query.token) {
                this.token = this.$route.query.token
                this.verifyEmail()
            } else {
                this.loadData()
            }
        },
        methods: {
            verifyEmail () {
                this.$store.dispatch(
                    "userProfile/verifyEmailFromEngagement",
                    {
                        token: this.$route.query.token,
                        engagementId: this.engagementId,
                        decision: this.$route.query.decision
                    },
                    { root: true }
                )
            },

            loadData () {
                if (this.$route.query && this.$route.query.decision) {
                    if (this.$route.query.decision === 'accept') {
                        this.engagement.Accepted = true
                    } else {
                        this.engagement.Rejected = true
                    }
                }
                this.loadLocalEngagement()
                this.loadEngagementDetails()
            },

            fillEngagementDetails (engagement) {
                this.name = engagement.Name 
                this.description = engagement.Description
                this.schedules = engagement.Schedules.join(",")
                this.startDate = moment(engagement.StartDate).format("YYYY-MM-DD")
                this.endDate = moment(engagement.EndDate).format("YYYY-MM-DD")
            },

            loadLocalEngagement () {
                let engagements = this.organization.engagements
                if (engagements) {
                    let filteredEngagements = engagements.filter(engagement => engagement.EntityID == this.engagementId)
                    if (filteredEngagements && filteredEngagements.length > 0) {
                        this.engagement = Object.assign({}, this.engagement, filteredEngagements[0])
                        this.fillEngagementDetails(this.engagement)
                    }
                }
            },

            async loadEngagementDetails () {
                console.log("[ Vuex ]: loadEngagementDetails() in engagement component")

                try {
                    const engagement = await organizationEngagementService.getEngagement(this.engagementId)

                    if (engagement) {
                        this.engagement = Object.assign({}, this.engagement, engagement)
                        this.fillEngagementDetails(this.engagement)
                    } else console.log("[ Vuex ]: empty engagement details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading engagement details from service")
                }
            },

            prepareEngagement() {
                let engagement = this.engagement

                engagement.Name = this.name
                engagement.Description = this.description
                engagement.StartDate = formatDate(this.startDate)
                engagement.EndDate = moment(this.endDate).toISOString()
                engagement.Schedules = this.schedules.split(",")
                engagement.RejectionComments = this.rejectionComments

                return engagement
            },

            async submit () {
                let valid = await this.$validator.validateAll()
                if (valid) {
                    console.log("[ Vuex ]: submit() in save engagement component")

                    try {
                        let engagement = this.prepareEngagement()
                        const response = await organizationEngagementService.saveEngagement(engagement)

                        if (response) this.$store.dispatch("navigateTo", urls.engagements, {root: true})
                        else console.log("[ Vuex ]: error save engagement")

                    } catch (e) {
                        console.error("[ Vuex ]: Error save engagement")
                    }
                }
            }
        }
    }
</script>
<!-- styling for the component -->
<style>
</style>
