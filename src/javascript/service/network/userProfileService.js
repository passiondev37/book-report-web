import baseService from "./baseService"
import { userProfileHTTP } from "./urlProvider"
import { successAlert, errorAlert, warningAlert } from "../../models/alert"

import Exception from "./exceptions"
import urls from "../../router/urls"

export default class userProfileService extends baseService {

    static async logInWithCredentials (userFormAuthData) { // userFormAuthData = { username: (String), password: (String) };
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(userProfileHTTP.url().login, userFormAuthData)

            switch (response.status) {
                case 200:

                    let userResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", userResponse)

                    if (typeof userResponse === "object") {

                        if (
                            userResponse.hasOwnProperty("Active") &&
                            userResponse.hasOwnProperty("AuthToken")
                        ) {
                            // new username field
                            userResponse.username = userFormAuthData.username || userFormAuthData.email
                            // saving
                            this.commit("userProfile/loginUser", userResponse)
                        }
                        else throw new Exception.InvalidUsernamePassword()
                    }

                    else throw new Exception.InvalidUsernamePassword() // password or username was not sent in pair
                    break

                case 401:
                    throw new Exception.InvalidUsernamePassword()
                    break

                case 500:
                case 502:
                case 503:
                case 504:
                    throw new Exception.GatewayTimeout()
                    break

                default:
                    console.error("[ Network ]:", `Error: response.status = ${response.status}`)
                    throw new Exception.InternalServerError()
            }
        } catch (e) {
            let message

            if (
                e instanceof Exception.InvalidUsernamePassword ||
                e instanceof Exception.InternalServerError ||
                e instanceof Exception.GatewayTimeout
            ) {
                console.warn("[ Network ]: No auth")
            } else {
                console.error("[ Network ]:", "Error loading /api/: logInWithCredentials")
                message = "Please check Internet connection"
            }

            this.dispatch(
                "notification/showAlert",
                new errorAlert(message || e.message)
            )

            throw e
        } finally {
            this.commit("ajaxLoading", false)
        }

    }

    static async signupWithEmail (newUserData) { // newUserData = { email: (String) };
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(userProfileHTTP.url().signup, newUserData)

            switch (response.status) {
                case 201:

                    let userResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", userResponse)

                    if (typeof userResponse === "object") {

                        if (
                            userResponse.hasOwnProperty("Active") &&
                            userResponse.hasOwnProperty("AuthToken")
                        ) {
                            // new username field
                            userResponse.username = newUserData.email
                            // saving
                            this.commit("userProfile/loginUser", userResponse)

                            this.dispatch("navigateTo", urls.notifyEmailSent)
                        }
                        else throw new Exception.InvalidEmail()
                    }

                    else throw new Exception.InvalidEmail()
                    break

                case 403:
                case 404:
                    throw new Exception.InvalidEmail()
                    break

                case 500:
                case 502:
                case 503:
                case 504:
                    throw new Exception.GatewayTimeout()
                    break

                default:
                    console.error("[ Network ]:", `Error: response.status = ${response.status}`)
                    throw new Exception.InternalServerError()
            }
        } catch (e) {
            let message

            if (
                e instanceof Exception.InvalidEmail ||
                e instanceof Exception.InternalServerError ||
                e instanceof Exception.GatewayTimeout
            ) {
                console.warn("[ Network ]: No email")
            } else {
                console.error("[ Network ]:", "Error loading /api/: signupWithEmail")
                message = "Please check Internet connection"
            }

            this.dispatch(
                "notification/showAlert",
                new errorAlert(message || e.message)
            )

            throw e
        } finally {
            this.commit("ajaxLoading", false)
        }

    }

    static async verifyEmailWithToken (tokenData) { // tokenData = { token: (String) };
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(userProfileHTTP.url().verifyEmail, tokenData)

            switch (response.status) {
                case 200:

                    let userResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", userResponse)

                    if (typeof userResponse === "object") {

                        if (
                            userResponse.hasOwnProperty("Active") &&
                            userResponse.hasOwnProperty("AuthToken")
                        ) {
                            // saving
                            this.commit("userProfile/loginUser", userResponse)
                        }
                        else throw new Exception.InvalidVerifyToken()
                    }

                    else throw new Exception.InvalidVerifyToken()
                    break

                case 401:
                    throw new Exception.InvalidVerifyToken()
                    break

                case 500:
                case 502:
                case 503:
                case 504:
                    throw new Exception.GatewayTimeout()
                    break

                default:
                    console.error("[ Network ]:", `Error: response.status = ${response.status}`)
                    throw new Exception.InternalServerError()
            }
        } catch (e) {
            let message

            if (
                e instanceof Exception.InvalidVerifyToken ||
                e instanceof Exception.InternalServerError ||
                e instanceof Exception.GatewayTimeout
            ) {
                console.warn("[ Network ]: Invalid token")
            } else {
                console.error("[ Network ]:", "Error loading /api/: verifyEmailWithToken")
                message = "Please check Internet connection"
            }

            this.dispatch(
                "notification/showAlert",
                new errorAlert(message || e.message)
            )

            throw e
        } finally {
            this.commit("ajaxLoading", false)
        }

    }

    static async changePasswordForUser (user, newPassword) {
        this.commit("ajaxLoading", true)

        const userAccountData = {
            NewPassword: newPassword,
            UserAccountID: user.id
        }

        try {
            const response = await this.post(userProfileHTTP.url().passwordChange, userAccountData)

            switch (response.status) {
                case 200:

                    let userResponse = await response.json()

                    console.info("[ Network ]:", "status: ok", "response:", userResponse)

                    // return true on success
                    return userResponse.hasOwnProperty("AuthToken")

                    break
                case 401:
                    throw new Exception.InvalidToken()
                    break

                default:
                    console.error("[ Network ]:", `Error: response.status = ${response.status}`)
                    throw new Exception.InternalServerError()
            }
        } catch (e) {

            this.dispatch(
                "notification/showAlert",
                    e instanceof Exception.InvalidToken ?
                new warningAlert(e.message) :
                new errorAlert(e.message)
            )

        } finally {
            this.commit("ajaxLoading", false)
        }
    }

    static async updateUser (userId, data) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.put(userProfileHTTP.url(userId).update, data)

            switch (response.status) {
                case 200:

                    let userResponse = await response.json()

                    console.info("[ Network ]:", "status: ok", "response:", userResponse)

                    return userResponse

                    break
                case 401:
                    throw new Exception.InvalidToken()
                    break

                default:
                    console.error("[ Network ]:", `Error: response.status = ${response.status}`)
                    throw new Exception.InternalServerError()
            }
        } catch (e) {

            this.dispatch(
                "notification/showAlert",
                    e instanceof Exception.InvalidToken ?
                new warningAlert(e.message) :
                new errorAlert(e.message)
            )

        } finally {
            this.commit("ajaxLoading", false)
        }
    }

    static async resetPasswordToEmail (emailData) {
        this.commit("ajaxLoading", true)

        try {
            const response = await this.post(userProfileHTTP.url().passwordReset, emailData)

            switch (response.status) {
                case 200:

                    let resetResponse = await response.json()
                    console.info("[ Network ]:", "status: ok", "response:", resetResponse)

                    if (typeof resetResponse === "object") {
                        if (
                            resetResponse.hasOwnProperty("Status")
                            &&
                            resetResponse.Status === 0
                        )
                            return true
                    }

                    break

                case 404:
                    throw new Exception.InvalidEmail()
                    break

                case 500:
                case 502:
                case 503:
                case 504:
                    throw new Exception.GatewayTimeout()
                    break

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