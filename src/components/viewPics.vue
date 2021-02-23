<template style="position: relative" v-model="mediaComment">
<div class="modal" :style="{'margin-top' : $store.state.scrollY}">
  <div id="forCenter">
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
            </div>

            <div class="subInfo flex">
              <div class="likes">{{media.likes}}個讚</div>
              &nbsp;&nbsp;
              <div class="comments_count">{{media.comments}}個留言</div>
            </div>

            <div class="caption text-align">
            {{media.caption}}
            </div>

            <div class="comments text-align">
              <div class="input">
                <textarea id="pushNew" placeholder="留言" :style="{'height' : autoResize + 'px'}" @keyup.enter="textAreaResize()"></textarea>
                <button class="push">
                  <img src="../assets/sent.png" alt="Not found" @click="pushComment">
                </button>
              </div>

              <div id="noComment text-align" v-if="$parent.theMediaComment.length === 0">
                尚無留言，搶個頭香吧。
              </div>

              <div class="comment_list" v-else>

                <section>
                  <div class="vistor" v-for="(n, index) in mediaComment" :key="n.id">
                    <div class="comment">
                      <button class="del" @click="deleteComment(n, index)">X</button>
                      <h4>{{n.username}}: {{n.text}}</h4>
                      <small>{{n.timestamp}}</small>
                    </div>
                  </div>
                </section>
        
              </div>
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
  
  data(){
    return{
      autoResize: 20
    }
  },

  methods: {
    textAreaResize(){
      this.autoResize = this.autoResize+20;

      if(this.autoResize > 60){ //Limit
        this.autoResize = 60
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
      this.$parent.addClass = true;
      this.$parent.defineScrollbar();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .flex{
    display: flex;
    justify-content: center;
  }

  .text-align{
    padding: 4%;
    text-align: center;
  }

  .modal{
    background-color: rgba(34, 51, 34, 0.7);
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    transform: translate(-50%, -50%);
    position: absolute;
    color:white;
    box-shadow: 5px 8px 5px #232;
  }

  #forCenter{
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  .forFlex{
    /* border: 1px solid red; */
    width: 950px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }

  #view{
    margin-bottom: -5px;
  }

  #view > img{
    max-width: 100%;
  }

  #info{
    width: 28vw;
    padding-top: 1vh;
    background-color: #232;
    color:#fff;
  }

  .profile{
    flex-wrap: wrap;
    padding: 0 0 1.5% 0;
  }

  .profile > span{
    /* border: 1px solid red; */
    display: inline-block;
    font-size: 1rem;
    margin: 1.5vh 1vw ;
  }

  .profile > img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .close{
    background: none;
    border: none;
    float: right;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 1%;
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
    padding: 2% 0 1.5% 0;
    border-bottom: 1px solid #fff;
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

  #pushNew{
    border: none;
    resize: none;
    transition: 0.5s ease-in-out;
    width: 14vw;
  }

  #pushNew:focus{
    outline: none;
  }
  
  .push{
    background: none;
    border: none;
    width: 26px;
    padding: 0;
    margin-left: 3px;
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

  /* @media screen and (max-width: 1442px) {
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
      width: 100%!important;
      padding: 0 0 5vh 0;
      transition: 0s;
      margin: 0!important;
    }
    .comment{
      display: block;
    }

    .close{
      margin: 7.5vh 0 4px 0;
      font-size: 1.5rem;
    }
  }

  @media screen and (max-width: 420px) {
    .profile{
      padding: 0 2vw 1.5vh 2vw;
    }

    .caption > h4{
      padding: 1px;
    }

    .input::before{
      content: "";
    }

    #pushNew{
      width: 75vw;
    }

    .push{
      margin: 0 1.5%;
    }
  } */
</style>
