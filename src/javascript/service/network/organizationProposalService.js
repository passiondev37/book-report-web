import baseService from "./baseService"
import { organizationProposalHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationProposalService extends baseService {

    static async createProposal(object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(organizationProposalHTTP.url().create, object)

            switch (response.status) {
                case 201:

                    let proposal = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", proposal)

                    return proposal

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

    static async getProposals() {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationProposalHTTP.url().proposals)

            switch (response.status) {
                case 200:

                    let proposals = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", proposals)

                    if (Array.isArray(proposals)) {
                        return proposals
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