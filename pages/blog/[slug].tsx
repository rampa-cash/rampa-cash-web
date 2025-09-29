import Head from 'next/head'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getBlogPosts } from '@/lib/api'

interface BlogPost {
  slug: string
  title: {
    en: string
    es: string
  }
  excerpt: {
    en: string
    es: string
  }
  content: {
    en: string
    es: string
  }
  author: string
  publishedAt: string
  readTime: number
  category: 'remittances' | 'stablecoins' | 'financial-education' | 'rampa-guides'
  tags: {
    en: string[]
    es: string[]
  }
  featuredImage?: string
}

const BlogPost: NextPage<{ post: BlogPost }> = ({ post }) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { locale } = router

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Get content based on current locale
  const currentLocale = (locale as 'en' | 'es') || 'en'
  const title = post.title[currentLocale]
  const excerpt = post.excerpt[currentLocale]
  const content = post.content[currentLocale]
  const tags = post.tags[currentLocale]

  // Helper function to get category translation
  const getCategoryTranslation = (category: string) => {
    switch (category) {
      case 'financial-education':
        return t('blog.categories.financialEducation')
      case 'rampa-guides':
        return t('blog.categories.rampaGuides')
      case 'remittances':
        return t('blog.categories.remittances')
      case 'stablecoins':
        return t('blog.categories.stablecoins')
      default:
        return category
    }
  }

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(currentLocale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Simple markdown-to-HTML converter for basic formatting
  const formatContent = (content: string) => {
    return content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-4 mt-8 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-6 mt-10 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-8 text-gray-900">$1</h1>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Lists - handle bullet points
      .replace(/^\- (.*$)/gim, '<li class="mb-2 text-gray-700">$1</li>')
      // Paragraphs - split by double newlines
      .split('\n\n')
      .map(paragraph => {
        // If it's a list item, don't wrap in <p>
        if (paragraph.includes('<li')) {
          return `<ul class="list-disc list-inside mb-6 space-y-2">${paragraph}</ul>`
        }
        // If it's a header, don't wrap in <p>
        if (paragraph.includes('<h1') || paragraph.includes('<h2') || paragraph.includes('<h3')) {
          return paragraph
        }
        // Regular paragraph
        return `<p class="mb-6 text-gray-700 leading-relaxed">${paragraph}</p>`
      })
      .join('')
  }

  return (
    <>
      <Head>
        <title>{title} - RAMPA Blog</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-16 overflow-hidden">
          {/* Background Image */}
          {post.featuredImage && (
            <div className="absolute inset-0">
              <img 
                src={post.featuredImage} 
                alt={title}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-indigo-800/80"></div>
            </div>
          )}
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Category Badge */}
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                post.category === 'remittances' ? 'bg-blue-100 text-blue-800' :
                post.category === 'stablecoins' ? 'bg-green-100 text-green-800' :
                post.category === 'financial-education' ? 'bg-purple-100 text-purple-800' :
                'bg-indigo-100 text-indigo-800'
              }`}>
                {getCategoryTranslation(post.category)}
              </span>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">{title}</h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-lg opacity-90">
                <span>{post.author}</span>
                <span>•</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>•</span>
                <span>{post.readTime} {t('blog.minRead')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Back to Blog Link */}
              <Link 
                href="/blog" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('blog.backToBlog')}
              </Link>

              {/* Article Body */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Featured Image at Top of Article - ONLY ONE IMAGE */}
                {post.featuredImage && (
                  <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
                    <img 
                      src={post.featuredImage} 
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Article Content - REMOVED THE DUPLICATE IMAGE */}
                <div className="p-8 md:p-12">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                  />

                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t">
                      <h3 className="text-lg font-semibold mb-4">{t('blog.tags')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getBlogPosts()
  const locales = ['en', 'es']
  
  const paths = posts.flatMap((post) =>
    locales.map((locale) => ({
      params: { slug: post.slug },
      locale,
    }))
  )

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const posts = getBlogPosts()
  const post = posts.find((p) => p.slug === params?.slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default BlogPost