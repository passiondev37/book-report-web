import User from "../../models/user"

export class localStorageSerializer {

    static loadDataInModel(model) {

        const localSavedData = localStorage.getItem(model.localStorageKey)
        if (localSavedData) {
            console.log("[ LocalStorage ]: OK, loading from localStorage: ", localSavedData)

            const storedObject = JSON.parse(localSavedData);

            Object.assign(model, storedObject) // extend Model by saved data in Local Storage
        }

        console.log("[ LocalStorage ]: return model: ", model)
        return model // return Model Instance
    }


    static saveModelLocal(model) {
        const nativeObjectModel = Object.assign( {}, model )

        localStorage.setItem(
            model.localStorageKey,
            JSON.stringify( nativeObjectModel ) // move data into new Object by running Vuejs Getters
        )
        console.log("[ LocalStorage ]: saving model: ", nativeObjectModel)

        return model // return model Instance
    }

    static removeModelLocal(model) {

        localStorage.removeItem(model.localStorageKey)
        console.log(`[ LocalStorage ]: removing data by key ${model.localStorageKey}`)

        return model // return model Instance
    }
}

export default class localStorageService {

    static getUser() {
        return localStorageSerializer.loadDataInModel(new User())
    }

    static setUser(userModel) {
        localStorageSerializer.saveModelLocal(userModel)

        return userModel
    }

    static setGuest(userModel, shouldRemove = false) {
        // save only username for login form field populate
        const guestUser = new User({ username: userModel.username })

        return shouldRemove ?
            localStorageSerializer.removeModelLocal(guestUser) :
            localStorageSerializer.saveModelLocal(guestUser)
    }

    static clearLocalStorage () {
        localStorage.clear()
        console.log("[ LocalStorage ]: is clear")
    }
}