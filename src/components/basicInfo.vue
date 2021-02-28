<template v-model="$store.state.basic">
<div class="top_frame">

  <div id="banner" :style="{'background-image':'url('+$store.state.basic.profile_pic+')',
                            'background-size': 'cover','background-position':'center',
                            'filter':'blur(5px)'}">
  </div>

  <div id="fromData">
      <div id="profile" class="flex">
        <div class="profile_pic">
          <a class="section story" :class="{Here: $store.state.currentLocation === 'story'}" @click="getStories()">
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
      <li class="section post" :class="{here: $store.state.currentLocation === 'post'}">
        <img src="../assets/image.svg" alt="Not found" @click="refreash_Posts()">
      </li>
      <li class="section mention" :class="{here: $store.state.currentLocation === 'mention'}">
        <img src="../assets/pin.svg" alt="Not found" @click="getTags()">
      </li>
    </ul>
  </div>
</div>

</template>

<script>
export default {
  name: 'basicInfo',
  data(){
    return{
      isfetching: true,
      getData: {} //a place for new datas before send to parent
    }
  },
  methods: {
    getStories(){
      var vm = this;
      var stories_id = new Array();
      window.FB.api(
        vm.$store.state.Needed.IGid,
        {"fields":"stories", "access_token": vm.$store.state.Needed.acToken},
          function(sData){
          console.log(sData);

          //get stories id
          if(!sData.stories){ //The api can only retrun stories within 24 hours
            console.log("No stories in 24 hours.")
            vm.$store.commit('viewStories');
          }else{
            var S_id = sData.stories.data;
            console.log(sData.stories.data);

            if(sData.stories.data){//Make ture there's something
              for(let i=0; i< S_id.length; i++){
                stories_id.push(sData.stories.data[i].id);
              }
              vm.waitForloop(vm, stories_id)
              .then((resolve) => {
                console.log(resolve.message);
                resolve.toDo();
                
                if(vm.isfetching === false){
                  console.log(vm.isfetching);
                  vm.$nextTick(()=>{
                    vm.$store.dispatch('toStories', vm.getData);
                  })
                }
                vm.isfetching = true;                
              }).catch((message)=>{
                console.log(message);
              }
                
              )             
            }                  
          }
      });

    },

    waitForloop(vm, stories_id){
      return new Promise((resolve, reject) => {
        if(!vm.isfetching){
          reject('error');
        }else{
          resolve({
            message: 'success',
            toDo: function(){
              for(let i=0; i < stories_id.length; i++){ //loop  through each id
                window.FB.api(
                stories_id[i],
                'GET',
                {"fields":"caption,media_url,timestamp", "access_token": vm.$store.state.Needed.acToken},
                function(storyData) {
                  console.log(vm.isfetching);
                  console.log(storyData);
                  vm.getData[i] = storyData;
                  console.log(vm.getData[i]);
                })
              }
              vm.isfetching = false;
            }
          })
        }
      })
    },
    
    getTags(){
      var vm = this;
      var mentions = [];
      window.FB.api(
        vm.$store.state.Needed.IGid+'/tags',
        'GET',
        {"fields":"id,username,media_url", "access_token": vm.$store.state.Needed.acToken},
        function(tagged){
          console.log(tagged.data);
          for(let i=0; i < tagged.data.length; i++){
            mentions.push(tagged.data[i]);
          }

          console.log(mentions);
          if(mentions.length > 0){
            vm.getData = mentions;
            console.log(vm.getData)
            vm.$nextTick(()=>{
              vm.$emit('toMention', vm.getData);
            })
          }else{
            console.log('error');
          }          
        }
      )
    },

    waitForRefreash(){
      var vm = this;
      var IGid = vm.$store.state.Needed.IGid;
      var acToken = vm.$store.state.Needed.acToken;      
      return new Promise((resolve, reject) => {
        if(!this.isfetching){
          reject('error')
        }else{
          resolve({
            message: 'sucess',
            toDo: function(){
              vm.$parent.getMedias(vm, IGid, acToken); 
              vm.isfetching = false;
            }
          })
        }
      })      
    },

    refreash_Posts(){
      this.waitForRefreash().then((resolve) => {
        console.log(resolve.message);
        resolve.toDo();
        if(this.isfetching === false){//Wait till api call to finish
          this.$store.state.fadeIN = false;
          this.$store.state.currentLocation = 'post';
          this.$store.state.mediaIndex = 9 //Reset images 
          console.log(this.$store.state.currentLocation)          
        }
        this.isfetching = true;
      }).catch((reject) => {
        console.log(reject)
      })
     

    },

    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes isHere{
  from{
    filter: invert(1) brightness(0.5);
  }
  to{
    filter: brightness(100);
    border-bottom: 1px solid white;
  }
}

.here{
  animation: isHere 0.5s ease-in-out forwards;
}

.flex{
  display: flex;
}

#banner{
  width: 100%;
  height: 23.5vh;
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
}

@media screen and (max-width: 467px) {
 #banner{
   height: 24vh;
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
}

@media screen and (max-width: 387px) {
 #banner{
   height: 29.5vh;
 }

 .counts{
   justify-content: center;   
 }
}
</style>
