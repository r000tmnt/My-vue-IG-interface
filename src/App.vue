<template>

  <header class="bg_color"> 
    My Vue-IG-Interface
  </header>
  <div id="fb-login">
      <button @click="getLogin">登入FB</button>
    </div>
    <div style="clear: both"></div>
  <basicInfo @update="updateStories($event)"></basicInfo>
  <display-medias v-if="$store.state.currentLocation === 'post'" :urls="media_urls"></display-medias>
  <displayStories v-if="$store.state.currentLocation === 'story'" :sts="media_stories" v-model="media_stories"></displayStories>
  <displayMention v-if="$store.state.currentLocation === 'mention'" :mentions="media_mentions"></displayMention>

  <footer class="bg_color">&copy; 2021 ParkCorner</footer>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import basicInfo from './components/basicInfo.vue'
import displayMedias from './components/displayMedias.vue'
import displayMention from './components/displayMention.vue'

const displayStories = defineAsyncComponent(()=> import('./components/displayStories.vue'))

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
        
        media_stories: [
          {id: '',caption: '',  media_url: '', timestamp: ''}
        ],

        media_mentions:{},
        modal_open: false,
    }
  },
  methods: {
    getLogin(){
      window.FB.login(function(logInstatus){
        console.log(logInstatus);
      },{scope: 'public_profile, email, business_management, instagram_basic, instagram_content_publish, instagram_manage_comments'})
    },

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
          vm.$store.state.Needed.IGid = IGid;
          vm.getBasic(vm, IGid, acToken);
          vm.getMedias(vm, IGid, acToken);
          vm.getTags(vm, IGid, acToken);          
          vm.getComments(vm, IGid, acToken);
          });
    },

    getBasic(vm, IGid, acToken){
      window.FB.api(
        IGid,
        {"fields":"biography,followers_count,follows_count,media_count,name,profile_picture_url,username,website", "access_token": acToken},
          function(basicData){
          console.log(basicData);
        
          vm.$store.commit('toBasic', basicData);
      });
    },

    updateStories(val){
      this.media_stories = val;
      console.log(val);
      if(this.media_stories === val){
        console.log(this.media_stories);
        this.$nextTick(()=>{
          this.viewStories();
        })
      }
    },

    viewStories(){
      this.$store.state.currentLocation = 'story';
      console.log(this.$store.state.currentLocation) 
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

          vm.$store.commit('toComment', sortComment);
        }
      )
    },

    convetTime(timeCode){ //Convert to human readable time
      var theTime = new Date(timeCode).getTime();
      var whatTime = new Date(theTime).toDateString();
      return whatTime;
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
         vm.$store.state.Needed.acToken = acToken;
         
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
  background-color: rgb(20, 20, 20);
}

.bg_color{
  background-color: #383434;
  color: white;
}

.modal_open{
  overflow: hidden;
}

header{
  text-align: center;
}

#fb-login{
  display: block;
  float: right;
  margin: -19px 0.3% 0.3% 0.3%;
}

#fb-login > button{
  background-color: #4267B2;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

footer{
  text-align: center;
  padding: 1%;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
