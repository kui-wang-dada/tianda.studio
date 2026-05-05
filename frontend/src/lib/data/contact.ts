export interface ContactChannel {
  name: { zh: string; en: string }
  handle: string
  url: string
  icon: string
}

export const contactChannels: ContactChannel[] = [
  {
    name: { zh: 'Email', en: 'Email' },
    handle: 'kui.wang.upwork@gmail.com',
    url: 'mailto:kui.wang.upwork@gmail.com',
    icon: '✉',
  },
  {
    name: { zh: 'Upwork', en: 'Upwork' },
    handle: 'Kevin Wang · 100% JS',
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
    name: { zh: 'X / Twitter', en: 'X / Twitter' },
    handle: '@kuiwangdev',
    url: 'https://x.com/kuiwangdev',
    icon: '𝕏',
  },
  {
    name: { zh: '哔哩哔哩', en: 'Bilibili' },
    handle: 'UID xxx',
    url: 'https://space.bilibili.com/',
    icon: '▶',
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
    icon: '📓',
  },
  {
    name: { zh: 'RSS', en: 'RSS' },
    handle: '/feed.xml',
    url: '/feed.xml',
    icon: '⌘',
  },
]
