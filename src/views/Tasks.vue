<template>
  <a-layout>
    <div style="background: #ffffff; margin: 16px 16px 0 16px; padding: 8px; font-size: 1.5em;">
      {{ $store.state.pageTitle }}
    </div>
    <a-layout-content style="min-height: calc(100vh - 192px); padding: 16px;">
      <div style="background: #ffffff; padding: 16px; min-height: calc(100vh - 192px);">
      </div>
    </a-layout-content>
    <a-layout-footer style="padding: 0; height: 32px; line-height: 32px; text-align: center;">
      YZSA © 2020 ITI
    </a-layout-footer>
  </a-layout>
</template>

<script>
</script>
