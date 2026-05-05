import {
  getFeaturedProducts,
  getFeaturedWork,
  getNovels,
  getRecentNovels,
  getRecentWriting,
  getWriting,
} from '@/lib/content'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { UpworkSection } from '@/components/sections/UpworkSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { WritingSection } from '@/components/sections/WritingSection'
import { FeedbackSection } from '@/components/sections/FeedbackSection'

export default function HomePage() {
  const featuredWork = getFeaturedWork(5)
  const featuredProducts = getFeaturedProducts(6)
  const recentArticles = getRecentWriting(4)
  const articlesTotal = getWriting().length
  const recentNovelItems = getRecentNovels(4)
  const novelsTotal = getNovels().length

  return (
    <>
      <HeroSection />
      <ProjectsSection items={featuredWork} />
      <UpworkSection />
      <ProductsSection items={featuredProducts} num="03" />
      <ExperienceSection />
      <SkillsSection />
      <WritingSection
        articles={recentArticles}
        articlesTotal={articlesTotal}
        novels={recentNovelItems}
        novelsTotal={novelsTotal}
        num="06"
      />
      <FeedbackSection />
    </>
  )
}
