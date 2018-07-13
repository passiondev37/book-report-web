<template>
    <div>
        <v-layout row wrap>
            <v-card-text class="headline">
                Proposals
                <v-btn outline fab small to="/proposals/new">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-card-text>
        </v-layout>
        <v-layout row wrap>
            <v-card-text>
                <v-data-table
                    v-bind:headers="headers"
                    :items="organization.proposals"
                    hide-actions
                    class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.Name }}</td>
                        <td>{{ props.item.ProspectEmail }}</td>
                        <td>{{ props.item.StartDate }}</td>
                        <td>{{ props.item.EndDate | formatDate }}</td>
                        <td>
                            <span class="grey pa-1" 
                                v-if="props.item.Status === 0">SENT</span>
                            <span class="grey pa-1" 
                                v-else-if="props.item.Status === 1">READ</span>
                            <span class="grey pa-1" 
                                v-else-if="props.item.Status === 2">ACCEPTED</span>
                            <span class="grey pa-1" 
                                v-else>REJECTED</span>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-layout>
    </div>
</template>

<script>
    import organization from "../../store/account/organization"

    export default {
        beforeMount() {
            console.info(":// Display Proposals component")
            this.$store.dispatch("organization/loadProposals")
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
                        text: 'Prospect Email',
                        align: 'left',
                        sortable: false,
                        value: 'email'
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
                        text: 'Status',
                        align: 'left',
                        sortable: false, 
                        value: 'status'
                        }
                ],
                items: []
            }
        },
        computed: {

        },
        methods: {},
        components: {
        }
    }
</script>