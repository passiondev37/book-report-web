import baseService from "./baseService"
import { organizationProjectHTTP } from "./urlProvider"
import { errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"

export default class organizationProjectsService extends baseService {

    static async createProject(object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(organizationProjectHTTP.url().create, object)

            switch (response.status) {
                case 201:

                    let project = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", project)

                    return project

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

    static async updateProject(object) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.put(organizationProjectHTTP.url(object.EntityID).project, object)

            switch (response.status) {
                case 201:
                    let project = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", project)

                    return project

                    break

                default:
                    console.error(response)
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

    static async getProject (projectId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationProjectHTTP.url(projectId).project)

            switch (response.status) {
                case 200:

                    let project = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", project)

                    return project

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

    static async deleteProject (projectId) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.delete(organizationProjectHTTP.url(projectId).delete)

            switch (response.status) {
                case 200:

                    let details = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", details)

                    return details

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

    static async getProjectList() {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationProjectHTTP.url().projects)

            switch (response.status) {
                case 200:

                    let projectsListResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", projectsListResponse)

                    if (Array.isArray(projectsListResponse)) {
                        return projectsListResponse
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

    static async getProjectTypes() {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.get(organizationProjectHTTP.url().projectTypes)

            switch (response.status) {
                case 200:

                    let projectTypes = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", projectTypes)

                    if (Array.isArray(projectTypes)) {
                        return projectTypes
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

    static async createUpdateProjectType(projectType, isNew) {
        this.commit("ajaxLoading", true)

        try {
            let response
            if (isNew) {
                response = await this.post(organizationProjectHTTP.url().projectTypes, projectType)
            } else {
                response = await this.put(organizationProjectHTTP.url(projectType.EntityID).projectType, projectType)
            }

            switch (response.status) {
                case 200:
                case 201:

                    let projectType = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", projectType)

                    return projectType

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

    static async deleteProjectType(projectTypeId) {
        this.commit("ajaxLoading", true)

        try {
            let response = await this.delete(organizationProjectHTTP.url(projectTypeId).projectType)

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