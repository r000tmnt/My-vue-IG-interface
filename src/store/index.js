import { createStore } from 'vuex'

export default createStore({
  state: {
    Needed: {
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

      addClass: false,
      className: 'modal_open',

      isProcessing: true,

      media_posts: [],

      media_stories: [],

      media_mentions: [],     

      media_comments: [],
      theMediaComment: [],//the comment of the post you clicked 

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

    toPosts(state, data){
      state.media_posts = data;
      console.log(state.media_posts);
    },

    toStories(state, data){
      state.media_stories = data;
      console.log(state.media_stories)
    },
    
    toMentions(state, data){
      state.media_mentions = data;
      console.log(state.media_mentions)
    },

    toComment(state, data){
      state.media_comments = data;
      console.log(state.media_comments)      
    },

    // getComments(state){
    //   var vm = this;
    //   var cArray = new Array();
    //   var sortComment = new Array();
    //   var multiComment = new Array();
    //   var oneComment = new Array();      
    //   window.FB.api(
    //     state.Needed.IGid+'/media',
    //     {"fields":"comments{id,username,media,text,timestamp,replies}",  "access_token": state.Needed.acToken},
    //     function(cData){
    //       console.log(cData);

    //       for(let i=0; i < cData.data.length; i++){
    //         if(cData.data[i].comments){
    //           cArray.push(cData.data[i].comments);
    //         }
    //       }
    //       console.log(cArray)

    //       for(let i=0; i < cArray.length; i++){//filter out the media with multiple comments
    //           if(cArray[i].data.length > 1){
    //             multiComment.push(cArray[i].data);
    //             console.log(multiComment)
    //           }else{
    //             oneComment.push(cArray[i].data[i-i]);
    //             console.log(oneComment)
    //           }
    //       }

    //       for(let i=0; i < multiComment.length; i++){ //loop into each array
    //         for(let j=0; j < multiComment[i].length; j++){
    //           sortComment.push(multiComment[i][j]);
    //         }
    //       }
          
    //       for(let i=0; i < oneComment.length; i++){
    //         sortComment.push(oneComment[i]);
    //       }
    //       console.log(sortComment);
    //       vm.state.media_comments = sortComment;
    //     }
    //   )       
    // },

    convertTime(timeCode){ //Convert to human readable time
      var theTime = new Date(timeCode).getTime();
      var whatTime = new Date(theTime).toDateString();
      return whatTime;
    },

    sortComments(state, data){ //Use for pin-point the comment
      var Clength = state.media_comments.length;

      for(let i=0; i < Clength; i++){
        if(data.id === state.media_comments[i].media.id){ //Check if both id matches      

          this.theMediaComment.push(state.media_comments[i]) //Push the info of the comment
        }
      }      
    },

    viewStories(state){
      state.currentLocation = 'story';
      console.log(state.currentLocation) 
    },
    
    viewMentions(state){
      state.currentLocation = 'mention';
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

    defineScrollbar(state){
      const body = document.body;

      if(state.addClass === false){
        body.classList.add(state.className);
      }else{
        body.classList.remove(state.className)
      }
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
    },

    toMentions(context, data){
      context.dispatch('processMentions', data).then((resolve) => {
        console.log(resolve.message);
        resolve.toDo();
        if(Object.keys(context.state.media_mentions).length > 0){
          console.log('mentions length: ',Object.keys(context.state.media_mentions).length)
          context.commit('viewMentions');
          context.state.isProcessing = true;
        }        
      }).catch((reject) => {
        console.log(reject);
      })
    },

    processMentions(context, data){
      return new Promise((resolve, reject) => {
        if(!context.state.isProcessing){
          reject('error');
        }else{
          resolve({
            message: 'Proceeding to mutation',
            toDo: function(){
              context.commit('toMentions', data);
              console.log('mentions length: ',Object.keys(context.state.media_mentions).length);
              context.state.isProcessing = false;
            }
          })
        }
      });
    },
    
    toComment(context){
      context.dispatch('staticLoad_comments').then((resolve) => {
        console.log(resolve.message);
        resolve.toDo();
        if(Object.keys(context.state.media_mentions).length > 0){
          var sortComment = context.state.media_comments;
          for(let i=0; i < sortComment.length; i++){
            var timeCode = sortComment[i].timestamp;
            sortComment[i].timestamp = context.commit('convertTime',timeCode);
            context.state.isProcessing = true;
          }          
        }
      }).catch((reject) => {
        console.log(reject);
      })      
    },

    staticLoad_comments(context, data){
      return new Promise((resolve, reject) => {
        if(!context.state.isProcessing){
          reject('error')
        }else{
          resolve({
            message: 'Proceeding to mutation',
            toDo: function(){
              context.commit('toComment', data);
              console.log('comments length: ',Object.keys(context.state.media_comments).length);
              context.state.isProcessing = false;
            }
          })          
        }
      })      
    },

    // getComments(context){
    //   context.dispatch('processComments').then((resolve) => {
    //     console.log(resolve.message);
    //     resolve.toDo()
    //     if(Object.keys(context.state.media_mentions).length > 0){
    //       var sortComment = context.state.media_comments;
    //       for(let i=0; i < sortComment.length; i++){
    //         var timeCode = sortComment[i].timestamp;
    //         sortComment[i].timestamp = context.commit('convertTime',timeCode);
    //         context.state.isProcessing = true;
    //       }          
    //     }
    //   }).catch((reject) => {
    //     console.log(reject)
    //   })
    // },

    // processComments(context, data){
    //   return new Promise((resolve, reject) => {
    //     if(!context.state.isProcessing){
    //       reject('error')
    //     }else{
    //       resolve({
    //         message: 'Proceeding to mutation',
    //         toDo: function(){
    //           context.commit('getComments', data) 
    //           console.log('comments length: ',Object.keys(context.state.media_comments).length);
    //           context.state.isProcessing = false;
    //         }
    //       })          
    //     }
    //   })
    // }
  },
  
  modules: {
  }
})
