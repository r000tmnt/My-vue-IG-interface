<template style="position: relative">
<div id="noMention" v-if="Object.keys($parent.media_mentions).length === 0">
  <h1>有標記的相片會顯示在這裡</h1>
</div>

<div id="mentioned">
  
</div>
  
</template>

<script>
//Object.keys(objectname).length  Check if the object is empty
export default {
  name: 'displayMention',
  props: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#noMention{
  position: relative;
}

#noMention > h1{
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  margin-top: 20vh;
}
</style>