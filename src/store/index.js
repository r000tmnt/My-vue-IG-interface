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

      media_posts: [],

      media_stories: [],

      media_mentions: [],  

      clickedMedia: {},
      theMediaComment: [],//the comment of the post you clicked 

      currentLocation: 'post',

      mediaIndex: 9, //defalut number

      fadeIN: false,

      scrollY: '',

      isProcessing: true,
      postRefreashed: false,
      getData: {} //a place for new datas before send to parent
  },
  getters:{
    getClickedMedia(state){
      return state.clickedMedia
    }
  },
  mutations: {
    formNeeded(state, Needed){
      state.Needed.IGid = Needed.IGid
      state.Needed.acToken = Needed.acToken
    },

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
      state.postRefreashed = true;
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

    defineScrollY(state, val){
      state.scrollY = val
    },

    clearComment(state){
      state.theMediaComment = [] //Clear out comment, prevent comment duplicated
    },

    convertTime(state, data){//state is needed for the function to work properly, not sure why though...
      var isArray = Array.isArray(data)//Check if it's an array or not
      
      if(data !== undefined){
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
    }
  },

  actions: {
    getLoginStatus(context){
      window.FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
          var acToken = response.authResponse.accessToken;
        }
        
        context.dispatch('getFBdata', acToken);
      });
    },

    getLogin(){
      window.FB.login(function(){
      },{scope: 'public_profile, email, business_management, instagram_basic, instagram_content_publish, instagram_manage_comments'})
    },

    getFBdata(context, acToken){
      var need = {FBid: '', acToken: ''};
      window.FB.api( //need this to get the id
       '/me/accounts',
       {"access_token": acToken},
       function(FBdata) {
           if(FBdata.data !== null){
             need.FBid = FBdata.data[0].id;
             need.acToken = acToken;
           }

           context.dispatch('getIGdata',need);
      });
    },

    getIGdata(context, need){
      window.FB.api(
        need.FBid,
        {"fields" : "instagram_business_account", "access_token": need.acToken},
        function(IGdata){
          var Needed = {IGid: IGdata.instagram_business_account.id, acToken: need.acToken}
          context.commit('formNeeded', Needed)
          context.dispatch('getBasic', Needed);
          context.dispatch('getMedias', Needed);        
        });
    },

    getBasic(context, Needed){
      window.FB.api(
        Needed.IGid,
        {"fields":"biography,followers_count,follows_count,media_count,name,profile_picture_url,username,website", "access_token": Needed.acToken},
          function(basicData){       
          context.commit('toBasic', basicData);
      });
    },

    getMedias(context, Needed){
      window.FB.api(
        Needed.IGid+"/media",
        {"fields":"media_url,caption,like_count,comments_count,timestamp", "access_token": Needed.acToken},
        function(src){
          var pics = new Array();
              
          for(let i=0; i < src.data.length; i++){
            pics.push(src.data[i]);
            context.commit('convertTime', pics);
          }  
          context.commit('toPosts', pics);
        });      
    },

    getStories(context){
      var stories_id = new Array();
      window.FB.api(
        context.state.Needed.IGid,
        {"fields":"stories", "access_token": context.state.Needed.acToken},
          function(sData){
          //get stories id
          if(!sData.stories){ //The api can only retrun stories within 24 hours
            context.commit('viewStories');
          }else{
            var S_id = sData.stories.data;

            if(sData.stories.data){//Make ture there's something
              for(let i=0; i< S_id.length; i++){
                stories_id.push(sData.stories.data[i].id);
              }
              context.dispatch('waitForloop', stories_id)
              .then((resolve) => {
                resolve.toDo();
                if(context.state.isProcessing === false){
                  context.dispatch('toStories', context.state.getData);
                }
                context.state.isProcessing = true;                
              }).catch(()=>{})             
            }                  
          }
      });
    },

    waitForloop(context, stories_id){
      return new Promise((resolve, reject) => {
        if(!context.state.isProcessing){
          reject('error');
        }else{
          resolve({
            message: 'success',
            toDo: function(){
              for(let i=0; i < stories_id.length; i++){ //loop  through each id
                window.FB.api(
                stories_id[i],
                'GET',
                {"fields":"caption,media_url,timestamp", "access_token": context.state.Needed.acToken},
                function(storyData) {
                  context.state.getData[i] = storyData;
                })
              }
              context.state.isProcessing = false;
            }
          })
        }
      })
    },

    toStories(context, data){
      context.dispatch('processStories', data).then((resolve) => {
        resolve.toDo();
        if(context.state.media_stories){
          context.commit('viewStories');
        }        
      })
    },

    processStories(context, data){
      return new Promise((resolve, reject) => {
        if(data === undefined){
          reject('error');
        }else{
          resolve({
            message: 'Proceeding to mutation',
            toDo: function(){
              context.commit('toStories', data);
            }
          })
        }
      });
    },

    getTags(context){
      var mentions = [];
      window.FB.api(
        context.state.Needed.IGid+'/tags',
        'GET',
        {"fields":"id,username,media_url", "access_token": context.state.Needed.acToken},
        function(tagged){
          if(tagged.data){
            for(let i=0; i < tagged.data.length; i++){
              mentions.push(tagged.data[i]);
            }
            if(mentions.length > 0){
              context.state.getData = mentions;
              context.dispatch('toMentions', context.state.getData);
            }                          
          }      
        }
      )
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
              context.dispatch('getComments', data) 
              context.state.isProcessing = false
            }
          })          
        }
      })
    },

    getComments(context, data){ //Use for pin-point the comment
      window.FB.api(
        data.id,//Use the id of the meida you clicked to search comments
        {"fields": "comments{username, text, replies, timestamp}"},
        function(pin_pointComments){           
          if('comments' in pin_pointComments){//Check if comments exsist
            for(let i=0; i< pin_pointComments.comments.data.length; i++){//Loop throught each comment and push into store.state
              context.state.theMediaComment.push(pin_pointComments.comments.data[i])
            }            
          }
        }
      )     
    },

    pushComment(context, Needed){ 
      var current = new Date();
      var theDay = current.toDateString();
      window.FB.api(
        Needed.id+'/comments',
        'POST',
        {"message": ""+ Needed.message +""},
        function(response){
          context.state.theMediaComment.unshift({id: response.id,
                                        username: context.state.basic.userName,
                                        text: Needed.message,
                                        timestamp: theDay})
        }
      )
    },
    
    deleteComment(context, Needed){
      window.FB.api(
        Needed.comment.id,
        'DELETE',
        function(){
          context.state.theMediaComment.splice(Needed.index, 1); 
        }
      )      
    },

  },
  modules: {
  }
})
