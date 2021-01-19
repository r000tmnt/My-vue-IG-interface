<template>
<div id="noStory" v-if="Object.keys($parent.media_stories).length === 0">
  <h1>抱歉。 目前沒有24小時內的限時動態。</h1>
</div>
  
</template>

<script>
//Object.keys(objectname).length  Check if the object is empty
export default {
  name: 'displayStories',
  props: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>