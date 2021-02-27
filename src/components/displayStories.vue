<template style="position: relative">
<div id="noStory" v-if="!sts">
  <h1>抱歉。 目前沒有24小時內的限時動態。</h1>
</div>

<div id="hasStories" v-else @click="pauseClick" @dblclick="goBack">
  
  <div class="showStory">
    <div class="main">
      <div id="sts">
        <div id="timeCount" class="relative">
          <div class="run" :style="{animationPlayState: playstate}"></div>
        </div>
        <div class="profile-sts relative">
          <img :src="$store.state.basic.profile_pic" alt="Not found" style="border-radius: 50%">
          {{$store.state.basic.userName}}
        </div>
        <img :src="sts[storyIndex].media_url" alt="Not found" style="margin-top: -78px"></div>        
      </div>
  </div>
  
</div>
  
</template>

<script>
//Object.keys(objectname).length  Check if the object is empty
export default {
  name: 'displayStories',
  props: {
    sts: {}
  },
  data(){
    return{
      timer: null,
      pause: false,
      playstate: 'running',
      sts_length: '',
      storyIndex: 0
    }
  },
  methods: {
    checkStories(){
      this.storyIndex++;
      this.countDown()//start counting again
    },

    goBack(){
      this.$store.state.currentLocation = 'post';
    },

    countDown(){
        this.timer = window.setInterval(() => {
                    if(this.sts_length === 1){ //If there's only one story
                      console.log(Object.keys(this.sts).length)
                       this.goBack();
                       this.pauseClick();
                    }else if(this.sts_length > 1){
                      this.checkStories();
                      this.pauseClick();
                    }
                  }, 15000);
    },

    pauseClick(){
      if(this.pause === false){ //pause timer if it is counting
        window.clearInterval(this.timer);
        this.pause = true;
        this.playstate = 'paused';
        console.log("pause");
      }else if(this.pause === true){ //resume counting if it is paused
        this.pause = false;
        console.log("continue");
        this.playstate = 'running';
        this.countDown();
      }
    }
  },
  mounted(){
    console.log(this.sts)
    console.log(Object.keys(this.sts).length)
  },

  beforeUpdate(){
    this.sts_length = Object.keys(this.sts).length;
    if(this.sts_length > 0){//Start counting when there are stories to show
      this.countDown();
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes countDown{
  from{ transform: translateX(0px); }
  to{ transform: translateX(100vw); }
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
  background: #232;
  border-radius: 15px;
  overflow: hidden;
  margin-top: 0.5vh;
  opacity: 0.7;
}

.run{
  border: 1px solid white ;
  background-color: white;
  animation: countDown 15s;
}

.main{
  margin: 0 auto;
}

#sts{
  width: 514px;
  margin: 0 auto;
  overflow: hidden;
}

#sts > img{
  max-width: 100%;
}

.profile-sts{
  width: 20px;
  height: 20px;
  display: flex;
  padding: 1%;
}

.profile-sts > img{
  max-width: 100%;
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

  .main{
    width: 520px;
  }
}

@media screen and (max-width: 420px) {
  .main{
    width: unset;
  }

  #sts{
    width: unset;
  }
}
</style>