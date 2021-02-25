<template v-model="$store.state.basic">
<div class="top_frame">

  <div id="banner" :style="{'background-image':'url('+$store.state.basic.profile_pic+')',
                            'background-size': 'cover','background-position':'center',
                            'filter':'blur(5px)'}">
  </div>

  <div id="fromData">
      <div id="profile" class="flex">
        <div class="profile_pic">
          <a class="section story" :class="{Here: $parent.currentLocation === 'story'}" @click="viewStroies()">
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
  </div>

  <div id="sections">
    <ul class="flex">
      <li class="section post" :class="{here: $parent.currentLocation === 'post'}">
        <img src="../assets/image.svg" alt="Not found" @click="viewPosts()">
      </li>
      <li class="section mention" :class="{here: $parent.currentLocation === 'mention'}">
        <img src="../assets/pin.svg" alt="Not found" @click="viewMentions()">
      </li>
    </ul>
  </div>
</div>

</template>

<script>
export default {
  name: 'basicInfo',
  methods: {
    viewPosts(){
      this.$store.state.fadeIN = false;
      this.$parent.currentLocation = 'post';
      this.$store.state.mediaIndex = 9 //Reset images 
      console.log(this.$parent.currentLocation)

      var vm = this;
      var IGid = this.$store.state.Needed.IGid;
      var acToken = this.$store.state.Needed.acToken;
      this.$parent.getMedias(vm, IGid, acToken);
    },

    viewStroies(){
      this.$parent.currentLocation = 'story';
      console.log(this.$parent.currentLocation)
      
      var vm = this;
      var IGid = this.$store.state.Needed.IGid;
      var acToken = this.$store.state.Needed.acToken;      
      this.$parent.getStories(vm, IGid, acToken);
    },

    viewMentions(){
      this.$parent.currentLocation = 'mention';
      console.log(this.$parent.currentLocation);

      var vm = this;
      var IGid = this.$store.state.Needed.IGid;
      var acToken = this.$store.state.Needed.acToken;      
      this.$parent.getTags(vm, IGid, acToken);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.here{
  filter: brightness(100);
  border-bottom: 1px solid white;
}

.flex{
  display: flex;
}

#banner{
  width: 100%;
  height: 22vh;
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
  padding: 15px;
  color: white;
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

.counts > li{
  white-space: nowrap;
}

ul > li{
  list-style: none;
  margin:0 1vw 0 0;
  padding: 1%;
}

#sections{
  border-top: 1px solid white;
  margin-top: 25px;
}

#sections > ul{
  width: 25vw;
  margin: 0 auto;
  padding: 1vh 0;
  border-top: 1px solid #232;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

#sections > ul > li > img{
  filter: invert(1) brightness(0.5);
  width: 30px;
}

#sections > ul > li{
  margin: 0 3vw;
}

@media screen and (max-width: 1411px){
  .biography > h4{
   width: 30vw;
 }
  
  .counts{
    width: 25vw;
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

 .counts{
   width: 90%;
   justify-content: center;
 }
}

@media screen and (max-width: 467px) {
 #banner{
   height: 28vh;
 }

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

 .counts {
   width: 90%;
   margin-top: 50px;
 }

 .sections{
   margin-top: 0!important;
 }
 
 .sections > li > button{
   width: 20vw;
 }
}
</style>
