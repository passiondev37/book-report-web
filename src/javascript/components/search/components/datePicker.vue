<template>
    <v-flex xs12 sm6>
        <v-layout row wrap>
            <v-flex xs12 sm6 class="pr-3">
                <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menuPickerStart"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px"
                    ref="menuPickerStart"
                    :return-value.sync="organization.searchStartDate"
                >
                    <v-text-field
                        slot="activator"
                        label="Pick start date"
                        v-model="organization.searchStartDate"
                        prepend-icon="event"
                        single-line readonly
                    >
                    </v-text-field>
                    <v-date-picker 
                        v-model="organization.searchStartDate" 
                        no-title 
                        scrollable 
                        actions>
                            <v-btn flat color="primary" @click="menuPickerStart = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menuPickerStart.save(organization.searchStartDate)">Save</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs12 sm6 class="pr-3">
                <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menuPickerEnd"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    ref="menuPickerEnd"
                    :return-value.sync="organization.searchEndDate"
                >
                    <v-text-field
                        slot="activator"
                        label="Pick end date"
                        v-model="organization.searchEndDate"
                        prepend-icon="event"
                        single-line
                        readonly
                    >
                    </v-text-field>
                    <v-date-picker
                        v-model="organization.searchEndDate"
                        no-title
                        scrollable
                        actions
                    >
                        <v-btn flat color="primary" @click="menuPickerEnd = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menuPickerEnd.save(organization.searchEndDate)">Save</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
    export default {
        data () {
            return {
                organization: this.$store.state.organization,
                menuPickerStart: false,
                menuPickerEnd: false
            }
        },
        watch: {
            "organization.searchStartDate": function () {
                this.$store.dispatch("organization/loadFileListAdvanced")
            },
            "organization.searchEndDate": function () {
                this.$store.dispatch("organization/loadFileListAdvanced")
            }
        }
    }
</script>