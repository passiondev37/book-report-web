import baseService from "./baseService"
import { organizationDocumentRequestHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationDocumentRequestService extends baseService {

    static async createDocumentRequest(object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(organizationDocumentRequestHTTP.url().create, object)

            switch (response.status) {
                case 201:

                    let documentRequest = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", documentRequest)

                    return documentRequest

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

    static async updateDocumentRequest(object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.put(organizationDocumentRequestHTTP.url(object.EntityID).documentRequest, object)

            switch (response.status) {
                case 201:

                    let documentRequest = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", documentRequest)

                    return documentRequest

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

    static async getDocumentRequests(projectId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationDocumentRequestHTTP.url(projectId).documentRequests)

            switch (response.status) {
                case 200:

                    let documentRequests = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", documentRequests)

                    if (Array.isArray(documentRequests)) {
                        return documentRequests
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

    static async getDocumentRequest(documentRequestId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationDocumentRequestHTTP.url(documentRequestId).documentRequest)

            switch (response.status) {
                case 200:

                    let documentRequest = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", documentRequest)

                    return documentRequest

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
