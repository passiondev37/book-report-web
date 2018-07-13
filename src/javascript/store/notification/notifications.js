export default {
    namespaced: true,
    state: {
        alerts: []
    },
    mutations: {
        addAlert(state, alertObject) {
            console.log(`[ Vuex ]: adding alert message: ${alertObject.message}`);

            state.alerts.push(alertObject);
        },
        removeLastAlert(state) {
            state.alerts.shift();

            console.log("[ Vuex ]: removing alert, alerts array now is: ", state.alerts);
        }
    },
    actions: {
        showAlert({ commit }, alertObject) {

            commit("addAlert", alertObject);

            setTimeout(() => {
                commit("removeLastAlert")
            }, 2500)
        }
    }
}