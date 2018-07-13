import store from "../../store"

const vuexRoot = { root: true }

export default class baseService {
    // commit root mutations in namespaced module
    static commit(typeString, value) {
        store.commit(typeString, value, vuexRoot);
    }
    // dispatch root actions in namespaced module
    static dispatch(typeString, value) {
        store.dispatch(typeString, value, vuexRoot);
    }

    static get headers() {
        return {
            "Accept": "application/json, text/plain, */*",
            "Content-type": "application/json;charset=utf-8",
            "Authorization": `Basic ${store.state.userProfile.user.token}`
        }
    }

    static ajax(url, method, object) {
        return fetch(url, {
            method: method,
            headers: this.headers,
            body: object ? JSON.stringify( object ) : null
        })

    }

    static get(url, object) {
        return this.ajax(url, "get", object)
    }

    static post(url, object) {
        return this.ajax(url, "post", object)
    }

    static put(url, object) {
        return this.ajax(url, "put", object)
    }

    static delete(url, object) {
        return this.ajax(url, "delete", object)
    }
}