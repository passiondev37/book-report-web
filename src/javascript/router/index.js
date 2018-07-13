import store from "../store"
import VueRouter from "vue-router"

import urls from "./urls"
// Index
import dashboardComponent from "../components/dashboard.vue"
// Login/Register
import loginComponent from "../components/profile/login.vue"
import signUpComponent from "../components/profile/signup.vue"
import verifyEmailComponent from "../components/profile/verifyEmail.vue"
import notifyEmailSentComponent from "../components/profile/notifyEmailSent.vue"
// Profile edit
import profileComponent from "../components/profile/profile.vue"
// Project details
import projectDetailsComponent from "../components/projects/projectDetails.vue"
// Project list
import projectListComponent from "../components/projects/projectList.vue"
// Create Project
import createProjectComponent from "../components/projects/createProject.vue"
// Search
import libraryComponent from "../components/library/library.vue"

import fileDetailsComponent from "../components/files/fileDetails.vue"
import fileViewerComponent from "../components/files/fileViewer.vue"
// Engagement
import createEngagementComponent from "../components/engagements/createEngagement.vue"
import engagementComponent from "../components/engagements/engagement.vue"
import engagementsComponent from "../components/engagements/engagements.vue"
// Proposal
import proposalsComponent from "../components/proposals/proposals.vue"
import createProposalComponent from "../components/proposals/createProposal.vue"
// Document Request
import createDocumentRequestComponent from "../components/documentRequests/createDocumentRequest.vue"
import fulfillDocumentRequestComponent from "../components/documentRequests/fulfillDocumentRequest.vue"
import reviewDocumentRequestComponent from "../components/documentRequests/reviewDocumentRequest.vue"
// Milestone
import createUpdateMilestoneComponent from "../components/milestones/milestone.vue"
// Project Types
import projectTypesComponent from "../components/projectTypes/projectTypes.vue"
import createUpdateProjectTypeComponent from "../components/projectTypes/projectType.vue"
// Diagram
import diagramComponent from "../components/diagram/diagram.vue"
// Trade Types
import tradeTypesComponent from "../components/tradeTypes/tradeTypes.vue"
import createUpdateTradeTypeComponent from "../components/tradeTypes/tradeType.vue"

const router = new VueRouter({
    routes: [
        { path: urls.fileViewer, component: fileViewerComponent, name: "File Viewer", props: true },
        { path: urls.index, component: dashboardComponent, name: "Dashboard" },
        { path: urls.login, component: loginComponent, name: "Login" },
        { path: urls.signup, component: signUpComponent, name: "Sign Up" },
        { path: urls.verifyEmail, component: verifyEmailComponent, name: "Verify Email", props: true },
        { path: urls.profile, component: profileComponent, name: "Profile" },
        { path: urls.profileInit, component: profileComponent, name: "Profile Information" },
        { path: urls.profileChangePassword, component: profileComponent, name: "Profile | New Password" },
        { path: urls.profileResetPassword, component: profileComponent, name: "Profile | Reset Password" },
        { path: urls.profileResetPasswordCompleted, component: profileComponent, name: "Profile | Reset Complete" },
        { path: urls.library, component: libraryComponent, name: "Library" },
        { path: urls.libraryFile, component: fileDetailsComponent, name: "File", props: true },
        { path: urls.libraryWithSearch, component: libraryComponent, name: "Search in Library" },
        { path: urls.projects, component: projectListComponent, name: "Projects" },
        { path: urls.createProject, component: createProjectComponent, name: "Create Project" },
        { path: urls.project, component: projectDetailsComponent, name: "Project", props: true },
        { path: urls.engagements, component: engagementsComponent, name: "Engagements" },
        { path: urls.createEngagement, component: createEngagementComponent, name: "Create Engagement" },
        { path: urls.engagement, component: engagementComponent, name: "Engagement", props: true },
        { path: urls.proposals, component: proposalsComponent, name: "Proposals" },
        { path: urls.createProposal, component: createProposalComponent, name: "Create Proposal" },
        { path: urls.createDocumentRequest, component: createDocumentRequestComponent, name: "Create Document Request", props: true },
        { path: urls.fulfillDocumentRequest, component: fulfillDocumentRequestComponent, name: "Fulfill Document Request", props: true },
        { path: urls.reviewDocumentRequest, component: reviewDocumentRequestComponent, name: "Review Document Request", props: true },
        { path: urls.addMilestone, component: createUpdateMilestoneComponent, name: "Add Milestone", props: true },
        { path: urls.editMilestone, component: createUpdateMilestoneComponent, name: "Edit Milestone", props: true },
        { path: urls.projectTypes, component: projectTypesComponent, name: "Project Types" },
        { path: urls.addProjectType, component: createUpdateProjectTypeComponent, name: "Add Project Type" },
        { path: urls.editProjectType, component: createUpdateProjectTypeComponent, name: "Edit Project Type", props: true },
        { path: urls.diagram, component: diagramComponent, name: "Diagram" },
        { path: urls.tradeTypes, component: tradeTypesComponent, name: "Trade Types" },
        { path: urls.addTradeType, component: createUpdateTradeTypeComponent, name: "Add Trade Type" },
        { path: urls.editTradeType, component: createUpdateTradeTypeComponent, name: "Edit Trade Type", props: true },
        { path: urls.notifyEmailSent, component: notifyEmailSentComponent, name: "Almost Done" }
    ]
})

// Global hook: change Navbar Header
router.beforeEach((to, from, next) => {
    console.log(`-> Route processing in Global hook to=${to.path}`, to)

    store.commit("setToolbarTitle", to.name)

    if (to.path.includes(urls.verifyEmailShort)) {
        next()
        return
    } else if (to.name === 'Engagement' && to.query && to.query.token) {
        next()
        return
    }

    switch (to.path) {
        // NO redirect component
        case urls.profileResetPassword:
        case urls.profileResetPasswordCompleted:
        case urls.notifyEmailSent:
            console.log("-> Route NO redirect")
            next()

            break
        // Redirect to index component if User is logged
        case urls.login:
        case urls.signup:

            if (store.state.userProfile.user.active && store.state.userProfile.user.emailConfirmed) {
                console.log("-> Route redirect to index")
                next(urls.index)
            }
            else next()

            break
        // Redirect to login component if User is NOT logged
        default:
            if (store.state.userProfile.user.active && store.state.userProfile.user.emailConfirmed) {
                console.log("-> Route success for User state")
                next()
            }
            else {
                console.log("-> Route redirect to login")
                next(urls.login)
            }
    }
})

export default router