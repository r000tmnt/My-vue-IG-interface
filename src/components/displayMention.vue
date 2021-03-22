<template style="position: relative">
<div id="noMention" v-if="Object.keys(mentions).length === 0">
  <h1>有標記的相片會顯示在這裡</h1>
</div>

<div id="mentioned" v-else>
  <div id="showMentioned" v-for="(mention, index) in mentions" :key="index">
    <img :src="mention.media_url" alt="Not found" @click="larger(mention)">

    <div id="mention_modal" :class="{fadeIN: fadeIN}" v-if="enlarge.clicked === true">
      <button class="close" @click="close">X</button>
        <div class="large">
          <img class="enlarge" :src="enlarge.source" alt="Not found">
          <div class="tag_by">由 {{mention.username}} 標記</div>
        </div>             
      </div>
  </div>
</div>
  
</template>

<script>
//Object.keys(objectname).length  Check if the object is empty
export default {
  name: 'displayMention',
  data(){
    return{
      fadeIN: false,

      enlarge: {
        clicked: false,
        source: '',
      },
    }
  },
  computed:{
    mentions(){
      return this.$store.state.media_mentions
    },
  },
  methods: {
    larger(mention){
      this.fadeIN = true;
      this.enlarge.clicked = true;
      this.enlarge.source = mention.media_url
    },

    close(){
      this.enlarge.clicked = false;
      this.fadeIN = false;
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
  animation: fadeIN 0.5s ease-in-out forwards !important;
}

#noMention{
  position: relative;
}

#noMention > h1{
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  margin-top: 20vh;
  color: white;
}

#mentioned{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1%;
  position: relative;
}

#showMentioned{
  width: 295px;
  position: relative;
}

#showMentioned::after{
  padding-bottom: 100%;
}

#showMentioned > img{
  max-width: 100%;
  cursor: pointer;
}

#mention_modal{
  background-color: rgba(34, 51, 34, 0.7);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color: white;
  padding: 0 1vw 0 1vw;
  z-index: 2;
}

.large{
  width: 830px;
  margin: 0 auto;
}

.large > .enlarge{
  max-width: 100%;
}

.close{
  background: none;
  border: 1px solid;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  float: right;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 1%;
  color: white ;
  position: relative;
  z-index: 2;
  opacity: 0.5;
}

.close:hover{
  background: #232;
  opacity: 1;
  transition: 0.5s;
}

@media screen and (max-width: 955px) {
  #showMentioned{
    width: 31vw;
  } 
}

@media screen and (max-width: 830px) {
  .large{
    width: 97vw;
  }
}

@media screen and (max-width: 734px) {
 #showMentioned{
   width: 30.5vw;
 } 
}

@media screen and (max-width: 570px) {
  #showMentioned{
  width: 31.5vw;
  }
}
</style>