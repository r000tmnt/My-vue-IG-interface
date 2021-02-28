import { createStore } from 'vuex'

export default createStore({
  state: {
    Needed: {
      vm: this,
      IGid: '',
      acToken: '',
    },
    
    basic: {
      bio: "", 
      follower: "", 
      followed: "", 
      medias: "", 
      name: "", 
      profile_pic: "", 
      userName: "", 
      web: ""},

      isProcessing: true,

      media_stories: [],

      media_comments: {
        // id: "", text: "", time: "", userName: "",
      },

      currentLocation: 'post',

      mediaIndex: 9, //defalut number

      fadeIN: false,

      scrollY: ''
      
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

    toStories(state, data){
      state.media_stories = data;
      console.log(state.media_stories)
    },    

    viewStories(state){
      state.currentLocation = 'story';
      console.log(state.currentLocation) 
    },

    showMore(state){
      if(state.basic.medias - state.mediaIndex > 9){//if there's more, only reveal next 9 images
        state.mediaIndex = state.mediaIndex+9;
      }else{
        state.mediaIndex = state.basic.medias;//if there's 9 or less, show the rest.
      }
      state.fadeIN = true;
    },

    toComment(state, sortComment){
      state.media_comments = sortComment;
    }
  },

  actions: {
    toStories(context, data){
      context.dispatch('processStories', data).then((resolve) => {
        console.log(resolve.message);
        resolve.toDo();
        if(context.state.media_stories){
          console.log('stories length: ',Object.keys(context.state.media_stories).length)
          context.commit('viewStories');
          context.state.isProcessing = true;
        }        
      }).catch((reject) => {
        console.log(reject);
      })
    },

    processStories(context, data){
      return new Promise((resolve, reject) => {
        if(!context.state.isProcessing){
          reject('error');
        }else{
          resolve({
            message: 'Proceeding to mutation',
            toDo: function(){
              context.commit('toStories', data);
              console.log('stories length: ',Object.keys(context.state.media_stories).length);
              context.state.isProcessing = false;
            }
          })
        }
      });
    }
  },
  
  modules: {
  }
})
