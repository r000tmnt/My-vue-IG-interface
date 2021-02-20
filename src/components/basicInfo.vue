<template v-model="$store.state.basic">
<div class="top_frame">

  <div id="banner" :style="{'background-image':'url('+$store.state.basic.profile_pic+')',
                            'background-size': 'cover','background-position':'center',
                            'filter':'blur(5px)'}">
  </div>

  <div id="fromData">
      <div id="profile" class="flex">
        <div class="profile_pic">
          <a class="section story" @click="viewStroies()">
            <img :src="$store.state.basic.profile_pic" alt="Not Found">
          </a>
        </div>

          <div class="biography">
             <h1>{{$store.state.basic.userName}}</h1>
            <h4>{{$store.state.basic.bio}}
              <a :href="$store.state.basic.web">{{$store.state.basic.web}}</a> 
            </h4>
          </div>
      </div>

       <ul class="counts flex">
            <li><h4>追蹤:{{$store.state.basic.follower}}</h4></li>
            <li><h4>追蹤者:{{$store.state.basic.followed}}</h4></li>
            <li><h4>上傳:{{$store.state.basic.medias}}</h4></li>
       </ul>

       <ul class="sections flex">
         <li><button class="section post here" @click="viewPosts()">貼文</button></li>
         <li><button class="section mention" @click="viewMentions()">標註</button></li>
       </ul>
          
  </div>
</div>

</template>

<script>
export default {
  name: 'basicInfo',
  props: {
  },
  methods: {
    viewPosts(){
      this.$parent.currentLocation = 'post';
      var _where = document.querySelector(".post")
      this.checkWhere(_where);
      var vm = this;
      this.$parent.hideImages(vm); //Without this function, switching back will reveal all images. 
      console.log(this.$parent.currentLocation)
    },

    viewStroies(){
      this.$parent.currentLocation = 'story';
      var _where = document.querySelector(".story")
      this.checkWhere(_where);
      console.log(this.$parent.currentLocation) 
    },

    viewMentions(){
      this.$parent.currentLocation = 'mention';
      var _where = document.querySelector(".mention")
      this.checkWhere(_where);
      console.log(this.$parent.currentLocation);
    },

    checkWhere(_where){
      var here = document.querySelector(".here");
      here.classList.remove("here")
      _where.classList.add("here");

      if(_where.classList.contains("story")){
        _where.classList.add("Here");
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes ishere{
  from{ transform: translateX(0px); }
  to{ transform: translateX(-3px); }
}

.here{
  color:goldenrod!important;
}

.here::before{
  content: ">";
  color: #232;
  display: inline-block;
  font-size: 1.2rem;
  font-weight: bold;
  animation: ishere 1s ease-in-out infinite alternate-reverse !important;
  z-index: -1;
}

.Here::before{
  content: none;
}

.flex{
  display: flex;
}

.top_frame{
  /* border: 1px solid red; */
}

#banner{
  width: 100%;
  height: 30vh;
  position: absolute;
  z-index: -1;
  opacity: 0.9;
}

#fromData{
  margin: 0 auto;
  width: 75vw;
}

#profile{
  justify-content: center;
}

.profile_pic {
  border: 2px solid #232;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  overflow: hidden;
  margin: 0 2vw 0 0;
}

.profile_pic > a > img{
  max-width: 100%;
  vertical-align: middle;
  cursor: pointer;
}

.biography{
  width: 20%;
}

.biography > h4{
  width: 20vw;
}

h4 > a{
  text-decoration: none;
  color: white;
  background-color: rgba(34, 51, 34, 0.5);
}

a:hover{
  color: skyblue;
}

.counts{
  width: 20vw;
  margin: 0 auto;
  margin-bottom: -15px;
}

ul > li{
  list-style: none;
  margin:0 1vw;
}

.sections{
  width: 25vw;
  margin: 0 auto;
  padding: 1vh 0;
  border-top: 1px solid #232;
}

.sections > li > button{
  border: 1px solid rgba(34, 51, 34, 0);
  border-radius: 10px;
  color: steelblue;
  cursor: pointer;
  width: 10vw;
  font-size: 1.2rem;
}

.sections > li > button:hover{
  border-bottom: 1px solid #232;
  transition: 0.5s;
}

@media screen and (max-width: 1411px){
  .biography > h4{
   width: 30vw;
 }
  
  .counts{
    width: 25vw;
    justify-content: center;
  }
}

@media screen and (max-width: 1045px){
   #fromData{
   width: 90vw;
   transition: 0.5s ease-in-out;
 } 

  .biography > h4{
   width: 40vw;
 }

  .counts{
    width: 30vw;
  }
}

@media screen and (max-width: 830px) {
  .profile_pic {
    margin-left: -20vw;
    transition: 0.5s;
  }
  
  .counts{
    width: 41vw;
  }

  .sections > li > button{
    width: unset;
  }
}

@media screen and (max-width: 576px) {
 #fromData{
   width: 100vw;
   transition: 0.5s ease-in-out;
 } 

 .biography > h1{
   font-size: 1.5rem;
   transition: 0.5s ease-in;
 }

 .biography > h4{
   width: 50vw;
 }

 .biography > h4 > a{
   font-size: 0.78rem;
 }

 .counts , .sections{
   width: 90%;
   justify-content: center;
 }
 
 .sections > li > button{
   width: 20vw;
 }
}

@media screen and (max-width: 467px) {
 .profile_pic {
    margin-left: -33vw!important;
    transition: 0.5s;
  }

 .biography > h4{
   width: 50vw;
 }

 .biography > h4 > a{
   font-size: 0.78rem;
 }

 .counts , .sections{
   width: 90%;
   justify-content: center;
 }
 
 .sections > li > button{
   width: 20vw;
 }
}
</style>
