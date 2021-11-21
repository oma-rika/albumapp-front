import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

const createStore = () => {
    return new Vuex.Store({
        state: function() {
            return {
                message: 'Hello Vuex!',
                userId: 0,
                token: '',
                loggedIn: false,
            }
        },
        // mutations: {
        //     updateMessage: function(state) {
        //         state.message = 'Updated!'
        //     }
        // },
        mutations: {
            updateMessage: function(state, payload) {
                console.log('updateMessageに遷移!!')
                state.token = payload[0].token;
                state.userId = payload[1].id;
                console.log('state.token:', state.token);
                console.log('state.userId:', state.userId);
                if (state.token != null || state.token != '') {
                    state.loggedIn = true;
                    console.log('state.loggedIn:', state.loggedIn);
                }

            },
            logout(state) {
               state.token = '';
               state.loggedIn = false;
               state.userId = 0;
            }
        },
        // actions: {
        //     updateMessageAction(context) {
        //         context.commit('updateMessage', 'Commit with payload')
        //     }
        // }
        actions: {
            updateMessageAction(context, payload) {
                console.log('updateMessageActionに遷移!!')
                //console.log('payload:', payload);
                context.commit('updateMessage', payload);
            }
        },
        plugins: [createPersistedState({storage: window.sessionStorage})]
    })
}




export default createStore
