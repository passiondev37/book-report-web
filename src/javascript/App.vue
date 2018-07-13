<template>
    <v-app>
        <v-navigation-drawer
            app
            persistent
            light
            disable-route-watcher
            clipped
            v-model="showDrawer"
            v-bind:mobile-break-point="320"
            width="240">
            <v-list dense>
                <v-list-tile v-for="menu in navigationMenuList" v-bind:key="menu.title" @click="menuSelected(menu.url)">
                    <v-list-tile-action>
                        <v-icon v-text="menu.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="menu.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <toolbarComponent v-if="showToolbar"></toolbarComponent>
        <main>
            <v-content>
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </v-content>
        </main>
    </v-app>

</template>

<script>
    import store from "store"
    import router from "router"

    import toolbarComponent from "./components/toolbar"

    export default {
        el: "app",
        data() {
            return {
                showToolbar: true,
                drawer: Boolean(store.state.userProfile.user.token && store.state.userProfile.user.emailConfirmed),
                navigationMenuList: this.$store.state.navigationMenuList
            }
        },
        computed: {
            showDrawer() {
                return Boolean(this.$store.state.userProfile.user.token && store.state.userProfile.user.emailConfirmed) && this.drawer
            },
        },
        components: {
            toolbarComponent
        },
        methods: {
            menuSelected(url) {
                store.dispatch("navigateTo", url)
            }
        },
        store,
        router
    }
</script>