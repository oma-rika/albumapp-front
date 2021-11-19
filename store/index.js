import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: function() {
            return {
                message: 'Hello Vuex!',
                userId: '',
                token: '',
            }
        },
        // mutations: {
        //     updateMessage: function(state) {
        //         state.message = 'Updated!'
        //     }
        // },
        mutations: {
            updateMessage: function(state, payload) {
                //state.message = payload
                state.userId = payload.userId;
                //state.token = payload.token;

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
                console.log('payload:', payload);
                context.commit('updateMessage', payload);
            }
        }
    })
}




export default createStore
