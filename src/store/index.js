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
    toBasic(state, basicData){
        state.basic.bio = basicData.biography;
        state.basic.follower = basicData.followers_count; 
        state.basic.followed = basicData.follows_count;
        state.basic.medias = basicData.media_count;
        state.basic.name = basicData.name;
        state.basic.profile_pic = basicData.profile_picture_url;
        state.basic.userName = basicData.username;
        state.basic.web = basicData.website;
    },

    toComment(state, sortComment){
      state.media_comments = sortComment;
    }
  },
  actions: {
  },
  modules: {
  }
})
