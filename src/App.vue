<template>

  <header> My Vue-IG-Interface</header>
  <basicInfo></basicInfo>
  <display-medias v-if="currentLocation === 'post'" :urls="media_urls"></display-medias>
  <displayStories v-if="currentLocation === 'story'" :sts="media_stories"></displayStories>
  <displayMention v-if="currentLocation === 'mention'" :mentions="media_mentions"></displayMention>

</template>

<script>

import basicInfo from './components/basicInfo.vue'
import displayMedias from './components/displayMedias.vue'
import displayStories from './components/displayStories.vue'
import displayMention from './components/displayMention'

export default {
  name: 'App',
  components: {
    basicInfo, displayMedias, displayStories, displayMention
  },
  data(){
    return{
        media_urls: {
          // id: "", url: "", caption: "", commonts: "", time: ""
        },
        
        media_stories: {
          // id: "", url: "", caption: "", time: ""
        },

        media_mentions:{},

        currentLocation: 'post'
    }
  },
  methods: {
    getFBdata(vm, acToken){
      var FBid;
       window.FB.api( //need this to get the id
        '/me/accounts',
        {"access_token": acToken},
        function(FBdata) {
            console.log(FBdata)
            if(FBdata.data !== null){
              FBid = FBdata.data[0].id;
            }

            vm.getIGdata(vm, FBid, acToken);
            });
    },

    getIGdata(vm, FBid, acToken){
      window.FB.api(
        FBid,
        {"fields" : "instagram_business_account", "access_token": acToken},
        function(IGdata){
          console.log(IGdata);

          var IGid = IGdata.instagram_business_account.id;
          vm.getBasic(vm, IGid, acToken);
          });
    },

    getBasic(vm, IGid, acToken){
      window.FB.api(
        IGid,
        {"fields":"biography,followers_count,follows_count,media_count,name,profile_picture_url,username,website,stories", "access_token": acToken},
          function(basicData){
          console.log(basicData);
        
          vm.$store.state.basic.bio = basicData.biography;
          vm.$store.state.basic.follower = basicData.followers_count; 
          vm.$store.state.basic.followed = basicData.follows_count;
          vm.$store.state.basic.medias = basicData.media_count;
          vm.$store.state.basic.name = basicData.name;
          vm.$store.state.basic.profile_pic = basicData.profile_picture_url;
          vm.$store.state.basic.userName = basicData.username;
          vm.$store.state.basic.web = basicData.website;

          //get stories id
          
          if(!basicData.stories){ //The api can only retrun stories within 24 hours
            var emptyMessage = "No stories in 24 hours.";
            console.log(emptyMessage)
          }else{
            var S_id = basicData.stories.data;
            var stories_id = new Array();
            var stories = new Array();

            console.log(basicData.stories.data);
            for(let i=0; i< S_id.length; i++){
              stories_id.push(basicData.stories.data[i].id);
               vm.getStories(vm, stories, stories_id, acToken);
            }
          }
          vm.getMedias(vm, IGid, acToken);
          vm.getTags(vm, IGid, acToken);
      });
    },

    getStories(vm, stories, stories_id, acToken){
      for(let i=0; i < stories_id.length; i++){ //loop through each id
        window.FB.api(
          stories_id[i],
          'GET',
          {"fields":"caption,media_url,timestamp", "access_token": acToken},
          function(storyData) {
              console.log(storyData);

              stories.push({id: storyData.id,
                            caption: storyData.caption,
                            url: storyData.media_url,
                            time: storyData.timestamp}) 
          }
        );
      }
      console.log(stories);
      vm.media_stories = stories;
    },

    getTags(vm, IGid, acToken){
      var mentioned = new Array();
      window.FB.api(
        IGid+'/tags',
        'GET',
        {"fields":"id,username,media_url", "access_token": acToken},
        function(tagged){
          console.log(tagged.data);
          for(let i=0; i < tagged.data.length; i++){
            mentioned.push({id: tagged.data[i].id,
                            username: tagged.data[i].username,
                            url: tagged.data[i].media_url});
          }
        }
      )
      vm.media_mentions = mentioned;
      console.log(mentioned)
    },

    getMedias(vm, IGid, acToken){
      window.FB.api(
        IGid+"/media",
        {"fields":"media_url,caption,like_count,comments_count,timestamp", "access_token": acToken},
        function(src){
          console.log(src);

          var pics = new Array();
         
          
          for(let i=0; i < src.data.length; i++){
            pics.push(
              {id: src.data[i].id,
                likes: src.data[i].like_count, 
                url: src.data[i].media_url,
                caption: src.data[i].caption,
                comments: src.data[i].comments_count,
                time: src.data[i].timestamp});
          }
            vm.media_urls = pics;
            vm.getComments(vm, IGid, acToken);
            vm.hideImages(vm);
        });
    },

    getComments(vm, IGid, acToken){
      var cArray = new Array();
      var sortComment = new Array();
      var multiComment = new Array();
      var oneComment = new Array();
      window.FB.api(
        IGid+'/media',
        {"fields":"comments{id,username,media,text,timestamp,replies}",  "access_token": acToken},
        function(cData){
          console.log(cData);

          for(let i=0; i < cData.data.length; i++){
            if(cData.data[i].comments){
              cArray.push(cData.data[i].comments);
            }
          }
          console.log(cArray)

          for(let i=0; i < cArray.length; i++){//filter out the media with multiple comments
              if(cArray[i].data.length > 1){
                multiComment.push(cArray[i].data);
                console.log(multiComment)
              }else{
                oneComment.push(cArray[i].data[i-i]);
                console.log(oneComment)
              }
          }

          for(let i=0; i < multiComment.length; i++){ //loop into each array
            for(let j=0; j < multiComment[i].length; j++){
              sortComment.push(multiComment[i][j]);
            }
          }
          
          for(let i=0; i < oneComment.length; i++){
            sortComment.push(oneComment[i]);
          }
          console.log(sortComment);
          
          for(let i=0; i < sortComment.length; i++){
            var timeCode = sortComment[i].timestamp;
            sortComment[i].timestamp = vm.convetTime(timeCode);
          }

          vm.$store.state.media_comments = sortComment;
        }
      )
    },

    convetTime(timeCode){ //Convert to human readable time
      var theTime = new Date(timeCode).getTime();
      var whatTime = new Date(theTime).toDateString();
      return whatTime;
    },
 
    hideImages(vm){
      vm.$nextTick( ()=>{
        var images = document.querySelectorAll(".medias");
        
        for(let i=0; i < images.length; i++){
          if(i > 8){
            images[i].style['display'] = 'none';
            images[i].style['opacity'] = 0;
          }
        }
      });
    },

    scroll(){
      window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      });
    }
    
  },
  created(){
    var vm = this;
    var acToken
    vm.scroll();
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '5243352622349206',
        cookie     : true,
        xfbml      : true,
        version    : 'v9.0'
      });
      
       window.FB.getLoginStatus(function(response){
         console.log(response);
        
         if(response.status === 'connected'){
            acToken = response.authResponse.accessToken;
         }
         
         vm.getFBdata(vm, acToken);
       });
    };

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
  font-family: 'Courier New', Courier, monospace;
}

body.modal-open{
  overflow: hidden;
}

header{
  text-align: center;
}
</style>
