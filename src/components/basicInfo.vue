<template>
<div class="top_frame">

  <div id="banner" :style="{'background-image':'url('+basic.profile_picture_url+')',
                            'background-size': 'cover','background-position':'center',
                            'filter':'blur(5px)'}">
  </div>

  <div id="fromData">
      <div id="profile" class="flex">
        <div class="profile_pic">
          <a class="section story" :class="{Here: currentLocation === 'story'}" @click="getStories()">
            <img :src="basic.profile_picture_url" alt="Not Found">
          </a>
        </div>
          <div class="biography">
             <h1>{{basic.username}}</h1>
            <h4>{{basic.biography}}
              <a :href="basic.website">{{basic.website}}</a> 
            </h4>

            <ul class="counts flex">
              <li>追蹤:{{basic.followers_count}}</li>
              <li>追蹤者:{{basic.follows_count}}</li>
              <li>上傳:{{basic.media_count}}</li>
            </ul>
          </div>
      </div>          
  </div>

  <div id="sections">
    <ul class="flex">
      <li class="section post" :class="{here: currentLocation === 'post'}" @click="refreash_Posts()">
        <img src="../assets/image.svg" alt="Not found">
      </li>
      <li class="section mention" :class="{here: currentLocation === 'mention'}" @click="getTags()">
        <img src="../assets/pin.svg" alt="Not found">
      </li>
    </ul>
  </div>
</div>

</template>

<script>
export default {
  name: 'basicInfo',
  computed:{
    Needed(){
      return this.$store.state.Needed
    },
    basic(){
      return this.$store.state.basic
    },
    currentLocation(){
      return this.$store.state.currentLocation
    },
    postRefreashed(){
      return this.$store.state.postRefreashed
    }
  },
  methods: {
    getStories(){
      this.$store.dispatch('getStories')
    },

    getTags(){
      this.$store.dispatch('getTags')
    },
    
    waitForRefreash(){
      var vm = this
      var Needed = {IGid: vm.Needed.IGid, acToken: vm.Needed.acToken} 
      return new Promise((resolve, reject) => {
        if(!vm.postRefreashed){
          reject('error')
        }else{
          resolve({
            message: 'sucess',
            toDo: function(){
              vm.$store.dispatch('getMedias', Needed)
            }
          })
        }
      })      
    },

    refreash_Posts(){
      this.waitForRefreash().then((resolve) => {
        resolve.toDo();
        if(this.postRefreashed === true){//Wait till api call to finish
        const place = 'post'
          this.$store.commit('viewSection', place);   
        }
      }).catch((reject) => {console.log(reject)})
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes isHere{
  0%, 100%{
    filter: brightness(100);
  }
}

.here{
  animation: isHere 0.5s ease-in-out forwards;
  color: white;
  border-bottom: 1px solid white;
}

.flex{
  display: flex;
}

#banner{
  width: 100%;
  height: 231px;
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
  margin: 2vh 2vw 0 0;
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
  transition: all 0.5s ease-in-out;
}

#sections > ul > li > img{
  filter: invert(1) brightness(0.5);
  width: 30px;
}

#sections > ul > li{
  width: 100%;
  text-align: center;
  transition: all 0.5s ease-in-out;
  margin: 0;
}

.post::after{
  content: '推文';
  position: relative;
  top: -10px;
  left: 10px;
}

.mention::after{
  content: '已標記';
  position: relative;
  top: -10px;
  left: 10px;
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

@media screen and (max-width: 708px) {
  .post::after{
    content: none;
  }

  .mention::after{
    content: none;
  }
}

@media screen and (max-width: 600px) {
  #sections > ul{
    width: 96vw;
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
}

@media screen and (max-width: 467px) {
 #banner{
   height: 218px;
 }

 .profile_pic {
    margin-left: -33vw!important;
    transition: 0.5s;
    width: 100px;
    height: 100px;
  }

 .biography > h4{
   width: 50vw;
 }

 .biography > h4 > a{
   font-size: 0.78rem;
 }

 .sections{
   margin-top: 0!important;
 }

 .sections > ul > li{
   padding: 0 15vw;
 }
}

@media screen and (max-width: 387px) {
 #banner{
   height: 214px;
 }

 .counts{
   justify-content: center;   
 }
}
</style>
