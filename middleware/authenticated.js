export default async ({ store, redirect }) => {
    // ユーザーが認証されていない場合
    if (!store.state.loggedIn) {
         return await redirect('/signin');
    }
}
