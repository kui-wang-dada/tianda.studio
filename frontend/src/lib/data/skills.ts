export interface SkillGroup {
  title: { zh: string; en: string }
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    title: { zh: '前端 / Frontend', en: 'Frontend' },
    items: ['React · Next.js', 'Vue · Nuxt', 'RN · Flutter', 'Tailwind · Lingui'],
  },
  {
    title: { zh: '后端 / Backend', en: 'Backend' },
    items: ['FastAPI · NestJS', 'Node · Express', 'Postgres · Redis', 'Docker · Nginx'],
  },
  {
    title: { zh: 'AI / LLM', en: 'AI / LLM' },
    items: ['Claude · OpenAI', 'LangChain · RAG', 'MCP · Agents', 'Pinecone'],
  },
  {
    title: { zh: 'NFT', en: 'NFT' },
    items: ['NFT 协议 · IPFS', '多链铸造发行', '自建 / OpenSea 市场', 'EVM 合约对接'],
  },
]
