<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-btn @click="goToCreateRequest">Initiate request</v-btn>
            <v-btn :disabled="!reviewEnabled" @click="goToReviewRequest">Review request</v-btn>
            <v-btn :disabled="!fulfillEnabled" @click="goToFulfillRequest">Fulfill request</v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-data-table
                v-bind:headers="headers"
                :items="documentRequests"
                hide-actions
                class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr :active="curRequest && (props.item.EntityID === curRequest.EntityID)"
                            @click="curRequest = props.item">
                        <td>{{ props.item.RequestedBy }}</td>
                        <td>{{ props.item.RequestedFrom }}</td>
                        <td>{{ formatDate(props.item.RequestedOn) }}</td>
                        <td>{{ formatDate(props.item.CompletedOn) }}</td>
                        <td>
                            <span class="grey pa-1" 
                                v-if="props.item.Status === 0">Pending</span>
                            <span class="primary pa-1" 
                                v-else-if="props.item.Status === 1">In Review</span>
                            <span class="grey pa-1" 
                                v-else>Completed</span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>
    </v-container>
</template>

<script>
    import organizationDocumentRequestService from "../../service/network/organizationDocumentRequestService"
    import moment from '../../../../node_modules/moment'

    export default {
        name: 'documentRequests',
        props: ['projectId'],
        components: {
        },
        beforeMount () {
            this.loadDocumentRequests()
        },
        data () {
            return {
                headers: [
                    {
                        text: 'Requested By',
                        align: 'left',
                        sortable: false,
                        value: 'requestedBy'
                        },
                    {
                        text: 'Requested From',
                        align: 'left',
                        sortable: false,
                        value: 'requestedFrom'
                        },
                    {
                        text: 'Requested On',
                        align: 'left',
                        sortable: false,
                        value: 'requestedOn'
                        },
                    {
                        text: 'Completed On',
                        align: 'left',
                        sortable: false,
                        value: 'completedOn'
                        },
                    {
                        text: 'Status',
                        align: 'left',
                        sortable: false,
                        value: 'status'
                        }
                ],
                documentRequests: [],
                curRequest: null
            }
        },
        computed: {
            reviewEnabled: function () {
                return this.curRequest 
                    && this.curRequest.Status == 1
            },
            fulfillEnabled: function () {
                return this.curRequest 
                    && this.curRequest.Status != 2
                    && this.curRequest.RequestedFromID == this.$store.state.userProfile.user.id
            }
        },
        methods: {
            async loadDocumentRequests () {
                console.log("[ Vuex ]: loadDocumentRequests() in document requests component")

                try {
                    const documentRequests = await organizationDocumentRequestService.getDocumentRequests(this.projectId)

                    if (documentRequests) {
                        this.documentRequests = documentRequests
                    } else console.log("[ Vuex ]: empty document requests")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading document requests from service")
                }
            },
            formatDate: function (value){
                return moment(value).format('L')
            },
            goToCreateRequest () {
                this.$router.push({ name: "Create Document Request", params: { projectId: this.projectId } })
            },
            goToFulfillRequest () {
                if (this.curRequest) {
                    this.$router.push({ name: "Fulfill Document Request", params: { projectId: this.projectId, documentRequestId: this.curRequest.EntityID } })
                }
            },
            goToReviewRequest () {
                if (this.curRequest) {
                    if (this.curRequest.RequestedFromID == this.$store.state.userProfile.user.id) {
                        this.goToFulfillRequest()
                    } else {
                        this.$router.push({ name: "Review Document Request", params: { projectId: this.projectId, documentRequestId: this.curRequest.EntityID } })
                    }
                }
            }
        }
    }
</script>
<!-- styling for the component -->
<style scoped>

</style>
