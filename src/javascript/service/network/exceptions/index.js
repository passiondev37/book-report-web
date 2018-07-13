export class InvalidUsernamePassword extends Error {
    constructor(e) {
        super(e)
        this.message = "Invalid username or password"
    }
}

export class InvalidEmail extends Error {
    constructor(e) {
        super(e)
        this.message = "Invalid email"
    }
}

export class InvalidToken extends Error {
    constructor(e) {
        super(e)
        this.message = "Invalid API token"
    }
}

export class InvalidVerifyToken extends Error {
    constructor(e) {
        super(e)
        this.message = "Invalid Verify token"
    }
}

export class GatewayTimeout extends Error {
    constructor(e) {
        super(e)
        this.message = "Gateway timeout"
    }
}

export class InternalServerError extends Error {
    constructor(e) {
        super(e)
        this.message = "Internal server error"
    }
}

export default {
    InvalidUsernamePassword,
    InvalidEmail,
    InvalidToken,
    InvalidVerifyToken,
    GatewayTimeout,
    InternalServerError
}