import baseService from "./baseService"
import { organizationFileHTTP, organizationProjectHTTP } from "./urlProvider"
import { errorAlert } from "../../models/alert"
import store from "../../store"

export default class organizationFileService extends baseService {

    static async getPageMap (documentId) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.previewUrl(documentId).pageMap
            console.log ('Page map URL: ' + url)
            const response = await this.get(url)

            switch (response.status) {
                case 200:

                    let pageMapResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", pageMapResponse)

                    return pageMapResponse

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

    static async getPageMapFullSize (documentId, size) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.previewUrl(documentId).pageMapFullSize
            console.log ('Page map full size URL: ' + url)
            const response = await this.get(url)

            switch (response.status) {
                case 200:

                    let pageMapResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", pageMapResponse)

                    return pageMapResponse

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

    static async getFileList (settings) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(organizationProjectHTTP.url().search, settings)

            switch (response.status) {
                case 200:

                    let fileListResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", fileListResponse)

                    return fileListResponse

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

    static async getFileDetails (fileId) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.fileUrl(fileId).details
            const response = await this.get(url)

            switch (response.status) {
                case 200:

                    let fileDetailsResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", fileDetailsResponse)

                    return fileDetailsResponse

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

    static async moveFiles (fileIds, destId, type) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.fileUrl().move +
                "?to=" + destId +
                "&type=" + type
            const response = await this.post(url, fileIds)

            switch (response.status) {
                case 200:

                    let moveResult = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", moveResult)

                    return moveResult

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

    static async reprocessFile (fileId) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.fileUrl(fileId).reprocess
            const response = await this.post(url)

            switch (response.status) {
                case 200:

                    let fileDetailsResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", fileDetailsResponse)

                    return fileDetailsResponse

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

    static async updateFile (file) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.fileUrl(file.EntityID).update
            const response = await this.put(url, file)

            switch (response.status) {
                case 200:

                    let fileDetailsResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", fileDetailsResponse)

                    return fileDetailsResponse

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

    static getFileLink (fileId) {
        let token = store.state.userProfile.user.token
        return organizationFileHTTP.fileUrl(fileId).download + "&token=" + token
    }

    static getFilesLink (fileIds) {
        let token = store.state.userProfile.user.token
        return organizationFileHTTP.fileUrl().files + 
            "?token=" + token +
            "&fileIds=" + fileIds.join(",")
    }

    static async getDocumentDetails (documentId) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationFileHTTP.documentUrl(documentId).details
            const response = await this.get(url)

            switch (response.status) {
                case 200:

                    let documentDetails = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", documentDetails)

                    return documentDetails

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