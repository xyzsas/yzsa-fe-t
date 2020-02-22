export default {
  // 任务类型string: 任务类型描述
  type: {
    'Notice': '通知',
    'CourseSelect': '选课',
    'Form': '问卷'
  },
  // 任务信息示例
  infoExample: {
    'Notice': {
      'content': '此处填写通知的内容',
      'readTime': 5
    },
    'CourseSelect': {
      'lesson1': 50,
      'lesson2': 60,
      'and so on': 70
    },
    'Form': {
      '1': {
        'type': 'choose',
        'question': '选择题问题描述',
        'choice': {
          'A': 'apple',
          'B': 'banana'
        },
        'min': 1,
        'max': 2
      },
      '2': {
        'type': 'fill',
        'question': '填空题问题描述',
        'max': 1000
      }
    }
  },
  // 任务信息生成工具
  infoGenerator: {
    'Notice': () => import('../components/infoGenerator/Notice'),
    'CourseSelect': () => import('../components/infoGenerator/CourseSelect'),
    'Form': () => import('../components/infoGenerator/Form')
  }
}
