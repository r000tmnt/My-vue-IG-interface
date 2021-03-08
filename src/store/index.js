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

    toClickedMedia(state, data){
      state.clickedMedia = data;
      console.log(state.clickedMedia)
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

    searchComments(state, data){ //Use for pin-point the comment
      window.FB.api(
        data.id,//Use the id of the meida you clicked to search comments
        {"fields": "comments{username, text, replies, timestamp}"},
        function(pin_pointComments){ 
          console.log(pin_pointComments);//Return the comment 
          
          // var theTime, whatTime
          if('comments' in pin_pointComments){//Check if comments exsist
            for(let i=0; i< pin_pointComments.comments.data.length; i++){//Loop throught each comment and push into store.state
              state.theMediaComment.push(pin_pointComments.comments.data[i])
              console.log(state.theMediaComment[i]);
            }            
          }else{
            console.log('There are no comments')
          }
          console.log('comment length',state.theMediaComment.length);
        }
      )     
    },

    pushComment(state, Needed){
      console.log(Needed);   
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
          console.log(response)
        }
      )
    },
    
    deleteComment(state, comment, index){
      window.FB.api(
        comment.id,
        'DELETE',
        function(responseDEL){
          console.log(responseDEL);
          state.theMediaComment.splice(index, 1); 
        }
      )      
    },

    clearComment(state){
      state.theMediaComment = [] //Clear out comment, prevent comment duplicated
    },

    convertTime(state, data){
      for(let i=0; i< data.length; i++){//Loop throught each comment
        var theTime = new Date(data[i].timestamp).getTime()
        var whatTime = new Date(theTime).toDateString();//Convert to human readable time
        data[i].timestamp = whatTime; //Assign the value
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
          context.commit('convertTime', context.state.media_stories)
          context.commit('viewStories');
          context.state.isProcessing = true;
        }        
      }).catch((reject) => {
        console.log(reject);
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
          context.commit('convertTime', context.state.media_mentions)
          context.commit('viewMentions');
          context.state.isProcessing = true;
        }        
      }).catch((reject) => {
        console.log(reject);
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
              console.log('mentions length: ',context.state.media_mentions.length);
              context.state.isProcessing = false;
            }
          })
        }
      });
    },
    /*search comments*/ 
    searchComments(context, data){
      context.dispatch('pin_point_Comments', data).then((resolve) => {
        console.log(resolve.message);
        resolve.toDo();
        context.state.isProcessing = true;
      }).catch((reject) => {
        console.log(reject)
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
