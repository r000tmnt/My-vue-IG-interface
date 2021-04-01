<template style="position: relative">
<div class="modal" :style="{'margin-top' : scrollY}">
  <div id="forCenter">
    <button class="close" @click="closeModal()">X</button>
    <div style="clear: both"></div>

      <main class="forFlex flex" v-if="clickedMedia" :style="{'height': windowHeight - 125 + 'px'}">
        <div id="view">
          <img id="pic" @load="checkToolarge()" ref="ifToolarge" :style="{'width': ifToolarge.setValue}" :src="clickedMedia.media_url" alt="not found">
        </div>

        <div id="info">
            <div class="caption text-align">
              {{clickedMedia.caption}}
              <small>{{clickedMedia.timestamp}}</small>
            </div>

            <div class="subInfo flex">
              <div class="likes">{{clickedMedia.like_count}}個讚</div>
                &nbsp;&nbsp;
              <div class="comments_count">{{clickedMedia.comments_count}}個留言</div>
            </div>

            <div class="comments">
              <div class="input">
                <textarea id="pushNew" placeholder="留言" v-model="newComment" @keyup.enter="textAreaResize()"></textarea>
                <button class="push">
                  <img src="../assets/sent.png" alt="Not found" @click="pushComment()">
                </button>
              </div>

                <div id="noComment" class="text-align" v-if="theMediaComment.length === 0">
                  {{noComment.message}}
                </div>

                <div class="comment_list" v-else>
                  <section>
                      <transition-group name="comments">
                      <div class="vistor" v-for="(comment, index) in theMediaComment" :key="comment.id">
                          <div class="comment">
                            <button class="del" @click="deleteComment(comment, index)">X</button>
                            <h4>{{comment.username}}: {{comment.text}}</h4>
                            <small>{{comment.timestamp}}</small>
                          </div>                      
                      </div>
                      </transition-group>
                  </section>
              </div>                
            </div>
        </div>

        <div id="seeMore">
            <a class="profile flex" @click="closeModal()">
              <img :src="basic.profile_picture_url" alt="">
              <span>{{basic.username}}</span>
            </a>

            <ul class="otherPics" :style="{'height': windowHeight - 195 + 'px'}">
              <li class="pic" v-for="(post, index) in media_posts" :key="post.id">
                <img :src="post.media_url" alt="Not found" @click="clickedMedia_change(index)">
              </li>
            </ul>
        </div>
      </main>
  </div>
</div>
 
</template>

