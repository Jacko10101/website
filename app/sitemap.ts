import { MetadataRoute } from 'next'
import { featuredProjects } from '@/lib/projects'
import { BUILD } from '@/lib/build-info'

// Case-study entries are derived from lib/projects.ts rather than listed here.
// They used to be hand-maintained, which meant a new case study shipped
// invisible to search until someone remembered this file.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.devlinops.com'
  // The last commit's time, which is when anything here last changed.
  // `new Date()` stamped every entry with the build clock, which is noise.
  const currentDate = BUILD.time ? new Date(BUILD.time) : new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...featuredProjects.map((project) => ({
      url: `${baseUrl}${project.href}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // The CV is a real destination people link to and search for directly.
    {
      url: `${baseUrl}/cv.pdf`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
