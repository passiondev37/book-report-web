<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-btn to="/tradeTypes/new">Add</v-btn>
            <v-btn :disabled="!curTradeType" @click="editCurTradeType">Edit</v-btn>
            <v-btn :disabled="!curTradeType" @click="dialogDeleteTradeType=true">Delete</v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-data-table
                v-bind:headers="headers"
                :items="tradeTypes"
                hide-actions
                class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr :active="curTradeType && (props.item.EntityID === curTradeType.EntityID)"
                            @click="curTradeType = props.item">
                        <td>{{ props.item.Name }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-layout>

        <v-dialog v-model="dialogDeleteTradeType" max-width="500px">
            <v-card>
                <v-card-title>
                    <font-awesome-icon :icon="['far', 'check-square']" size="lg" pull="left" />
                    Remove "{{ curTradeType && curTradeType.Name }}"?
                    <v-spacer />
                    <v-btn flat icon @click.stop="dialogDeleteTradeType=false">
                        <font-awesome-icon icon="times" />
                    </v-btn>
                </v-card-title>
                <v-card-actions>
                    <v-btn flat @click="removeCurTradeType">Yes</v-btn>
                    <v-btn outline @click.stop="dialogDeleteTradeType=false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import organizationTradeTypesService from "../../service/network/organizationTradeTypesService"
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faCheckSquare } from '@fortawesome/fontawesome-free-regular/index'

    export default {
        components: {
            FontAwesomeIcon
        },
        beforeMount() {
            console.info(":// Display Trade Types component")

            this.loadTradeTypes()
        },
        data() {
            return {
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                        }
                ],
                tradeTypes: [],
                curTradeType: null,
                dialogDeleteTradeType: false
            }
        },
        computed: {

        },
        methods: {
            async loadTradeTypes () {
                console.log("[ Vuex ]: loadTradeTypes() in trade types component")

                try {
                    const tradeTypes = await organizationTradeTypesService.getTradeTypes()

                    if (tradeTypes) {
                        this.tradeTypes = tradeTypes
                    } else console.log("[ Vuex ]: empty trade types")

                } catch (e) {
                    console.error("[ Vuex ]: Error loading trade types from service")
                }
            },
            editCurTradeType () {
                this.$router.push({name: "Edit Trade Type", 
                    params: {tradeTypeId: this.curTradeType.EntityID,
                        tradeType: this.curTradeType}})
            },
            async removeCurTradeType () {
                this.dialogDeleteTradeType = false

                if (this.curTradeType) {
                    console.log("[ Vuex ]: removeCurTradeType() in trade types component")

                    try {
                        const response = await organizationTradeTypesService.
                            deleteTradeType(this.curTradeType.EntityID)

                        if (response) this.loadTradeTypes()
                        else console.log("[ Vuex ]: Error deleting a trade type")
                    } catch (e) {
                        console.error("[ Vuex ]: Error deleting a trade type")
                    }
                }
            }
        }
    }
</script>