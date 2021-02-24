<template style="position: relative" v-model="sts">
<div id="noStory" v-if="Object.keys($parent.media_stories).length === 0">
  <h1>抱歉。 目前沒有24小時內的限時動態。</h1>
</div>

<div id="hasStories" v-if="Object.keys($parent.media_stories).length > 0" @click="pauseClick" @dblclick="goBack">
  
  <div class="showStory">
    <center id="timeCount"></center>
    <div class="main"><img :src="sts[storyIndex].media_url" alt="Not found"></div>
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
      count: 0,
      pause: false,

      storyIndex: 0
    }
  },
  methods: {
    checkStories(){
      this.storyIndex++;
    },

    goBack(){
      this.$parent.currentLocation = 'post';
    },

    countDown(){
      if(Object.keys(this.$parent.media_stories).length > 0){//Start counting when there are stories to show
        this.timer = window.setInterval(() => {
                    console.log(this.count++);

                    if(this.count === 15 && this.sts.length === 1){ //If there's only one story
                       this.goBack();
                       this.count = 0;
                       this.pauseClick();
                    }else if(this.count === 15 && this.sts.length > 1){
                      this.checkStories();
                    }
                  }, 1000);
      }  
    },

    pauseClick(){
      var timeCount = document.getElementById("timeCount");
      if(this.pause === false){ //pause timer if it is counting
        window.clearInterval(this.timer);
        this.pause = true;
        timeCount.style.animationPlayState = 'paused';
        console.log("pause");
      }else if(this.pause === true){ //resume counting if it is paused
        this.pause = false;
        console.log("continue");
        timeCount.style.animationPlayState = 'running';
        this.countDown();
      }
    }
  },
  created(){
      this.countDown();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes countDown{
  from{ transform: translateX(0px); }
  to{ transform: translateX(100%); }
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
  overflow: hidden;
  margin-top: 4vh;
}

.back{
  float: right;
  margin-top: 1vh;
  position: absolute;
  z-index: 2;
}

.back > button{
  border: none;
  background: none;
  color: white;
  cursor: pointer;
}

#timeCount{
  background: white;
  margin-top: 0.5vh;
  color: steelblue;
  animation: countDown 16s;
}

.main{
  width: 530px;
  margin: 0 auto;
}

.main > img{
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
  .showStory{
    width: 95vw;
  }

  .main{
    width: 100%;
  }
}
</style>