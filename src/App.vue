<template>

  <header> My Vue-IG-Interface</header>
  <basicInfo></basicInfo>
  <display-medias v-if="viewStory === false" :urls="media_urls"></display-medias>
  <displayStories v-if="viewStory === true"></displayStories>

</template>

<script>

import basicInfo from './components/basicInfo.vue'
import displayMedias from './components/displayMedias.vue'
import displayStories from './components/displayStories.vue'

export default {
  name: 'App',
  components: {
    basicInfo, displayMedias, displayStories
  },
  data(){
    return{
        media_urls: {
          // id: "", url: "", caption: "", commonts: "", time: ""
        },
        
        media_stories: {
          // id: "", url: "", caption: "", time: ""
        },

        viewStory: false
    }
  },
  methods: {
    getFBdata(vm, acToken){
       window.FB.api( //need this to get the id
        '/me/accounts',
        {"access_token": acToken},
        function(FBdata) {
            console.log(FBdata)

            var FBid = FBdata.data[0].id;
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

    getMedias(vm, IGid, acToken){
      window.FB.api(
        IGid+"/media",
        {"fields":"media_url,caption,like_count,comments_count,timestamp,comments{id,username,media,text,timestamp,replies}", "access_token": acToken},
        function(src){
          console.log(src);

          var pics = new Array();
          var c_ids = new Array();
          
          for(let i=0; i < src.data.length; i++){
            pics.push(
              {id: src.data[i].id,
                likes: src.data[i].like_count, 
                url: src.data[i].media_url,
                caption: src.data[i].caption,
                comments: src.data[i].comments_count,
                time: src.data[i].timestamp});

                if(src.data[i].comments != null){ //Check if commemts exist
                  c_ids.push(src.data[i].comments.data[i-i]);
                }
          }
            vm.media_urls = pics;
            vm.getComments(vm, c_ids);
            vm.hideImages(vm);
            console.log(c_ids)
        });
    },

    getComments(vm, c_ids){
      var cArray = new Array();
      for(let i=0; i < c_ids.length; i++){
        cArray.push({id: c_ids[i].media.id,
                     text: c_ids[i].text,
                     time: c_ids[i].timestamp,
                     userName: c_ids[i].username
                    });                                                
      }
      vm.$store.state.media_comments = cArray;
      console.log(cArray)
    },
 
    hideImages(vm){
      vm.$nextTick( ()=>{
        var images = document.querySelectorAll(".medias");
        
        for(let i=0; i < images.length; i++){
          if(i > 8){
            images[i].style['display'] = 'none';
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
         var acToken = response.authResponse.accessToken;

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
