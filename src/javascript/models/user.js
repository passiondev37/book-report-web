export default class User {
    constructor (authData = {}) {

        this.localStorageKey = "User"

        this.username = authData.username || null
        this.token = authData.AuthToken || null
        this.id = authData.EntityID || null
        this.displayName = authData.DisplayName || (authData.Email && authData.Email.length > 0 && authData.Email[0])
        this.firstName = authData.FirstName || ""
        this.lastName = authData.LastName || ""
        this.emails = authData.Email || null
        this.emailHash = authData.EmailHash || ""
        this.active = authData.Active || false
        this.emailConfirmed = authData.EmailConfirmed || false
    }

    get isGuest() {
        return this.token === null
    }
}