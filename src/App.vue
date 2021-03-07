<template>

  <header class="bg_color"> 
    My Vue-IG-Interface
  </header>
  <div id="fb-login">
      <button @click="getLogin">登入FB</button>
    </div>
    <div style="clear: both"></div>
  <basicInfo></basicInfo>
  <display-medias v-if="$store.state.currentLocation === 'post'" :urls="media_urls"></display-medias>
  <displayStories v-if="$store.state.currentLocation === 'story'"></displayStories>
  <displayMention v-if="$store.state.currentLocation === 'mention'" :mentions="media_mentions"></displayMention>

  <footer class="bg_color" :class="{hide_footer: modal_open === true}">&copy; 2021 ParkCorner</footer>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import basicInfo from './components/basicInfo.vue'
import displayMedias from './components/displayMedias.vue'

const displayStories = defineAsyncComponent(()=> import('./components/displayStories.vue'))
const displayMention = defineAsyncComponent(()=> import('./components/displayMention.vue'))

export default {
  name: 'App',
  components: {
    basicInfo, displayMedias, displayStories, displayMention
  },
  data(){
    return{
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

    getMedias(vm, IGid, acToken){
      window.FB.api(
        IGid+"/media",
        {"fields":"media_url,caption,like_count,comments_count,timestamp", "access_token": acToken},
        function(src){
          console.log(src);

          var pics = new Array();
              
          for(let i=0; i < src.data.length; i++){
            pics.push(src.data[i]);
            vm.$store.commit('convertTime', pics);
          }  
          vm.$store.commit('toPosts', pics);
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

.hide_footer{
  position: unset;
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
  position: sticky;
  left: 0;
  bottom: 0;
}
</style>
