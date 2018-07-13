<template>
    <file-search-and-display></file-search-and-display>
</template>

<script>
    import FileSearchAndDisplay from "../files/fileSearchAndDisplay.vue"

    export default {
        beforeMount() {
            console.info(":// Display Library component")
            this.$store.commit("organization/setProjectId", null)
        },
        data() {
            return {}
        },
        computed: {

        },
        
        methods: {},
        components: {
            FileSearchAndDisplay
        }
    }
</script>