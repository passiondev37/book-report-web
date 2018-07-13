import baseService from "./baseService"
import { organizationUploadSetHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationUploadSetService extends baseService {

    static async createUpdateUploadSet(uploadSet) {
        this.commit("ajaxLoading", true)

        try {
            let response
            if (uploadSet && uploadSet["EntityID"]) {
                response = await this.put(organizationUploadSetHTTP.url(uploadSet["EntityID"]).uploadSet, uploadSet)
            } else {
                response = await this.post(organizationUploadSetHTTP.url().uploadSets, uploadSet)
            }

            switch (response.status) {
                case 200:
                case 201:

                    let upload_set = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", upload_set)

                    return upload_set

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
