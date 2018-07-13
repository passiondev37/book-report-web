<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-btn @click="goToAddMilestone">Add</v-btn>
            <v-btn :disabled="!curMilestone" @click="editCurMilestone">Edit</v-btn>
            <v-btn :disabled="!curMilestone" @click="dialogDeleteMilestone=true">Delete</v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-data-table
                v-bind:headers="headers"
                :items="milestones"
                hide-actions
                class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr :active="curMilestone && (props.item.EntityID === curMilestone.EntityID)"
                            @click="curMilestone = props.item">
                        <td>{{ props.item.Ordinal }}</td>
                        <td>{{ props.item.Name }}</td>
                        <td>{{ formatDate(props.item.EstimatedStartDate) }}</td>
                        <td>{{ formatDate(props.item.EstimatedEndDate) }}</td>
                        <td>{{ formatDate(props.item.ActualEndDate) }}</td>
                        <td>{{ formatDate(props.item.ActualEndDate) }}</td>
                        <td>
                            <span class="grey pa-1" 
                                v-if="props.item.Status === 0">Not Started</span>
                            <span class="grey pa-1" 
                                v-else-if="props.item.Status === 1">In Progress</span>
                            <span class="grey pa-1" 
                                v-else>Complete</span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>

        <v-dialog v-model="dialogDeleteMilestone" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />
                    Remove "{{ curMilestone && curMilestone.Name }}"?
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogDeleteMilestone=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-actions>
                    <v-btn flat @click="removeCurMilestone">Yes</v-btn>
                    <v-btn outline @click.stop="dialogDeleteMilestone=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import organizationMilestoneService from "../../service/network/organizationMilestoneService"
    import moment from '../../../../node_modules/moment'
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faCheckSquare } from '@fortawesome/fontawesome-free-regular/index'

    export default {
        name: 'milestones',
        props: ['projectId'],
        components: {
            FontAwesomeIcon
        },
        beforeMount () {
            this.loadMilestones()
        },
        data () {
            return {
                headers: [
                    {
                        text: 'Ordinal',
                        align: 'left',
                        sortable: false,
                        value: 'ordinal'
                        },
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                        },
                    {
                        text: 'Estimated Start Date',
                        align: 'left',
                        sortable: false,
                        value: 'estStartDate'
                        },
                    {
                        text: 'Estimated End Date',
                        align: 'left',
                        sortable: false,
                        value: 'estEndDate'
                        },
                    {
                        text: 'Actual Start Date',
                        align: 'left',
                        sortable: false,
                        value: 'actStartDate'
                        },
                    {
                        text: 'Actual End Date',
                        align: 'left',
                        sortable: false,
                        value: 'actEndDate'
                        },
                    {
                        text: 'Status',
                        align: 'left',
                        sortable: false,
                        value: 'status'
                        }
                ],
                milestones: [],
                curMilestone: null,
                dialogDeleteMilestone: false
            }
        },
        computed: {
        },
        methods: {
            async loadMilestones () {
                console.log("[ Vuex ]: loadMilestones() in milestones component")

                try {
                    const milestones = await organizationMilestoneService.getMilestones(this.projectId)

                    if (milestones) {
                        this.milestones = milestones
                    } else console.log("[ Vuex ]: empty milestones")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading milestones from service")
                }
            },
            formatDate: function (value){
                if (!value) return ''
                return moment(value).format('L')
            },
            goToAddMilestone () {
                this.$router.push({name: "Add Milestone", 
                    params: {projectId: this.projectId, 
                        ordinal: this.milestones.length + 1}})
            },
            editCurMilestone () {
                this.$router.push({name: "Edit Milestone", 
                    params: {projectId: this.projectId, 
                        milestoneId: this.curMilestone.EntityID,
                        details: this.curMilestone}})
            },
            async removeCurMilestone () {
                this.dialogDeleteMilestone = false

                if (this.curMilestone) {
                    console.log("[ Vuex ]: removeCurMilestone() in milestones component")

                    try {
                        const response = await organizationMilestoneService.
                            deleteMilestone(this.projectId, this.curMilestone.EntityID)

                        if (response) this.loadMilestones()
                        else console.log("[ Vuex ]: Error deleting a milestone")
                    } catch (e) {
                        console.error("[ Vuex ]: Error deleting a milestone")
                    }
                }
            }
        }
    }
</script>
<!-- styling for the component -->
<style scoped>

</style>
