<template style="position: relative" v-model="mediaComment">
<div class="modal">
  <button class="close" @click="closeModal">X</button>
  <div class="forFlex flex">
    <div id="view">
      <img :src="media.url" alt="not found">
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
      留言<input type="text" id="pushNew" @keydown.enter="pushComment">

      <div class="comment_list">

      <section>
        <div class="vistor" v-for="(n, index) in mediaComment" :key="n.id">
          <h4 class="comment">{{n.userName}}: {{n.text}}
            <small>{{n.time}}</small>
            <button class="del" @click="deleteComment(n, index)">X</button>
          </h4>
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
    pushComment(){
      var newComment = document.getElementById('pushNew');
      var vm = this;
      var current = new Date();
      var theDay = current.toDateString();
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
  }

  .forFlex{
    justify-content: center;
  }

  #view{
    width: 50vw;
    padding: 5vh;
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
    width: 5vw;
    border-radius: 50%;
  }

  .close{
    border:0;
    background: none;
    border: none;
    float: right;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 1vh 1vw 0 0;
    color: white ;
  }

  .close:hover{
    border: white;
    background: #232;
    transition: 0.5s;
  }

  .subInfo{
    padding: 1.5vh 0 0 0;
  }

  section{
    background-color: #232;
  }

  .vistor > h4{
    border: 1px solid #232;
  }

  .vistor > h4 > small{
    opacity: 0.5;
  }
  
  .vistor > h4 > button{
    float: right;
    margin-left: 1vw;
    background: none;
    border-radius: 50%;
    border: none;
    color: #FF2400;
    cursor: pointer;
  }

  h4.comment:hover{
    border: 1px solid white;
    transition: 0.5s;
  }

  h4 > button:hover{
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
      width: 100vw;
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

    .comment{
      display: inline-block;
    }
  }
</style>
