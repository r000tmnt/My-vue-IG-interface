<template v-model="urls">
<div class="frame">
  <div id="photos" v-if="urls.length > 0">
      <div class="medias" v-for="n in $store.state.mediaIndex" :class="{fadeIN: $store.state.fadeIN}" :key="n" :style="{ 
        'background-image': 'url(' + urls[n-1].url + ')', 
        'background-size': 'cover',
        'background-position':'center'}" @click="viewing(n)">
        </div>

        <viewPics v-if="isViewing === true" :media="clickedMedia" :mediaComment="theMediaComment"></viewPics>
  </div>
</div>

    <div class="more" v-if="$store.state.basic.medias !== $store.state.mediaIndex">
      <button class="showMore" @click="showMore()">更多</button>
    </div>
</template>

<script>
import viewPics from './viewPics.vue'

export default {
  name: 'displayMedias',
  props: {
      urls: []
  },
  components: {
    viewPics 
  },
  data(){
      return{
        isViewing: false,
        clickedMedia: {},
        theMediaComment: [],
        addClass: false,
        className: 'modal_open'
      }
  },
  methods:{
      viewing(n){
      this.isViewing = true;
      this.$parent.modal_open = true;
      this.clickedMedia = this.urls[n-1] //Push the info of the photo  
      var Clength = this.$store.state.media_comments.length;

      for(let i=0; i < Clength; i++){
        if(this.urls[n-1].id === this.$store.state.media_comments[i].media.id){ //Check if both id matches      

          this.theMediaComment.push(this.$store.state.media_comments[i]) //Push the info of the comment
        }
      }

      console.log(this.urls[n-1].id, this.theMediaComment)                    
      this.$store.state.scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
      this.addClass = false;
      this.defineScrollbar();
    },

    showMore(){
      this.$store.commit('showMore');
      this.$nextTick(()=>{
        window.scrollTo({ //move to the bottom of screen
          top: document.body.scrollHeight,
          behavior: "smooth"});
      })
    },

    defineScrollbar(){
      const body = document.body;

      if(this.addClass === false){
        body.classList.add(this.className);
      }else{
        body.classList.remove(this.className)
      }
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

@media screen and (max-width: 683px) {
 .medias{
   width: 30.5vw;
 } 
}

@media screen and (max-width: 570px) {
 .medias{
   width: 32vw;
   margin: 0!important;
 }

 .showMore{
   width: unset;
 } 
}
</style>
