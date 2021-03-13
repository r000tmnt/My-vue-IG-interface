<template v-model="media_posts">
<div class="frame">
  <div id="photos" v-if="media_posts.length > 0">
      <div class="medias" v-for="n in mediaIndex" :class="{fadeIN: fadeIN}" :key="n" :style="{ 
        'background-image': 'url(' + media_posts[n-1].media_url + ')', 
        'background-size': 'cover',
        'background-position':'center'}" @click="viewing(n)">
        </div>

        <viewPics v-if="isViewing === true"  @close="closeModal($event)" @changePic="clickedMedia_change($event)"></viewPics>
  </div>
</div>

    <div class="more" v-if="basic.medias !== mediaIndex">
      <button class="showMore" @click="showMore()">更多</button>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const viewPics = defineAsyncComponent(()=> import('./viewPics.vue'))

export default {
  name: 'displayMedias',
  components: {
    viewPics 
  },
  data(){
      return{
        isViewing: false,
        addClass: false,
        className: 'modal_open',        
        clickedMedia: {},
      }
  },
  computed:{
    media_posts(){
      return this.$store.state.media_posts
    },
    mediaIndex(){
      return this.$store.state.mediaIndex
    },
    fadeIN(){
      return this.$store.state.fadeIN
    },
    basic(){
      return this.$store.state.basic
    },
    Needed(){
      return this.$store.state.Needed
    },
    postRefreashed(){
      return this.$store.state.postRefreashed
    }
  },
  methods:{
      viewing(n){
        this.clickedMedia = this.media_posts[n-1] //Push the info of the photo       
        this.getComments(this.clickedMedia).then((resolve) => {
          resolve.toDo();
          this.$store.commit('defineScrollY', document.documentElement.style.getPropertyValue('--scroll-y'))      
        }).then(()=>{
          if(this.isViewing === true && this.clickedMedia !== undefined){          
            this.$parent.modal_open = true; 
            this.addClass = false;
            this.defineScrollbar();            
          }
        })
        .catch(() => {})                  
    },

    getComments(clickedMedia){
      var vm = this;
      return new Promise((resolve, reject) => {
        if(vm.isViewing === true){
          reject('error')
        }else{
          resolve({
            message: 'Make an api call',
            toDo: function(){
              vm.$store.commit('toClickedMedia', clickedMedia); 
              vm.$store.dispatch('searchComments', clickedMedia);
              vm.isViewing = true;
            }
          })
        }
      })
    },

    showMore(){
      this.$store.commit('showMore');
      this.$nextTick(()=>{
        window.scrollTo({ //move to the bottom of screen
          top: document.body.scrollHeight,
          behavior: "smooth"});
      })
    },

    closeModal(val){
      this.waitForRefreash().then(()=>{
        this.$parent.modal_open = false;
        this.isViewing = val.isViewing;
        this.addClass = val.addClass;
        this.defineScrollbar();
      })
    },

    defineScrollbar(){
      const body = document.body;

      if(this.addClass === false){
        body.classList.add(this.className);
      }else{
        body.classList.remove(this.className)
      }
    },
    
    clickedMedia_change(index){
      this.waitForRefreash().then((resolve) => {
        resolve.toDo()
        if(this.postRefreashed === true){
          this.clickedMedia = this.media_posts[index];
          this.$store.commit('toClickedMedia', this.clickedMedia);
          this.$store.dispatch('searchComments', this.clickedMedia); 
        }
      })
    },

    waitForRefreash(){
      var vm = this;
      var Needed = {IGid: vm.Needed.IGid, acToken: vm.Needed.acToken}
      return new Promise((resolve, reject) => {
        if(!vm.postRefreashed){
          reject('can not update')
        }else{
          resolve({
            message: 'proceed to api call',
            toDo: function(){
              vm.$store.dispatch('getMedias', Needed)
            }
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes fadeIN{
  from{ opacity: 0; }
  to{ opacity: 1; }
}

.fadeIN{
  animation: fadeIN 2s ease-in-out forwards !important;
}

#photos{
  display: flex;
  flex-wrap: wrap;
  flex: 3;
  width: 920px;
  margin: 0 auto;
  transition: .5s ease-in-out;
  padding: 1%;
}

.medias{
  border: 1px solid #232;
  width: 295px;
  height: 295px;
  cursor: pointer;
  margin: 0.5%;
  transition: 0s ease-in-out;
  opacity: 0.9;
}

.medias::after{
  content: "";
  display: block;
  padding-bottom: 100%;
}

.medias:hover{
  opacity: 1;
  transition: 0.5s;
}

.more{
  padding: 0.5vh 0 0.5% 0.5%;
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
}

.showMore{
  border: 1px solid rgba(34, 51, 34, 0.5);
  border-radius: 10px;
  width: 10vw;
  height: 5v;
  font-size: 1.2rem;
  cursor: pointer;
}

.showMore:hover{
  background-color: rgba(34, 51, 34, 0.75);
  color: white;
  transition: 0.5s;
}

@media screen and (max-width: 1415px) {
 .counts{
   width: 25vw;
 } 
}

@media screen and (max-width: 955px) {
 #photos{
   width: 99%;
   padding-right: 0!important;
 }

 .medias{
   width: 31vw;
   height: unset;
 } 
}

@media screen and (max-width: 734px) {
 .medias{
   width: 30.5vw;
 } 
}

@media screen and (max-width: 570px) {
 .medias{
   width: 31.5vw;
   margin: 0!important;
 }

 .showMore{
   width: unset;
 } 
}
</style>
