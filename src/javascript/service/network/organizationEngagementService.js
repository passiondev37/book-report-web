import baseService from "./baseService"
import { organizationEngagementHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationEngagementService extends baseService {

    static async createEngagement (object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(organizationEngagementHTTP.url().engagements, 
                object)

            switch (response.status) {
                case 201:

                    let engagement = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", engagement)

                    return engagement

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

    static async saveEngagement (object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.put(organizationEngagementHTTP.url(object.EntityID).save, 
                object)

            switch (response.status) {
                case 200:

                    let engagement = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", engagement)

                    return engagement

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

    static async getEngagement (engagementId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationEngagementHTTP.url(engagementId).engagement)

            switch (response.status) {
                case 200:

                    let engagement = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", engagement)

                    return engagement

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

    static async getEngagements() {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationEngagementHTTP.url().engagements)

            switch (response.status) {
                case 200:

                    let engagements = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", engagements)

                    if (Array.isArray(engagements)) {
                        return engagements
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
}
