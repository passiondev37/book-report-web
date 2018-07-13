class Alert {
    constructor (message) {
        this.message = message
    }
}

export class successAlert extends Alert {
    constructor (message) {
        super(message)

        this.type = "success"
    }
}

export class warningAlert extends Alert {
    constructor (message) {
        super(message)

        this.type = "warning"
    }
}

export class errorAlert extends Alert {
    constructor (message) {
        super(message)

        this.type = "error"
    }
}