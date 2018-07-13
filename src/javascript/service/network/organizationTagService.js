import baseService from "./baseService"
import { organizationTagHTTP } from "./urlProvider"
import { errorAlert } from "../../models/alert"
import store from "../../store"

export default class organizationTagService extends baseService {

    static async getTags (settings) {
        this.commit("ajaxLoading", true)

        try {
            let url = organizationTagHTTP.url().search +
                "?query=" + (settings.query || "") +
                "&userId=" + (settings.userId || "") +
                "&currentPage=" + (settings.currentPage || "") +
                "&itemsperPage=" + (settings.itemsperPage || "")
            const response = await this.get(url)

            switch (response.status) {
                case 200:

                    let tags = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", tags)

                    return tags

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

    static async createUpdateTag(tag, isNew) {
        this.commit("ajaxLoading", true)

        try {
            let response
            if (isNew) {
                response = await this.post(organizationTagHTTP.url().tag, tag)
            } else {
                response = await this.put(organizationTagHTTP.url(tag.EntityID).tag, tag)
            }

            switch (response.status) {
                case 200:
                case 201:
                    let tag = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", tag)

                    return tag

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

    static async deleteTag (tagId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.delete(organizationTagHTTP.url(tagId).tag)

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