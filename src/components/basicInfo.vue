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

            <ul class="counts flex">
              <li>追蹤:{{$store.state.basic.follower}}</li>
              <li>追蹤者:{{$store.state.basic.followed}}</li>
              <li>上傳:{{$store.state.basic.medias}}</li>
            </ul>
          </div>
      </div>

       

       <ul class="sections flex">
         <li class="section post here" @click="viewPosts()">貼文</li>
         <li class="section mention" @click="viewMentions()">標註</li>
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
      this.$store.fadeIN = false;
      this.$parent.currentLocation = 'post';
      var _where = document.querySelector(".post")
      this.checkWhere(_where);
      this.$store.state.mediaIndex = 9 //Reset images 
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
  border-bottom: 1px solid white;
}

.here::before{
  content: ">";
  color: white;
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
  height: 19.5vh;
  position: absolute;
  z-index: -1;
  opacity: 0.5;
}

#fromData{
  margin: 0 auto;
  width: 75vw;
}

#profile{
  justify-content: center;
  padding-top: 10px;
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
  padding: 0;
  font-weight: bold;
}

ul > li{
  list-style: none;
  margin:0 1vw 0 0;
  padding: 1%;
}

.sections{
  width: 25vw;
  margin: 0 auto;
  padding: 1vh 0;
  border-top: 1px solid #232;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  margin-top: 25px;
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
