import baseService from "./baseService"
import { organizationFolderHTTP } from "./urlProvider"
import { errorAlert } from "../../models/alert"

export default class organizationFolderService extends baseService {

    static async getFolderList() {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationFolderHTTP.url().folders)

            switch (response.status) {
                case 200:

                    let foldersListResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", foldersListResponse)

                    if (Array.isArray(foldersListResponse)) {
                        return foldersListResponse
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

    static async createFolder(object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(organizationFolderHTTP.url().folders, object)

            switch (response.status) {
                case 201:

                    let folder = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", folder)

                    return folder

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

    static async getFolderDetails (folderId) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFolderHTTP.url(folderId).details
            const response = await this.get(url)

            switch (response.status) {
                case 200:

                    let folderDetails = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", folderDetails)

                    return folderDetails

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