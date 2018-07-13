<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="headline">Review Document Request</v-flex>
            <v-flex xs12><v-divider /></v-flex>

            <v-flex xs2><v-subheader>Project member</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ documentRequest.RequestedFrom }}</v-flex>

            <v-flex xs2><v-subheader>Documents</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ documentRequest.Documents }}</v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex>
                <v-btn @click.stop="dialogReviewRequest=true">Save</v-btn>
                <v-btn @click="cancel">Cancel</v-btn>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialogReviewRequest" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />Complete request?
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogReviewRequest=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                   Confirm that all documents are received.
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="reviewDocumentRequest">Yes</v-btn>
                    <v-btn outline @click.stop="dialogReviewRequest=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import organizationDocumentRequestService from "../../service/network/organizationDocumentRequestService"
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

    export default {
        name: 'reviewDocumentRequest',
        components: { FontAwesomeIcon },
        props: ['projectId', 'documentRequestId'],
        data() {
            return {
                documentRequest: {
                },
                dialogReviewRequest: false
            }
        },
        beforeMount() {
            this.loadDocumentRequestDetails()
        },
        methods: {

            cancel () {
                this.$router.go(-1)
            },

            async reviewDocumentRequest () {
                console.log("[ Vuex ]: reviewDocumentRequest() in review document request component")
                this.dialogReviewRequest = false

                try {
                    this.documentRequest["CompleteRequest"] = true

                    const response = await organizationDocumentRequestService.updateDocumentRequest(this.documentRequest)

                    if (response && response.EntityID) {
                        this.$router.go(-1)
                    } else console.log("[ Vuex ]: error review document request")

                } catch (e) {
                    console.error("[ Vuex ]: Error review document request")
                }
            },

            async loadDocumentRequestDetails() {
                console.log("[ Vuex ]: loadDocumentRequestDetails() in review document request component")

                try {
                    const documentRequest = await organizationDocumentRequestService.getDocumentRequest(this.documentRequestId)

                    if (documentRequest) {
                        this.documentRequest = Object.assign({}, this.documentRequest, documentRequest)
                    } else console.log("[ Vuex ]: empty document request details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading document request details from service")
                }
            }
        },
        watch: {
        }
    }
</script>
<!-- styling for the component -->
<style>
    div.flex.d-flex {
        align-items: center
    }
</style>
