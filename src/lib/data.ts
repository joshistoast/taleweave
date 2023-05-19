import type { Prisma } from '@prisma/client'

// Post counts
export const countsOfPost: Prisma.PostSelect = {
  _count: {
    select: {
      bookmarks: true,
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

// Selects all relevant data for a post's page (not feed)
export const postOfPageSelect: Prisma.PostSelect = {
  ...postOfFeedSelect,
  content: true,
}
