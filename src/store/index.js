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

      isProcessing: true,

      media_posts: [],

      media_stories: [],

      media_mentions: [],  

      clickedMedia: {},
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
    },

    toStories(state, data){
      state.media_stories = data;
    },
    
    toMentions(state, data){
      state.media_mentions = data;
    },

    toClickedMedia(state, data){
      state.clickedMedia = data;
    },

    viewStories(state){
      state.currentLocation = 'story';
    },
    
    viewMentions(state){
      state.currentLocation = 'mention';
    },
    
    refreash_Posts(state){
      state.fadeIN = false;
      state.currentLocation = 'post';
      state.mediaIndex = 9; //Reset images    
    },

    showMore(state){
      if(state.basic.medias - state.mediaIndex > 9){//if there's more, only reveal next 9 images
        state.mediaIndex = state.mediaIndex+9;
      }else{
        state.mediaIndex = state.basic.medias;//if there's 9 or less, show the rest.
      }
      state.fadeIN = true;
    },

    searchComments(state, data){ //Use for pin-point the comment
      window.FB.api(
        data.id,//Use the id of the meida you clicked to search comments
        {"fields": "comments{username, text, replies, timestamp}"},
        function(pin_pointComments){           
          if('comments' in pin_pointComments){//Check if comments exsist
            for(let i=0; i< pin_pointComments.comments.data.length; i++){//Loop throught each comment and push into store.state
              state.theMediaComment.push(pin_pointComments.comments.data[i])
            }            
          }
        }
      )     
    },

    pushComment(state, Needed){ 
      var current = new Date();
      var theDay = current.toDateString();
      window.FB.api(
        Needed.id+'/comments',
        'POST',
        {"message": ""+ Needed.message +""},
        function(response){
          state.theMediaComment.unshift({id: response.id,
                                        username: state.basic.userName,
                                        text: Needed.message,
                                        timestamp: theDay})
        }
      )
    },
    
    deleteComment(state, comment, index){
      window.FB.api(
        comment.id,
        'DELETE',
        function(){
          state.theMediaComment.splice(index, 1); 
        }
      )      
    },

    clearComment(state){
      state.theMediaComment = [] //Clear out comment, prevent comment duplicated
    },

    convertTime(state, data){//state is needed for the function to work properly, not sure why though...
      var isArray = Array.isArray(data)//Check if it's an array or not

      if(isArray === true){
        for(let i=0; i< data.length; i++){//Loop throught each comment as array
          var theTime = new Date(data[i].timestamp).getTime()
          var whatTime = new Date(theTime).toDateString();//Convert to human readable time
          data[i].timestamp = whatTime; //Assign the value
        }        
      }else{
        for(let i=0; i< Object.keys(data).length; i++){//Loop throught each comment as object
          theTime = new Date(data[i].timestamp).getTime()
          whatTime = new Date(theTime).toDateString();
          data[i].timestamp = whatTime; 
        }        
      }
    }
  },

  actions: {
    toStories(context, data){
      context.dispatch('processStories', data).then((resolve) => {
        resolve.toDo();
        if(context.state.media_stories){
          context.commit('viewStories');
          context.state.isProcessing = true;
        }        
      }).catch(() => {
        context.state.isProcessing = true;
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
              context.state.isProcessing = false;
            }
          })
        }
      });
    },

    toMentions(context, data){
      context.dispatch('processMentions', data).then((resolve) => {
        resolve.toDo();
        if(Object.keys(context.state.media_mentions).length > 0){
          context.commit('convertTime', context.state.media_mentions)
          context.commit('viewMentions');
          context.state.isProcessing = true;
        }        
      }).catch(() => {
        context.state.isProcessing = true;
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
              context.state.isProcessing = false;
            }
          })
        }
      });
    },
    /*search comments*/ 
    searchComments(context, data){
      context.dispatch('pin_point_Comments', data).then((resolve) => {
        resolve.toDo();
        context.state.isProcessing = true;
      }).catch(() => {
        context.state.isProcessing = true;
      })
    },

    pin_point_Comments(context, data){
      return new Promise((resolve, reject) => {
        if(!context.state.isProcessing){
          reject('pin-point failed')
        }else{
          resolve({
            message: 'Processing...',
            toDo: function(){
              context.commit('searchComments', data) 
              context.state.isProcessing = false
            }
          })          
        }
      })
    },

  },
  modules: {
  }
})
