import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

import notificationStore from "./notification/notifications"
import userStore from "./account/user"
import organizationStore from "./account/organization"

import router from "../router"
import urls from "../router/urls"

const store = new Vuex.Store({
    modules: {

        notification: notificationStore,
        userProfile: userStore,
        organization: organizationStore

    },
    state: {
        displayProgressBar: false,
        toolbarTitle: "BookReport",
        navigationMenuList: [
            {
                title: "Dashboard",
                icon: "home",
                url: urls.index
            },
            {
                title: "Library",
                icon: "library_books",
                url: urls.library
            },
            {
                title: "Projects",
                icon: "folder_open",
                url: urls.projects
            },
            {
                title: "Engagements",
                icon: "event",
                url: urls.engagements
            },
            {
                title: "Diagram",
                icon: "dashboard",
                url: urls.diagram
            }
        ]
    },
    mutations: {
        ajaxLoading(state, flag) {
            state.displayProgressBar = flag
        },
        setToolbarTitle(state, title) {
            state.toolbarTitle = title || "BookReport"
        }
    },
    actions: {
        navigateTo({ commit, dispatch }, url) {
            router.push(url)
        }
    }
});

export default store