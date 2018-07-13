import baseService from "./baseService"
import { organizationTradeTypeHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationTradesService extends baseService {

    static async getTradeTypes() {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationTradeTypeHTTP.url().tradeTypes)

            switch (response.status) {
                case 200:

                    let tradeTypes = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", tradeTypes)

                    if (Array.isArray(tradeTypes)) {
                        return tradeTypes
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

    static async createUpdateTradeType(tradeType, isNew) {
        this.commit("ajaxLoading", true)

        try {
            let response
            if (isNew) {
                response = await this.post(organizationTradeTypeHTTP.url().tradeTypes, tradeType)
            } else {
                response = await this.put(organizationTradeTypeHTTP.url(tradeType.EntityID).tradeType, tradeType)
            }

            switch (response.status) {
                case 200:
                case 201:

                    let tradeType = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", tradeType)

                    return tradeType

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

    static async deleteTradeType(tradeTypeId) {
        this.commit("ajaxLoading", true)

        try {
            let response = await this.delete(organizationTradeTypeHTTP.url(tradeTypeId).tradeType)

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