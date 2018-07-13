<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="headline">Fulfill Document Request</v-flex>
            <v-flex xs12><v-divider /></v-flex>

            <v-flex xs2><v-subheader>Project</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ project.Name }}</v-flex>

            <v-flex xs2><v-subheader>Requested By</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ documentRequest.RequestedBy }}</v-flex>

            <v-flex xs2><v-subheader>Documents Requested</v-subheader></v-flex>
            <v-flex xs10 d-flex>{{ documentRequest.Documents }}</v-flex>

            <dropzone ref="dropzone" :projectId="projectId" :auto="true" />
        </v-layout>

        <v-layout row wrap>
            <v-flex class="text-xs-left mt-3">
                <v-btn outline @click.stop="dialogFulfillRequest=true">Done</v-btn>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialogFulfillRequest" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />Fulfill request?
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogFulfillRequest=false;dialogInfo=true">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                   Confirm that you have attached all the files requested.
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="fulfillDocumentRequest">Yes</v-btn>
                    <v-btn outline @click.stop="dialogFulfillRequest=false;dialogInfo=true">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogNotification" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon icon="info-circle" size="lg" pull="left" />Requester notified
                    <v-spacer />
                    <v-btn flat icon @click="closeNotification">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                   Requester notified about the document request fulfillment.
                </v-card-text>
                <v-card-actions>
                    <v-btn outline @click="closeNotification">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogInfo" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon icon="info-circle" size="lg" pull="left" />Fulfill later
                    <v-spacer />
                    <v-btn flat icon @click="closeNotification">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>
                   You can come back to this page and attach the remaining files when available.
                </v-card-text>
                <v-card-actions>
                    <v-btn outline @click="closeNotification">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import organization from "../../store/account/organization"
    import organizationDocumentRequestService from "../../service/network/organizationDocumentRequestService"
    import organizationProjectsService from "../../service/network/organizationProjectsService"
    import settings from "../../settings.js"
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import dropzone from '../files/vueDropzone'

    export default {
        name: 'fulfillDocumentRequest',
        components: { FontAwesomeIcon, dropzone },
        props: ['projectId', 'documentRequestId'],
        data() {
            return {
                organization: this.$store.state.organization,
                documentRequest: {},
                project: {},
                dialogFulfillRequest: false,
                dialogNotification: false,
                dialogInfo: false
            }
        },
        beforeMount() {
            this.loadDocumentRequestDetails()
            this.loadProjectDetails()
        },
        methods: {

            async fulfillDocumentRequest() {
                console.log("[ Vuex ]: fulfillDocumentRequest() in fulfill document request component")
                this.dialogFulfillRequest = false

                try {
                    this.documentRequest["IsFulfillingRequest"] = true
                    const response = await organizationDocumentRequestService.updateDocumentRequest(this.documentRequest)

                    if (response && response.EntityID) {
                        this.dialogNotification = true
                    } else console.log("[ Vuex ]: error fulfill document request")

                } catch (e) {
                    console.error("[ Vuex ]: Error fulfill document request")
                }
            },

            closeNotification() {
                this.dialogNotification = false
                this.dialogInfo = false
                this.$router.go(-1)
            },

            async loadDocumentRequestDetails() {
                console.log("[ Vuex ]: loadDocumentRequestDetails() in fulfill document request component")

                try {
                    const documentRequest = await organizationDocumentRequestService.getDocumentRequest(this.documentRequestId)

                    if (documentRequest) {
                        this.documentRequest = Object.assign({}, this.documentRequest, documentRequest)
                    } else console.log("[ Vuex ]: empty document request details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading document request details from service")
                }
            },

            async loadProjectDetails() {
                console.log("[ Vuex ]: loadProjectDetails() in fulfill document request component")

                try {
                    const project = await organizationProjectsService.getProject(this.projectId)

                    if (project) this.project = project
                    else console.log("[ Vuex ]: empty project details")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading project details from service")
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
