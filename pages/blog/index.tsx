import Head from 'next/head'
import type { NextPage, GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getBlogPosts } from '@/lib/api' // Adjust the import based on your project structure

interface BlogPost {
  slug: string
  title: {
    [key: string]: string
  }
  excerpt: {
    [key: string]: string
  }
  content: string
  author: string
  publishedAt: string
  readTime: number
  category: 'remittances' | 'stablecoins' | 'financial-education' | 'rampa-guides'
  tags: {
    [key: string]: string[]
  }
  featuredImage?: string
}

const Blog: NextPage = () => {
  const { t } = useTranslation('common')
  const { locale } = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const blogPosts = getBlogPosts()
  const currentLocale = (locale as 'en' | 'es') || 'en'

  const categories = [
    { key: 'all', label: t('blog.categories.all') },
    { key: 'remittances', label: t('blog.categories.remittances') },
    { key: 'stablecoins', label: t('blog.categories.stablecoins') },
    { key: 'financial-education', label: t('blog.categories.financialEducation') },
    { key: 'rampa-guides', label: t('blog.categories.rampaGuides') }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <Head>
        <title>{t('blog.title')} - RAMPA</title>
        <meta name="description" content={t('blog.metaDescription')} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('blog.hero.title')}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {t('blog.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Featured Image */}
                  <div className="h-48 overflow-hidden">
                    {post.featuredImage ? (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title[currentLocale]}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm">Featured Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                      post.category === 'remittances' ? 'bg-blue-100 text-blue-800' :
                      post.category === 'stablecoins' ? 'bg-green-100 text-green-800' :
                      post.category === 'financial-education' ? 'bg-purple-100 text-purple-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {post.category === 'financial-education' 
                        ? t('blog.categories.financialEducation')
                        : post.category === 'rampa-guides'
                        ? t('blog.categories.rampaGuides') 
                        : t(`blog.categories.${post.category}`)
                      }
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600 transition-colors">
                        {post.title[currentLocale]}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4">{post.excerpt[currentLocale]}</p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime} {t('blog.minRead')}</span>
                      </div>
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">{t('blog.noPosts')}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default Blog