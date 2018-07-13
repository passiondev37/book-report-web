<template>
    <v-layout row wrap>
        <v-flex>
            <form>
                <v-text-field
                    v-model="name"
                    label="Name"
                    :counter="50"
                    :error-messages="errors.collect('name')"
                    v-validate="'required|max:50'"
                    data-vv-name="name"
                    required />

                <v-text-field 
                    v-model="notes"
                    label="Notes"
                    multi-line />

                <v-subheader>Required Documents</v-subheader>
                <v-data-table
                    v-bind:headers="documentsHeaders"
                    :items="documentsWrapper"
                    hide-actions
                    class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td v-if="props.index==0">
                            <v-text-field v-model="documentName"
                                :error-messages="errors.collect('document name')"
                                data-vv-name="document name"
                                v-validate="'required'"
                                required />
                        </td>
                        <td v-if="props.index==0">
                            <v-text-field 
                                v-model="documentDesc"
                                rows=2
                                multi-line
                                :error-messages="errors.collect('document description')"
                                data-vv-name="document description"
                                v-validate="'required'"
                                required />
                        </td>
                        <td v-if="props.index==0">
                            <v-btn flat icon color="primary" @click="addDocument">
                                <v-icon>add</v-icon>
                            </v-btn>
                        </td>
                        <td v-if="props.index!=0">{{ props.item.Name }}</td>
                        <td v-if="props.index!=0">{{ props.item.Description }}</td>
                        <td v-if="props.index!=0">
                            <v-btn flat icon color="error" @click="removeDocument(props.item)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>

                <v-subheader>Data To Be Extracted</v-subheader>
                <v-data-table
                    v-bind:headers="dataHeaders"
                    :items="dataWrapper"
                    hide-actions
                    class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td v-if="props.index==0">
                            <v-text-field v-model="dataName"
                                :error-messages="errors.collect('data name')"
                                data-vv-name="data name"
                                v-validate="'required'"
                                required />
                        </td>
                        <td v-if="props.index==0">
                            <v-text-field 
                                v-model="dataDesc"
                                rows=2
                                multi-line
                                :error-messages="errors.collect('data description')"
                                data-vv-name="data description"
                                v-validate="'required'"
                                required />
                        </td>
                        <td v-if="props.index==0">
                            <v-btn flat icon color="primary" @click="addData">
                                <v-icon>add</v-icon>
                            </v-btn>
                        </td>
                        <td v-if="props.index!=0">{{ props.item.Name }}</td>
                        <td v-if="props.index!=0">{{ props.item.Description }}</td>
                        <td v-if="props.index!=0">
                            <v-btn flat icon color="error" @click="removeData(props.item)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>

                <v-btn @click="submit">Save</v-btn>
                <v-btn @click="cancel">Cancel</v-btn>
            </form>
        </v-flex>
    </v-layout>
</template>

<script>
    import moment from 'moment'
    import organizationTradeTypesService from "../../service/network/organizationTradeTypesService"

    export default {
        $validates: true,
        name: "TradeType",
        props: ['tradeTypeId', 'tradeType'],
        beforeMount() {
            console.info(":// Create / Update Trade Type component")

            this.name = (this.tradeType && this.tradeType.Name) || ''
            this.notes = (this.tradeType && this.tradeType.Notes) || ''
            this.documents = (this.tradeType && this.tradeType.Documents) || []
            this.data = (this.tradeType && this.tradeType.Data) || []
        },
        computed: {
            documentsWrapper: function () {
                return [{}].concat(this.documents)
            },
            dataWrapper: function () {
                return [{}].concat(this.data)
            }
        },
        data() {
            return {
                name: null,
                notes: null,

                documentName: null,
                documentDesc: null,
                documents: [],

                dataName: null,
                dataDesc: null,
                data: [],
                
                documentsHeaders: [
                    { text: 'Name', align: "left", sortable: false },
                    { text: 'Description', align: "left", sortable: false },
                    { sortable: false },
                ],
                dataHeaders: [
                    { text: 'Name', align: "left", sortable: false },
                    { text: 'Description', align: "left", sortable: false },
                    { sortable: false },
                ]
            }
        },
        methods: {
            async submit () {
                let valid = await this.$validator.validate("name", this.name)
                if (valid) {
                    console.log("[ Vuex ]: submit() in create/edit trade type component")

                    try {
                        let tradeType = Object.assign({}, this.tradeType || {}, {})
                        tradeType.Name = this.name
                        tradeType.Notes = this.notes
                        tradeType.Documents = this.documents
                        tradeType.Data = this.data
                        const response = await organizationTradeTypesService.createUpdateTradeType(tradeType, !this.tradeType)

                        if (response && response.EntityID) {
                            this.$router.go(-1)
                        } else console.log("[ Vuex ]: error create/edit trade type")

                    } catch (e) {
                        console.error("[ Vuex ]: Error create/edit trade type")
                    }
                }
            },
            async addDocument () {
                let valid = await this.$validator.validate("document name", this.documentName)
                valid = await this.$validator.validate("document description", this.documentDesc) && valid
                if (valid) {
                    this.documents.push({
                        Name: this.documentName,
                        Description: this.documentDesc
                    })
                    this.documentName = null
                    this.documentDesc = null
                }
            },
            removeDocument (document) {
                this.documents.splice(this.documents.indexOf(document), 1)
            },
            async addData () {
                let valid = await this.$validator.validate("data name", this.dataName)
                valid = await this.$validator.validate("data description", this.dataDesc) && valid
                if (valid) {
                    this.data.push({
                        Name: this.dataName,
                        Description: this.dataDesc
                    })
                    this.dataName = null
                    this.dataDesc = null
                }
            },
            removeData (data) {
                this.data.splice(this.data.indexOf(data), 1)
            },
            cancel () {
                this.$router.go(-1)
            }
        },
        components: {
        }
    }
</script>