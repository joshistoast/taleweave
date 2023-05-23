import db from './db'
import type { Prisma, Post } from '@prisma/client'

// Post counts
export const countsOfPost: Prisma.PostSelect = {
  _count: {
    select: {
      bookmarks: true,
      comments: true,
    }
  }
}

// Select all relevant data for tags on a post
export const tagsOfPostSelect: Prisma.PostSelect = {
  tags: {
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          posts: true,
        }
      }
    }
  }
}

export const authorSelect: Prisma.AuthUserSelect = {
  id: true,
  username: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
  bio: true,
  _count: {
    select: {
      posts: { where: { published: true } },
    }
  },
}

// Select all relevant author data
export const authorOfPostSelect: Prisma.PostSelect = {
  author: {
    select: {
      id: true,
      username: true,
      displayName: true,
    }
  },
}

// Selects all relevant data for post feed pages
export const postOfFeedSelect: Prisma.PostSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  description: true,
  featured: true,
  published: true,
  rating: true,
  ...authorOfPostSelect,
  ...countsOfPost,
  ...tagsOfPostSelect,
}

// Selects all relevant comment data on a post
export const commentOfPostSelect: Prisma.CommentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  content: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
    }
  }
}

// Selects all relevant data for a post's page (not feed)
export const postOfPageSelect: Prisma.PostSelect = {
  ...postOfFeedSelect,
  content: true,
  comments: {
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      ...commentOfPostSelect,
    }
  }
}

/**
 * Given an ID, returns the post
 * @param id string
 * @returns Promise<Post | null>
 */
export const getPostById = async (id: string) => {
  return await db.post.findUnique({
    where: { id },
    select: {
      ...postOfPageSelect,
    }
  })
}

/**
 * Given a post ID and a user ID, returns whether the user has bookmarked the post
 * @param postId string
 * @param userId string
 * @returns boolean
 */
export const getBookmarkStatus = async (postId: string, userId: string) => {
  if (!userId) return false

  return await db.bookmark.findFirst({
    where: {
      postId,
      userId,
    },
  }).then((res) => !!res)
}

/**
 * Given a post ID and a user ID, returns what the user has scored the post
 * @param postId string
 * @param userId string
 * @returns number | null
 */
export const getUserScoreOnPost = async (postId: string, userId: string) => {
  if (!userId) return null

  return await db.score.findFirst({
    where: {
      postId,
      userId,
    },
  })
}

/**
 * Given a set of params, returns the number of posts that match the params
 * @param params Prisma.PostCountArgs
 * @returns Promise<number>
 */
export const getAllPostsCount = async (params: Prisma.PostCountArgs) => {
  return await db.post.count(params)
}

/**
 * Given a set of params, return all posts matching the params
 * @param params Prisma.PostFindManyArgs
 * @returns Promise<Post[]>
 */
export const getPosts = async (params: Prisma.PostCountArgs) => {
  return await db.post.findMany({
    ...params,
    select: {
      ...postOfFeedSelect,
    },
  })
}

/**
 * Given an array of tag names, returns all tags with additional data from the database that match
 * @param tags string[]
 * @returns Promise<Tag[]>
 */
export const resolveTags = async (tags: string[]) => {
  return await db.tag.findMany({
    where: {
      name: {
        in: tags.map((tag) => tag.toLowerCase()),
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
        }
      }
    }
  })
}

/**
 * Given a username, returns the author data
 * @param username string
 * @returns Promise<AuthUser>
 */
export const getAuthor = async (username: string) => {
  return await db.authUser.findUnique({
    where: { username },
    select: {
      ...authorSelect,
    },
  })
}
