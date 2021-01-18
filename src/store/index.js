import { createStore } from 'vuex'

export default createStore({
  state: {
    basic: {
      bio: "", 
      follower: "", 
      followed: "", 
      medias: "", 
      name: "", 
      profile_pic: "", 
      userName: "", 
      web: ""},

      media_comments: {
        // id: "", text: "", time: "", userName: "",
      }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
