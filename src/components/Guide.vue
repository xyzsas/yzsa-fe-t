<template>
  <div>
    <h2>任务信息模板</h2>
    <p>需要满足JSON格式，可使用编辑工具或参考例子。</p>

    <h3>通知 Notice</h3>
    <ul>
      <li><strong>content</strong>(字符串)，通知内容，支持HTML</li>
      <li><strong>readTime</strong>(数字)，最短阅读时间秒数</li>
    </ul>
    <pre>
      例子：
      {
        "content": "这是一个通知，支持HTML代码",
        "readTime": 10
      }
    </pre>

    <h3>选课 CourseSelect</h3>
    <p>注意：学生不能在同一个任务中两次选择同样的课程。</p>
    <ul>
      <li><strong>课程名称</strong>(数字)，课程名额，每行对应一个课程</li>
    </ul>
    <pre>
      例子：
      {
        "课程名1": 30,
        "课程名2": 50,
        "课程名3": 100
      }
    </pre>

    <h3>问卷 Form</h3>
    <ul>
      <li><strong>题目标号</strong>(题目对象)
        <ul>
          <li><strong>question</strong>(字符串)，问题</li>
          <li><strong>type</strong>(字符串)，choose（代表选择题）或者fill（代表填空题）</li>
          <li><strong>max</strong>(数字)，在填空题中表示最多填写字数，在选择题中表示最多选择的答案数量</li>
          <li><strong>min</strong>(数字)，只在选择题中使用，表示最少选择的答案数量</li>
          <li><strong>choice</strong>(选项对象)，只在选择题中使用，以标号对应内容的方式</li>
        </ul>
      </li>
    </ul>
    <pre>
      例子：
      {
        "1": {
          "question": "你最喜欢的水果是（这是一道单选题）",
          "type": "choose",
          "max": 1,
          "min": 1,
          "choice": {
            "A": "苹果",
            "B": "香蕉",
            "C": "西红柿",
            "D": "梨"
          }
        },
        "2": {
          "question": "你为什么喜欢这种水果（这是一道填空题）",
          "type": "fill",
          "max": 100,
        },
        "3": {
          "question": "你喜欢上的课有（这是一道多选题）",
          "type": "choose",
          "max": 5,
          "min": 1,
          "choice": {
            "A": "语文",
            "B": "数学",
            "C": "英语",
            "D": "物理",
            "E": "化学"
          }
        }
      }
    </pre>
  </div>
</template>

<script>
  export default {
    name: "Guide"
  }
</script>

<style scoped>
  
</style>