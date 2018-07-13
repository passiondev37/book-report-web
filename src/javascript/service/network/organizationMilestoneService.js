import baseService from "./baseService"
import { organizationMilestoneHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationMilestoneService extends baseService {

    static async getMilestones(projectId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationMilestoneHTTP.url(projectId).milestones)

            switch (response.status) {
                case 200:

                    let milestones = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", milestones)

                    if (Array.isArray(milestones)) {
                        return milestones
                    }

                    break

                default:
                    console.error(response.status)
            }
        } catch (e) {

            this.dispatch(
                "notification/showAlert",
                new errorAlert(e.message)
            )

        } finally {
            this.commit("ajaxLoading", false)
        }
    }

    static async getMilestone(projectId, milestoneId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationMilestoneHTTP.url(projectId, milestoneId).milestone)

            switch (response.status) {
                case 200:

                    let milestone = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", milestone)

                    return milestone

                    break

                default:
                    console.error(response.status)
            }
        } catch (e) {

            this.dispatch(
                "notification/showAlert",
                new errorAlert(e.message)
            )

        } finally {
            this.commit("ajaxLoading", false)
        }
    }

    static async createUpdateMilestone(projectId, milestone, isNew) {
        this.commit("ajaxLoading", true)

        try {
            let response
            if (isNew) {
                response = await this.post(organizationMilestoneHTTP.url(projectId).milestones, milestone)
            } else {
                response = await this.put(organizationMilestoneHTTP.url(projectId, milestone.EntityID).milestone, milestone)
            }

            switch (response.status) {
                case 200:
                case 201:

                    let milestone = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", milestone)

                    return milestone

                    break

                default:
                    console.error(response.status)
            }
        } catch (e) {

            this.dispatch(
                "notification/showAlert",
                new errorAlert(e.message)
            )

        } finally {
            this.commit("ajaxLoading", false)
        }
    }

    static async deleteMilestone(projectId, milestoneId) {
        this.commit("ajaxLoading", true)

        try {
            let response = await this.delete(organizationMilestoneHTTP.url(projectId, milestoneId).milestone)

            switch (response.status) {
                case 200:

                    let result = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", result)

                    return result

                    break

                default:
                    console.error(response.status)
            }
        } catch (e) {

            this.dispatch(
                "notification/showAlert",
                new errorAlert(e.message)
            )

        } finally {
            this.commit("ajaxLoading", false)
        }
    }
}
