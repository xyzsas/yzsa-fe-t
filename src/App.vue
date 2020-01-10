<template>
  <router-view/>
</template>

<script>
  import debug from './debug'
  export default {
    mounted() {
      // debug.login('420222200408197251', '420222200408197251');
      // debug.login('zmc', 'zmc');
      debug.login('admin', 'admin');
    }
  }
</script>
