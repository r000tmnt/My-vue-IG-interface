<template style="position: relative">
<div id="noMention" v-if="Object.keys($parent.media_mentions).length === 0">
  <h1>有標記的相片會顯示在這裡</h1>
</div>

<div id="mentioned" v-else>
  <div id="showMentioned" v-for="n in mentions" :key="n">
    <img :src="n.url" alt="Not found" @click="larger(n)">

    <div class="large" v-if="enlarge.clicked === true">
      <button class="close" @click="close">X</button>
      <img class="enlarge" :class="{fadeIN: fadeIN}" :src="enlarge.source" alt="Not found">
    </div>
  </div>
</div>
  
</template>

<script>
//Object.keys(objectname).length  Check if the object is empty
export default {
  name: 'displayMention',
  props: {
    mentions: {}
  },

  data(){
    return{
      fadeIN: false,

      enlarge: {
        clicked: false,
        source: '',
      },
    }
  },

  methods: {
    larger(n){
      this.fadeIN = true;
      this.enlarge.clicked = true;
      this.enlarge.source = n.url
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
  padding:3%;
  position: relative;
}

#showMentioned{
  width: 295px;
}

#showMentioned::after{
  padding-bottom: 100%;
}

#showMentioned > img{
  max-width: 100%;
  cursor: pointer;
}

.large{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.large > .enlarge{
  max-width: 100%;
}

.close{
  border:0; 
  background: none;
  border: none;
  float: right;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 1vh 0 0 0;
  color: white ;
  position: relative;
  z-index: 2;
}

.close:hover{
  border: white;
  background: #232;
  transition: 0.5s;
}

@media screen and (max-width: 700px) {
  .large{
    width: 90vw;
  }
}

@media screen and (max-width: 576px) {
  #showMentioned{
  width: 35vw;
}
}
</style>