<script>
export default {
  name: 'viewPics',
  data(){
    return{
      noComment:{message: '尚無留言，搶個頭香吧。'},
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      ifToolarge : {
        height: null,
        setValue: '',
      },
      imgLoad: false,
      newComment: '',
      autoResize: 20,
      handler: {
      isViewing: false,
      addClass: true,
      }
    }
  },
  computed:{
    clickedMedia(){
      return this.$store.getters.getClickedMedia
    },
    theMediaComment(){
      return this.$store.state.theMediaComment
    },
    media_posts(){
      return this.$store.state.media_posts
    },
    scrollY(){
      return this.$store.state.scrollY
    },
    basic(){
      return this.$store.state.basic
    }
  },
  methods: {
    checkToolarge(){
        this.imgLoad = true;
        this.ifToolarge.height = this.$refs.ifToolarge.offsetHeight
        if(this.ifToolarge.height > this.windowHeight && this.windowHeight === 760){
          this.ifToolarge.setValue = 606 + 'px';
          this.checkWindow();
        }     
        else if(this.ifToolarge.height > this.windowHeight){
          this.ifToolarge.setValue = 720 + 'px';
          this.checkWindow();
        }else{
          this.ifToolarge.setValue = '';
        }
    },

    checkWindow(){
      this.windowWidth = window.innerWidth;
      if(this.windowWidth < 950){
        this.ifToolarge.setValue = 100 + 'vw';
      }
    },

    textAreaResize(){
      this.autoResize = this.autoResize+20;

      if(this.autoResize > 60){ //Limit
        this.autoResize = 60
      }
    },
    
    pushComment(){
      var Needed = {id: this.clickedMedia.id, message: this.newComment}
      if(this.newComment !== ''){ //Make sure there's something to push
        this.$store.dispatch('pushComment', Needed);
        this.newComment = ''; //Clear 
        this.clickedMedia.comments_count++;
        this.noComment.message = '請稍後。'
      }
    },

    deleteComment(comment, index){
      let ask = confirm('您希望刪除 '+comment.text+' 這個留言嗎?')
       var Needed = {comment: comment, index: index}
      if(ask){
        this.$store.dispatch('deleteComment', Needed)
        this.clickedMedia.comments_count--;
        this.noComment.message = '尚無留言，搶個頭香吧。'
      }
    },

    closeModal(){
      //Remember to clear comments 
      this.$store.commit('clearComment')
      this.$emit('close', this.handler);
    },

    clickedMedia_change(index){
      this.ifToolarge.setValue = '';
      this.$store.commit('clearComment')
      this.$emit('changePic', index);
    }
  },
  updated(){  
    if(this.theMediaComment.length > 0){
      this.$store.commit('convertTime', this.theMediaComment);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .comments-enter-active, .comments-leave-active{/* vue transition classes */ 
    transition: all 1s ease;
  }

  .comments-enter-from, .comments-leave-to{/* vue transition classes */ 
    opacity: 0;
    transform: translateY(30px);
  }

  .tooLarge{
    width: 720px!important;
  }
  
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
    width: 100vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }

  #view{
    background-color: black;
  }

  #view > img{
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    top: 50%;
    left: 50%;
    position: relative;
    transform: translate(-50%, -50%);
  }

  #info{
    width: 28vw;
    padding-top: 1vh;
    background-color: #232;
    color:#fff;
  }

  .caption > small{
    opacity: 0.5;
  }

  .profile{
    /* border: 1px solid blue; */
    padding: 3.5%;
    justify-content: flex-start;
    text-decoration: none;
    color: white;
    cursor: pointer;
  }

  .profile > span{
    /* border: 1px solid red; */
    display: inline-block;
    font-size: 1rem;
    margin: 0.7vw;
  }

  .profile > img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .close{
    background: none;
    border: 1px solid;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    float: right;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 1%;
    color: white ;
    position: relative;
    z-index: 2;
    opacity: 0.5;
  }

  .close:hover{
    background: #232;
    opacity: 1;
    transition: 0.5s;
  }

  .close:focus{
    outline: none;
  }

  .subInfo{
    padding: 2% 0 1.5% 0;
    border-bottom: 1px solid #fff;
    color: rgba(255, 255, 255, 0.5);
  }

  #noComment{
    margin-top: 10px;
  }

  .comments{
    padding: 13px
  }

  .comment{
    padding: 2%;
    background-color: #1e1f1e;
    border-radius: 10px;
    margin: 10px;
  }

  .comment:hover{
    background: rgb(61 66 61);
    transition: 0.5s;
  }


  .comment > h4{
    margin: 0;
    border: 1px solid rgba(34, 51, 34, 0);
  }

  .comment > small{
    opacity: 0.5;
    display: inline-block;
  }

  .input{
    text-align: center;
  }

  #pushNew{
    border: none;
    resize: none;
    transition: 0s ease-in-out;
    width: 210px;
    height: 20px;
    background-color: #1e1f1e;
    color: white;
  }

  #pushNew:focus{
    outline: none;
  }
  
  .push{
    background: none;
    border: none;
    width: 24px;
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

  #seeMore{
    /* border: 1px solid red; */
    background-color: #232;
  }

  .otherPics{
    margin-bottom: 0;
    padding: 0 4%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .otherPics::-webkit-scrollbar{ /* -webkit-scroll access scroll bar style */ 
    width: 12px;
  }

  .otherPics::-webkit-scrollbar-track{ /* scrollbar track */
    background-color: rgba(255, 255, 255, 0.5);
  }

  .otherPics::-webkit-scrollbar-thumb{ /* scrollbar handel */
    background-color: #1e1f1e;
  }

  .otherPics > .pic{
    list-style: none;
    margin: 5px 0;
  }

  .pic > img{
    width: 167px;
    height: 167px;
    object-fit: cover;
    cursor: pointer;
    border-radius:  10px;
    opacity: 0.7;
  }

  .pic > img:hover{
    opacity: 1;
    transition: opacity .1s ease;
  }

  @media screen and (max-width: 1081px){
     #pushNew{
       width: auto;
     }
   }

  @media screen and (max-width: 963px){
     #pushNew{
       width: 131px;
     }
   }

  @media screen and (max-width: 950px) {
    .modal{
      width: auto;
      overflow: scroll;
      overflow-x: hidden;
    }
    
    .forFlex{ /* Switch to portrait, disable various positioning for proper dispaying  */
      flex-direction: column;
      width: auto;
      height: unset!important;
      top: unset;
      left: unset;
      transform: unset;
    }

    .caption{
      padding: 2%;
    }

    .subInfo{
      padding-top: 0;
    }

    #view{
      transition: all 0.5s ease;
      width: unset; 
      margin: 0 auto;
      margin: -4.5vh 0 -5px 0;
    }

    #view > img{
      transform: unset;
      top: 0;
      left: 0;
      width: 100vw
    }

    #info{
      width: 100vw;
    }

    #pushNew{
       width: 51vw;
     }

    .profile{
      display: inline-flex;
    }

    .profile > span{
      margin: 10.5px 0 0 5px;
    }
    
    .otherPics{
      width: 95vw;
      height: unset!important;
      overflow-y: unset;
      overflow-x: scroll;
      white-space: nowrap;
    }

    .otherPics > .pic{
      display: inline-block;
      margin: 0 5px;
    }
  }

  @media screen and (max-width: 420px) {
    #forCenter{
      margin-top: 4vh;
    }

    #view{
      width: 100vw;
    }
  } 
</style>