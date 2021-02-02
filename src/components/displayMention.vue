<template style="position: relative">
<div id="noMention" v-if="Object.keys($parent.media_mentions).length === 0">
  <h1>有標記的相片會顯示在這裡</h1>
</div>

<div id="mentioned" v-else>
  <div id="showMentioned" v-for="n in mentions" :key="n">
    <img :src="n.url" alt="Not found" @click="enlarge(n)">

    <div class="large">
      <button class="close" @click="close">X</button>
      <img class="enlarge" src="" alt="">
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
  methods: {
    enlarge(n){
      var large = document.querySelector(".large");
      var enlarge = document.querySelector(".enlarge");
      enlarge.setAttribute("src", n.url); 
      large.style.display = 'block';
      large.classList.add("fadeIN")
    },

    close(){
      var large = document.querySelector(".large");
      large.style.display = 'none';
      large.classList.remove("fadeIN")
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
}

#mentioned{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding:3%;
  position: relative;
}

#showMentioned{
  width: 20vw;
}

#showMentioned > img{
  max-width: 100%;
}

.large{
  opacity: 0;
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
</style>