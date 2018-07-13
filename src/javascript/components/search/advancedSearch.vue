<template>
    <v-card grey lighten-4 elevation-0>
        <v-card-text>
            <v-container fluid>
                <navigationButtonsComponent></navigationButtonsComponent>
                <v-layout row>
                    <projectComponent></projectComponent>
                    <nameComponent></nameComponent>
                    <contentComponent></contentComponent>
                    <tagComponent></tagComponent>
                </v-layout>
                <v-layout row>
                    <datePickerComponent></datePickerComponent>
                    <searchOptionsComponent></searchOptionsComponent>
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import navigationButtonsComponent from "./components/navigation.vue"
    import projectComponent from "./components/project.vue"
    import nameComponent from "./components/name.vue"
    import contentComponent from "./components/content.vue"
    import tagComponent from "./components/tag.vue"

    import datePickerComponent from "./components/datePicker.vue"
    import searchOptionsComponent from "./components/options.vue"

    export default {
        beforeMount() {
            console.info(":// Display Advanced Search component")
        },
        data () {
            return {}
        },
        components: {
            navigationButtonsComponent,
            projectComponent,
            nameComponent,
            contentComponent,
            tagComponent,

            datePickerComponent,
            searchOptionsComponent
        }
    }
</script>