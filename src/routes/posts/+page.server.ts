import db from '$lib/server/db'
import type { PageServerLoad } from './$types'
import { postOfFeedSelect } from '$lib/data'
import type { Rating } from '@prisma/client'

export const load: PageServerLoad = async ({ params, url }) => {
  const isFeatured = url.searchParams.get('featured') === 'true'

  const tagsFilter = url.searchParams.get('tags')?.split(',') ?? undefined
  const searchQuery = url.searchParams.get('search') ?? undefined
  const ratingFilter = url.searchParams.get('rating') ?? undefined
  const sortFilter = url.searchParams.get('sort') ?? undefined

  const title = isFeatured ? 'Featured Posts' : 'Browse Everything'
  const description = isFeatured
    ? 'Hand-picked by our maintainers, these are what we consider must-reads.'
    : 'Browse all of our posts, from the latest to the oldest.'

  // returns false if tagsFilter is empty or ['']
  const hasTags = tagsFilter?.length && tagsFilter[0] !== ''
  const hasSearch = searchQuery?.length
  const hasRating = ratingFilter?.length && ['s', 't', 'm', 'e'].includes(ratingFilter[0] as Rating)

  // get tags in url query
  const tags = hasTags ? await db.tag.findMany({
    where: {
      name: {
        in: tagsFilter ?? [],
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
        },
      }
    }
  }) : []

  // get posts
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      published: true,
      featured: isFeatured ? true : undefined,
      title: hasSearch ? {
        contains: searchQuery,
      } : undefined,
      tags: (hasTags && tags?.length) ? {
        some: {
          name: {
            in: tags.map(tag => tag.name),
          }
        }
      } : undefined,
      rating: hasRating ? {
        in: ratingFilter,
      } : undefined,
    },
    select: {
      ...postOfFeedSelect,
    },
  })

  return {
    props: {
      title,
      isFeatured,
      description,
    },
    page: {
      title,
      description,
    },
    tags,
    posts,
  }
}
