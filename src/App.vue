<template>

  <header class="bg_color"> 
    My Vue-IG-Interface
  </header>
  <div id="fb-login">
      <button @click="getLogin">登入FB</button>
    </div>
    <div style="clear: both"></div>
  <basicInfo></basicInfo>
  <display-medias v-if="currentLocation === 'post'"></display-medias>
  <displayStories v-if="currentLocation === 'story'"></displayStories>
  <displayMention v-if="currentLocation === 'mention'"></displayMention>

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
  computed:{
    currentLocation(){
      return this.$store.state.currentLocation
    }
  },
  data(){
    return{
        modal_open: false,
    }
  },
  methods: {
    getLogin(){
      this.$store.dispatch('getLogin')
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
      
      vm.$store.dispatch('getLoginStatus')
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
  width: unset;
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
  width: 100vw;
}
</style>
