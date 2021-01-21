<template>
<div class="frame">
  <div id="photos">
      <div class="medias" v-for="n in urls" :key="n" :style="{ 
        'background-image': 'url(' + n.url + ')', 
        'background-size': 'cover',
        'background-position':'center'}" @click="viewing(n)">
        </div>

        <viewPics v-if="isViewing === true" :media="clickedMedia" :mediaComment="theMediaComment"></viewPics>
  </div>
</div>

    <div class="more">
      <button class="showMore" @click="showMore()">更多</button>
    </div>
</template>

<script>
import viewPics from './viewPics.vue'

export default {
  name: 'displayMedias',
  props: {
      urls: {}
  },
  components: {
    viewPics 
  },
  data(){
      return{
          isViewing: false,
          gotComment: false,
          clickedMedia: {},
        theMediaComment: [] 
      }
  },
  methods:{
      viewing(n){
      this.isViewing = true;
      this.clickedMedia = {id: n.id, //Push the info of the photo  
                           likes: n.likes, 
                           url: n.url,
                           caption: n.caption,
                           comments: n.comments,
                           time: n.time};

      var theComment = new Array();
      for(let i=0; i < n.comments; i++){
        if(n.id === this.$store.state.media_comments[i].media.id){ //Check if both id matches
          this.gotComment = true
          var theTime = new Date(this.$store.state.media_comments[i].timestamp).getTime(); //Get time code
          var whatime = new Date(theTime).toDateString()//Convert to human readable time
          

          theComment.push({mediaID: this.$store.state.media_comments[i].media.id, //Push the info of the comment
                           id: this.$store.state.media_comments[i].id,
                           userName: this.$store.state.media_comments[i].username,
                           text: this.$store.state.media_comments[i].text,
                           time: whatime});
        }
      }
      this.theMediaComment = theComment;

      console.log(n.id, this.theMediaComment)                    
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');

      this.$nextTick(()=>{
        var modal = document.querySelector(".modal");
        var body = document.querySelector("body");
        body.setAttribute("class", "modal-open");
        // body.style.position = 'fixed';
        modal.style['margin-top'] = `${scrollY}`; //push modal to the screen positon
      })      
    },

    showMore(){
      var medias = document.querySelectorAll(".medias");
      console.log(medias)

      for(let i=0; i < medias.length; i++){
        if(medias[i].style.display === 'none'){
          medias[i].style.display = 'block';
          medias[i].classList.add("fadeIN")
          window.scrollTo({ //move to the bottom of screen
            top: document.body.scrollHeight,
            behavior: "smooth"});
        }
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
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  width: 55vw;
  margin: 0 auto;
}

.medias{
  border: 1px solid #232;
  width: 17.1vw;
  height: 30vh;
  margin: 0.5vw 0.5vw;
  cursor: pointer;
}

.more{
  padding: 0 0 0.5% 0.5%;
  display: flex;
  justify-content: center;
}

.showMore{
  border: 1px solid rgba(34, 51, 34, 0.5);
  border-radius: 10px;
  width: 10vw;
  height: 5v;
  font-size: 1.2rem
}
</style>
