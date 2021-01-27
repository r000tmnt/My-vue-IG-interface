<template style="position: relative" v-model="count">
<div id="noStory" v-if="Object.keys($parent.media_stories).length === 0">
  <h1>抱歉。 目前沒有24小時內的限時動態。</h1>
</div>

<div id="hasStories" v-if="Object.keys($parent.media_stories).length > 0" @click="pauseClick">
  
  <div class="showStory" v-for="n in sts" :key="n">
    <div class="back"><button @click="goBack">X</button></div>
    <center id="timeCount">
      {{count}}
    </center>
    <div class="main"><img :src="n.url" alt="Not Found"></div>
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
      pause: false
    }
  },
  methods: {
    hideStories(){
      var stories = document.querySelectorAll(".main");
      if(stories.length > 1){
        for(let i=0; i <= stories.length; i++){
          stories[i+1].style.display = 'none';
        }
      }
    },

    goBack(){
      this.$parent.viewPost = true;
      var post = document.querySelector(".post");
      var story = document.querySelector(".story");
      post.classList.add("here");
      story.classList.remove("here");
    },

    countDown(){
      this.timer = window.setInterval(() => {
                    this.count++;

                    if(this.count === 15 && this.sts.length === 1){ //If there's only one story
                       this.goBack();
                    }else if(this.count === 15 && this.sts.length > 1){
                       var stories = document.querySelectorAll(".main");
                       for(let i=0; i < this.sts.length; i++){ // If there's more
                          stories[i+1].innerHTML = '<img src='+ this.sts[i+1].url +'>';
                          stories[i].style.display = 'none'
                          stories[i+1].style.display = 'block';
                       }
                      }
      
                    }, 1000);
      
      
       
    },

    pauseClick(){
      if(this.pause === false){ //pause timer if it is counting
        window.clearInterval(this.timer);
        this.pause = true;
        console.log("pause");
      }else if(this.pause === true){ //resume counting if it is paused
        this.pause = false;
        console.log("continue");
        this.countDown();
      }
    }
  },
  created(){
      this.countDown();
      this.hideStories();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes countDown{
  from{ transform: translateX(0px); }
  to{ transform: translateX(100vw); }
}

#noStory{
  position: relative;
}

#noStory > h1{
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

#hasStories{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: #232;
  width: 100%;
  height: 100vh;
  cursor: pointer;
}

center{
  padding: 1vw;
  color: white;
}

.showStory{
  width: 60vw;
  border: 1px solid red;
  margin: 0 auto;
  overflow: hidden;
}

.back{
  float: right;
  margin-top: 1vh;
}

.back > button{
  border: none;
  background: none;
  color: white;
  cursor: pointer;
}

#timeCount{
  /* border: 1px solid white; */
  height: 1.5vh;
  /* animation: countDown 15s; */
}

.main{
  width: 55%;
  margin: 0 auto;
}

.main > img{
  max-width: 100%;
}
</style>