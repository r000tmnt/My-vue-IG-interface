<template style="position: relative">
<div id="noStory" v-if="sts_length === 0">
  <h1>抱歉。 目前沒有24小時內的限時動態。</h1>
</div>

<div id="hasStories" v-else @click="pauseClick" @dblclick="goBack">
  <div class="showStory" v-if="media_stories">
    <div class="main">
      <div id="sts" :style="{'width': setWidth}">
        <div id="timeCount" class="relative">
          <div class="run" :style="{animationPlayState: playstate}"></div>
        </div>
        <div class="profile-sts relative">
          <div class="profile">
            <img :src="basic.profile_pic" alt="Not found" style="border-radius: 50%; margin-right: 5px">
            <div class="subInfo">
              {{basic.userName}}
              <small>{{media_stories[storyIndex].timestamp}}</small>
            </div>
          </div>
        </div>
        <img :src="media_stories[storyIndex].media_url" alt="Not found" style="margin-top: -78px"></div>        
      </div>
  </div>
  
</div>
  
</template>

<script>
//Object.keys(objectname).length  Check if the object is empty
export default {
  name: 'displayStories',
  data(){
    return{
      windowHeight: window.innerHeight,
      setWidth: '',
      timer: null,
      pause: false,
      playstate: 'running', 
      storyIndex: 0
    }
  },
  computed:{
    media_stories(){
      return this.$store.state.media_stories
    },
    sts_length(){
      return this.$store.state.sts_length
    },
    basic(){
      return this.$store.state.basic
    },
  },
  methods: {
    checkWindow(){
      if(this.windowHeight === 760){
        this.setWidth = 410 + 'px';
      }else{
        this.setWidth = 514 + 'px';
      }
    },

    checkStories(){
      this.storyIndex++;
      this.countDown()//start counting again
    },

    goBack(){
      this.$store.commit('refreash_Posts');  
    },

    countDown(){
      if(this.pause === false){
        this.timer = window.setInterval(() => {
                    if(this.storyIndex + 1 === this.sts_length){//If there are no more to show
                      this.goBack();
                      this.pauseClick();
                    }else{
                      this.checkStories();
                    }
                  }, 15000);                 
      }else{
        window.clearInterval(this.timer);
      }

    },

    pauseClick(){
      if(this.pause === false){ //pause timer if it is counting
        this.pause = true;
        this.playstate = 'paused';
        this.countDown();
      }else if(this.pause === true){ //resume counting if it is paused
        this.pause = false;
        this.playstate = 'running';
        this.countDown();
      }
    }
  },
  mounted(){
    this.checkWindow();
    if(this.sts_length > 0){//Start counting when there are stories to show
      this.countDown();
    }     
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes countDown{
  from{ transform: translateX(0%); }
  to{ transform: translateX(100%); }
}

.relative{
  position: relative;
}

#noStory > h1{
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color:white;
}

#hasStories{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: rgba(34, 51, 34, 0.9);
  width: 100%;
  height: 100vh;
  cursor: pointer;
}

center{
  padding: 0.2vw;
}

.showStory{
  width: 60vw;
  /* border: 1px solid red; */
  margin: 0 auto;
  margin-top: 4vh;
}

.back{
  float: right;
  margin-top: 1vh;
  position: absolute;
  z-index: 2;
}

#timeCount{
  width: 100%;
  background: #232;
  border-radius: 15px;
  overflow: hidden;
  margin-top: 0.5vh;
  opacity: 0.7;
  position: relative;
  z-index: 2;
}

.run{
  border: 1px solid white ;
  background-color: white;
  animation: countDown 15s infinite alternate;
}

.main{
  margin: 0 auto;
}

#sts{
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

#sts > img{
  max-width: 100%;
}

.profile-sts{
  opacity: 0;
  color: white;
  z-index: 2;
}

.profile-sts:hover{
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.profile{
  width: 20px;
  height: 20px;
  display: flex;
  padding: 1%;  
}

.profile > img{
  max-width: 100%;
}

small{
  opacity: 0.7;
}

@media screen and (max-width: 900px) {
  .showStory{
    width: 90vw;
  }
}

@media screen and (max-width: 592px) {
  .showStory{
    width: 100vw;
  }
}

@media screen and (max-width: 514px) {
  .main{
    width: auto;
  }
  
  #sts{
    width: unset!important;
  }
}

@media screen and (max-width: 420px) {
  .main{
    width: unset;
  }
}
</style>