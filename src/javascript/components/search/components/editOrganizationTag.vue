<template>
    <span>
        <v-btn class="ma-0 mb-2" outline color="indigo" @click.stop="dialogEditOrgTag=true">Edit Organization Tag</v-btn>

        <v-dialog v-model="dialogEditOrgTag" max-width="600px">
            <v-card>
                <v-card-title>
                    Tags
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-text-field
                            v-model="searchKey"
                            single-line
                            prepend-icon="search"
                            @input="searchTag"
                        ></v-text-field>
                    </v-layout>
                    <v-layout row wrap>
                        <v-data-table
                            :headers="headers"
                            :items="organization.tags"
                            :total-items="organization.tagCount"
                            v-bind:pagination.sync="pagination"
                            class="elevation-1">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>
                                        <v-text-field
                                            v-model="props.item.Name"
                                            single-line />
                                    </td>
                                    <td>
                                        <v-btn outline @click="updateTag(props.item)">Update</v-btn>
                                        <v-btn outline @click="openRemoveDialog(props.item)">Remove</v-btn>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" flat @click.stop="dialogEditOrgTag=false">Done</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRemoveTag" max-width="600px">
            <v-card>
                <v-card-title style="flex-wrap: nowrap; justify-content: space-between">
                    <span>
                        <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />
                        Are you sure you want to remove this tag? Once it's gone, it's gone
                    </span>
                    <v-btn flat icon @click.stop="dialogRemoveTag=false" style="flex: 0 0 auto">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-text>Confirmation required.</v-card-text>
                <v-card-actions>
                    <v-btn flat @click="removeCurTag">Yes</v-btn>
                    <v-btn outline @click.stop="dialogRemoveTag=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </span>
</template>

<script>
    import debounce from "lodash.debounce"
    import store from "store"
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import organizationTagService from "../../../service/network/organizationTagService.js"

    export default {
        components: {
            FontAwesomeIcon
        },
        data () {
            return {
                organization: this.$store.state.organization,
                pagination: {
                    rowsPerPage: this.$store.state.organization.tagPageSize, 
                    page: this.$store.state.organization.currentTagPage
                },
                dialogEditOrgTag: false,
                dialogRemoveTag: false,
                searchKey: null,
                curOrgTag: null,
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false
                        },
                    {
                        text: 'Action',
                        align: 'left',
                        sortable: false
                        }
                ]
            }
        },
        beforeMount () {
            console.info(":// Display Edit Organization Tags component")

            this.$store.dispatch("organization/clearTagFilter")
            this.$store.dispatch("organization/loadTags")
        },
        methods: {
            searchTag() {
                this.sendSearchRequest(this.searchKey)
            },
            sendSearchRequest: debounce((searchKey) => {
                store.dispatch("organization/loadTagsForBasicSearch", searchKey)
            }, 500),
            openRemoveDialog (tag) {
                this.curOrgTag = tag
                this.dialogRemoveTag = true
            },
            async removeCurTag () {
                this.dialogRemoveTag = false

                if (this.curOrgTag) {    
                    console.log("[ Vuex ]: removeCurTag() in edit organization tag component")

                    try {
                        const response = await organizationTagService.deleteTag(this.curOrgTag.EntityID)

                        if (response) this.$store.dispatch("organization/loadTags", this.searchKey)
                        else console.log("[ Vuex ]: Error deleting a org tag")
                    } catch (e) {
                        console.error("[ Vuex ]: Error deleting a org tag")
                    }
                }
            },
            async updateTag (tag) {
                this.dialogEditOrgTag = false

                if (tag) {
                    console.log("[ Vuex ]: updateTag() in edit organization tag component")

                    try {
                        const response = await organizationTagService.createUpdateTag(tag, false)

                        if (response.EntityID) this.$store.dispatch("organization/loadTags", this.searchKey)
                        else console.log("[ Vuex ]: Error updating a org tag")
                    } catch (e) {
                        console.error("[ Vuex ]: Error updating a org tag")
                    }
                }
            }
        },
        watch: {
            pagination: function(newValue) {
                if (newValue) {
                    let paginationData = {"currentPage": newValue.page, "pageSize": newValue.rowsPerPage}
                    this.$store.commit("organization/setTagPagination", paginationData)
                    this.$store.dispatch("organization/loadTags", this.searchKey)
                }
            }
        }
    }
</script>
