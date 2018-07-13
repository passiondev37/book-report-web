<template>
    <v-toolbar app dark class="light-blue darken-3" fixed clippedLeft dense>
        <v-toolbar-side-icon @click.stop="menuToggle"></v-toolbar-side-icon>
        <v-toolbar-title class="white--text" v-text="this.$store.state.toolbarTitle"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y>
            <v-toolbar-title slot="activator" v-text="userName"></v-toolbar-title>
            <v-list v-if="logged">
                <v-list-tile v-for="menu in profileMenuList" v-bind:key="menu.title" @click="moveToURL(menu.url)">
                    <v-list-tile-title v-text="menu.title"></v-list-tile-title>
                    <v-icon class="user-drop-menu-icon light-blue--text text--darken-3" v-text="menu.icon"></v-icon>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-icon right class="white--text" v-if="logged">arrow_drop_down</v-icon>
    </v-toolbar>
</template>

<script>
    export default {
        name: "toolbar",
        data() {
            return {
                profileMenuList: this.$store.state.userProfile.profileMenu
            }
        },
        computed: {
            logged() {
                return Boolean(this.$store.state.userProfile.user.token 
                    && this.$store.state.userProfile.user.emailConfirmed)
            },
            userName() {
                return this.$store.state.userProfile.user.displayName
            }
        },
        methods: {
            moveToURL(url) {
                // TODO: move to url watcher or .logout component
                if (url.indexOf("logout") !== -1) this.logOut()

                else this.$store.dispatch("navigateTo", url, { root: true })
            },
            logOut() {
                this.$store.dispatch("userProfile/logOut")
            },
            menuToggle() {
                const parentScope = this.$parent.$parent.$data

                parentScope.drawer = !parentScope.drawer
            }
        }
    }
</script>