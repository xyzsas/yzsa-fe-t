<template>
  <a-layout style="margin-left: auto; margin-right: auto; min-width: 1056px;">
    <div style="background: #ffffff; margin: 16px 16px 0 16px; padding: 8px; font-size: 1.5em; max-width: 1024px;">
      {{ $store.state.pageTitle }}
    </div>
    <a-layout-content style="min-height: calc(100vh - 192px); padding: 16px;">
      <div style="background: #ffffff; padding: 16px; min-height: calc(100vh - 192px); max-width: 1024px;">
        <h1>江苏省扬州中学 学生事务系统管理中心</h1>
        <guide style="margin: 30px;"></guide>
      </div>
    </a-layout-content>
    <a-layout-footer style="padding: 0; height: 32px; line-height: 32px; text-align: center;">
      YZSA © 2020 ITI
    </a-layout-footer>
  </a-layout>
</template>

<script>
  import Guide from '../components/Guide';

  export default {
    components: {
      Guide
    }
  }
</script>