<template style="position: relative" v-model="mediaComment">
<div class="modal">
  <button class="close" @click="closeModal">X</button>
  <div style="clear: both"></div>
  <div class="forFlex flex">
    <div id="view">
      <img id="pic" :src="media.url" alt="not found">
    </div>

    <div id="info">
    <div class="profile flex">
       <img :src="$store.state.basic.profile_pic" alt="">
      <span>{{$store.state.basic.userName}}</span>
      
      <div class="subInfo flex">
        <div class="likes">{{media.likes}}個讚</div>
        &nbsp;&nbsp;
        <div class="comments_count">{{media.comments}}個留言</div>
      </div>
    </div>

    <div class="caption">
      <h4>{{media.caption}}</h4>
    </div>

    <div class="comments">
      <div class="input">
        留言<input type="text" id="pushNew" @keydown.enter="pushComment">
        <button class="push">
          <img src="../assets/sent.png" alt="Not found" @click="pushComment">
        </button>
      </div>

      <div class="comment_list">

      <section>
        <div class="vistor" v-for="(n, index) in mediaComment" :key="n.id">
          <div class="comment">
            <button class="del" @click="deleteComment(n, index)">X</button>
            <h4>{{n.userName}}: {{n.text}}</h4>
            <small>{{n.time}}</small>
          </div>
        </div>
      </section>
        
      </div>
    </div>
  </div>
  </div>
   

  
</div>
 
</template>

<script>
export default {
  name: 'viewPics',
  props: {
    media: {},
    mediaComment: {}
  },
  methods: {
    checkIMG(){//Check if the image is protrait or landscape
      var view = document.getElementById("view");
      var pic = document.getElementById("pic");
      var info = document.getElementById("info");
      var sHeigth = screen.height;

      if(view.offsetHeight > sHeigth){
        view.style.width = '80vh';
      }

      if(pic.offsetWidth < view.offsetWidth){
        info.style['margin-left'] = '-30vw';
      }else if(view.offsetHeight < sHeigth){
        info.style['margin-left'] = '0!important';
      }
    },

    pushComment(){
      var newComment = document.getElementById('pushNew');
      var vm = this;
      var current = new Date();
      var theDay = current.toDateString();

      if(newComment.value !== ''){
        window.FB.api(
          vm.media.id+'/comments',
          'POST',
          {"message": newComment.value},
          function(response){
            vm.$parent.theMediaComment.unshift({id: response.id,
                                                userName: vm.$store.state.basic.userName,
                                                text: newComment.value,
                                                time: theDay})
            console.log(response);
            newComment.value = ''; //Clear input
          }
        )
      }
    },

    deleteComment(n, index){
      let ask = confirm('您希望刪除 '+n.text+' 這個留言嗎?')
      var vm = this;
      if(ask){
          window.FB.api(
          n.id,
          'DELETE',
          function(responseDEL){
            console.log(responseDEL);
            vm.$parent.theMediaComment.splice(index, 1);
          }
        )
      }else{
          console.log("好險沒刪掉...")
        }
    },

    closeModal(){
      this.$parent.isViewing = false;

      this.$parent.theMediaComment.splice(0, this.$parent.theMediaComment.length); //clear props

      var body = document.body;
      body.removeAttribute("class", "modal-open");

      // const scrollY = body.style.top; //fix the positon at the top of the screen
      body.style.position = '';
      // window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  },

  created(){
    this.$nextTick(()=>{
      this.checkIMG();
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .flex{
    display: flex;
  }

  .modal{
    background-color: rgba(34, 51, 34, 0.9);
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    transform: translate(-50%, -50%);
    position: absolute;
    color:white;
    padding-bottom: 4%;
  }

  .forFlex{
    justify-content: center;
  }

  #view{
    margin: 3vh 5vw 0 5vw;
  }

  #view > img{
    max-width: 100%;
  }

  .profile{
    flex-wrap: wrap;
    padding: 20% 0 1.5% 0;
    border-bottom: 1px solid white;
  }

  .profile > span{
    /* border: 1px solid red; */
    display: inline-block;
    line-height: 6vh;
    font-size: 1.5rem;
    margin: 0 1vw ;
  }

  .profile > img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .close{
    border:0;
    background: none;
    border: none;
    float: right;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 3.5vh 1vw 0 0;
    color: white ;
    position: relative;
    z-index: 2;
  }

  .close:hover{
    border: white;
    background: #232;
    transition: 0.5s;
  }

  .close:focus{
    outline: none;
  }

  .subInfo{
    padding: 2vh 0 0 0;
  }

  section{
    background-color: #232;
  }

  .comment{
    padding: 0 1%;
  }

  .comment:hover{
    background:white;
    color: #232;
    transition: 0.5s;
  }

  .comment > h4{
    border: 1px solid rgba(34, 51, 34, 0);
    margin-bottom: -1px;
  }

  .comment > small{
    opacity: 0.5;
    display: inline-block;
  }
  
  .push{
    background: none;
    border: none;
    width: 1.4%;
    padding: 0;
    margin: 0 0.3%;
    position: absolute;
    cursor: pointer;
  }

  .push:focus{
    outline: none;
  }

  .push > img{
    max-width: 100%;
  }

  .del{
    float: right;
    margin-left: 1vw;
    background: none;
    border-radius: 50%;
    border: none;
    color: #FF2400;
    cursor: pointer;
    padding: 1%;
  }

  .del:hover{
    color: white;
    transition: 0.5s;
  }

  @media screen and (max-width: 1442px) {
    .modal{
      overflow: scroll;
    }
    
    .forFlex{
      flex-direction: column;
    }

    #view{
      padding: 0 0 5vh 0;
      width: 90vw!important;
    }

    #view > img{
      display: block;
      margin: auto;
    }

    .profile{
      padding: unset;
      justify-content: center;
      flex-wrap: wrap;
      padding-bottom: 1.5vh;
    }

    .caption, .comments{
      text-align: center;
    }

    #info{
      margin: 0!important;
    }

    .comment{
      display: inline-block;
    }

    .comment_list{
      margin-top: 3vh;
    }
  }

  @media screen and (max-width: 770px) {
    #view{
      width: 100%;
      padding: 0 0 5vh 0;
      transition: 0s;
      margin: 0!important;
    }

    .comment{
      display: block;
    }

    .close{
      margin-top: 6vh;
    }
  }

  @media screen and (max-width: 420px) {
    .profile{
      padding: 0 2vw 1.5vh 2vw;
    }

    .caption{
      padding: 3vw;
    }

    .push{
      width: 7%;
      margin: 0 1.5%;
    }
  }
</style>
