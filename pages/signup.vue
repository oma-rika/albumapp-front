<template>
    <form action="/" method="post">
        <div>
            <label>名前</label>
            <input type="text" name="name" placeholder="名前" />
        </div>
        <div>
            <label>パスワード</label>
            <input type="password" name="possword" />
        </div>
        <div>
            <input type="submit" value="Sign up">
        </div>
    </form>
</template>

export default Vue.extend({
  data() {
    return {
      firstname: 'foo',
    }
  },
  mounted() {
    axios.get('/server/api')
      .then(response => this.posts = response.data)
    console.log("7777" + "[" + this.posts + "]");
  },
  methods: {

  }
})
</script>

