export interface ContactChannel {
  name: { zh: string; en: string }
  handle: string
  url: string
  icon: string
}

export const contactChannels: ContactChannel[] = [
  {
    name: { zh: 'Email', en: 'Email' },
    handle: '872505550@qq.com',
    url: 'mailto:872505550@qq.com',
    icon: '✉',
  },
  {
    name: { zh: 'Upwork', en: 'Upwork' },
    handle: 'Kevin · 100% JS',
    url: 'https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1',
    icon: '✦',
  },
  {
    name: { zh: 'GitHub', en: 'GitHub' },
    handle: 'kui-wang-dada',
    url: 'https://github.com/kui-wang-dada',
    icon: '⌥',
  },
  {
    name: { zh: '哔哩哔哩', en: 'Bilibili' },
    handle: 'UID xxx',
    url: 'https://space.bilibili.com/',
    icon: '▶',
  },
  {
    name: { zh: '抖音', en: 'Douyin' },
    handle: '@tianda',
    url: '#douyin',
    icon: '🎵',
  },
  {
    name: { zh: '微信公众号', en: 'WeChat 公众号' },
    handle: '添达工作室',
    url: '#wechat',
    icon: '📓',
  },
  {
    name: { zh: '小红书', en: 'Xiaohongshu' },
    handle: '@tianda',
    url: '#redbook',
    icon: '📕',
  },
]
