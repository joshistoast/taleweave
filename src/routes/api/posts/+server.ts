import { type RequestHandler, error } from '@sveltejs/kit'
import db from '$lib/server/db'
import type { AgeRating, Prisma } from '@prisma/client'
import { postOfFeedSelect } from '$lib/data'

export const GET: RequestHandler = async ({ url, locals }) => {
  // session
  const { user } = await locals.auth.validateUser()

  // search params
  const featured = url.searchParams.get('featured') === 'true'
  const tags = url.searchParams.get('tags')?.split(',') ?? undefined
  const searchQuery = url.searchParams.get('search') ?? undefined
  const ageRatings = url.searchParams.get('ratings')?.split(',').filter((r) => r !== '') as AgeRating[] ?? undefined
  const author = url.searchParams.get('author') ?? undefined
  // pagination params
  const limit = parseInt(url.searchParams.get('limit') ?? '10')
  const page = parseInt(url.searchParams.get('page') ?? '1')

  const skip = (page - 1) * limit
  const hasTags = tags?.length && tags[0] !== ''
  const hasSearch = searchQuery?.length && searchQuery !== ''
  const hasRating = !!ageRatings?.length
  const hasAuthor = author?.length && author !== ''

  // post sorting and filtering
  const postFindOperation: Prisma.PostCountArgs = {
    // TODO: `publishedAt` should be used instead of `createdAt` when it's implemented
    orderBy: {
      createdAt: 'desc', // TODO: sorting options
    },
    where: {
      // return unpublished posts if user is admin or author and author is specified in query
      published: (hasAuthor ? (user?.role === 'admin' || user?.username === author): false) ? undefined : true,
      featured: featured ? true : undefined,
      ...(hasTags && { tags: { some: { name: { in: tags.map(tag => tag.toLowerCase()) } } } }),
      ...(hasRating && { rating: { in: ageRatings } }),
      ...(hasAuthor && { author: { username: author } }),
      // it's not full text search but it's good enough for now
      ...(hasSearch ? {
        OR: [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
          { content: { contains: searchQuery } },
          { tags: { some: { name: { contains: searchQuery } } } },
        ],
      } : undefined),
    },
    skip,
    take: limit,
  }

  // get total posts count with filters
  const totalPostsCount = await db.post.count({
    ...postFindOperation,
  })

  // get posts
  const posts = await db.post.findMany({
    ...postFindOperation,
    select: {
      ...postOfFeedSelect,
    },
  })
    .then((res) => {
      return res
    })
    .catch((err) => {
      throw error(500, { message: err.message })
    })

  const size = posts.length
  const hasNextPage = totalPostsCount > skip + limit
  const hasPreviousPage = skip > 0

  return new Response(JSON.stringify({
    posts,
    pagination: {
      size,
      page,
      total: totalPostsCount,
      hasNextPage,
      hasPreviousPage,
    },
  }))
}
