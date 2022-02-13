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
                user: {
                    current: null
                },
                auth: {
                    token: null,
                    expires: 0,
                    payload: {}
                },
                project: {
                    current: null,
                    list: [
                        {id: 1, name: 'MyProject01', updateAt: '2020-04-01T12:00:00+09:00'},
                        {id: 2, name: 'MyProject02', updateAt: '2020-04-01T12:00:00+09:00'},
                        {id: 3, name: 'MyProject03', updateAt: '2020-04-01T12:00:00+09:00'},
                    ]
                },
				sessionUserId: null
            }
        },
        getters: {
            getCurrentUserId: (state, getters) => {
                if (state.user.current) {
                    return state.user.current.ID;
                } else {
                    console.log('ユーザーは存在しない');
                }
            },
            getAuthToken: (state, getters) => {
                if (state.auth.token) {
                    return state.auth.token;
                } else {
                    console.log('tokenが取得できません');
                }
            }
        },
        // mutations: {
        //     updateMessage: function(state) {
        //         state.message = 'Updated!'
        //     }
        // },
        mutations: {
            updateMessage: (state, payload) => {
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
            login(state) {
                state.loggedIn = true;
                console.log('state.loggedIn', state.loggedIn);
            },
            logout(state) {
                console.log('logoutに遷移');
                state.loggedIn = false;
                state.userId = 0;
                //初期化する
                state.user = {
                    current: null
                };
                state.auth = {
                    token: null,
                    expires: 0,
                    payload: { },
                };
            },
            //20210107追加
            setCurrentUser (state, payload) {
                state.user.current = payload;
                console.log('state.user.current', state.user.current.Account);
            },
            setAuthToken (state, payload) {
                console.log('tokenを保存');
                state.auth.token = payload.Token;
                console.log('token:', state.auth.token);
            },
            setAuthExpires (state, payload) {
                state.auth.expires = payload;
            },
            setAuthPayload (state, payload) {
                state.auth.payload = payload;
            },
            setCurrentProject (state, payload) {
                state.project.current = payload;
            },
            setAuthSession (state, payload) {
                console.log('sessionを保存');
                state.sessionUserId = payload;

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
                //context.commit('updateMessage', payload);
                context.commit('setCurrentUser', payload);
                context.commit('setAuthToken', payload);
                context.commit('login');
            },
            //20210105追加
            //{ state, getters, commit, dispatch, rootState, rootGetters }
            // rootState => ルート(store/index.js)のstateを取得(rootState = state)
            //
            //20210107追加
            getCurrentUser ({ commit }, user) {
                commit('setCurrentUser', user);
            },
            getAuthToken ({ commit }, token) {
                commit('setAuthToken', token);
            },
            getAuthExpires ({ commit }, expires) {
                expires = expires || 0;
                commit('setAuthExpires', expires);
            },
            getAuthPayload ({ commit }, jwtPayload) {
                jwtPayload = jwtPayload || {}
                commit('setAuthPayload', jwtPayload)
            },
            getLogout (context) {
                console.log('getLogoutに遷移');
                context.commit('logout');
            },
            getLogin (context) {
                console.log('getLoginに遷移');
                context.commit('login');
            }
            // nextServerInit({commit}, { req }) {
            //     if (req.session && req.session.userId) {
            //         commit('setAuthSession', req.session.userId);
            //     }
            // }

        },
        plugins: [createPersistedState({storage: window.sessionStorage})]
    })
}




export default createStore
