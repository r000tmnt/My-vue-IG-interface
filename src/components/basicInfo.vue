<template v-model="$store.state.basic">
<div class="top_frame">
  <div id="fromData">
      <div id="profile" class="flex">
        <div class="profile_pic">
          <img :src="$store.state.basic.profile_pic" alt="Not Found">
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
         <li><button class="post here" @click="viewPosts()" @mouseover="ishereHover">貼文</button></li>
         <li><button class="story" @click="viewStroies()" @mouseover="ishereHover">限時動態</button></li>
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
      this.$parent.viewPost = true; 
      console.log(this.$parent.viewPost)
    },

    viewStroies(){
      this.$parent.viewPost = false;
      console.log(this.$parent.viewPost) 
    },

    ishereHover(){
      var post = document.querySelector(".post");
      var story = document.querySelector(".story")
      
      if(post.classList.contains("here")){
        post.classList.remove("here")
        story.classList.add("here")
      }else if(story.classList.contains("here")){
        story.classList.remove("here")
        post.classList.add("here")
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
  font-size: 0.9rem;
  font-weight: bold;
  animation: ishere 1s ease-in-out infinite alternate-reverse !important;
}

.flex{
  display: flex;
}

.top_frame{
  /* border: 1px solid red; */
  background-color: rgb(240, 240, 240);
}

#fromData{
  margin: 0 auto;
  width: 75vw;
}

#profile{
  justify-content: center;
  padding: 1%;
}

.profile_pic {
  border: 2px solid #232;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  overflow: hidden;
  margin: 0 2vw 0 0;
}

.profile_pic > img{
  max-width: 100%;
  vertical-align: middle;
}

.biography{
  width: 20%;
}

h4 > a{
  text-decoration: none;
  color: steelblue;
}

a:hover{
  color: slateblue;
}

.counts{
  width: 20vw;
  margin: 0 auto;
}

ul > li{
  list-style: none;
  margin:0 1vw;
}

.sections{
  width: 15vw;
  margin: 0 auto;
  padding: 1vh 0;
  border-top: 1px solid #232;
}

.sections > li > button{
  border: none;
  color: steelblue;
  cursor: pointer;
}

.sections > li:hover{
  color: white;
  background-color: #232;
  transition: 0.5s;
}
</style>
