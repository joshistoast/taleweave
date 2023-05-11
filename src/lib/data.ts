
// Post counts
export const countsOfPost = {
  _count: {
    select: {
      bookmarks: true,
    }
  }
}

// Select all relevant data for tags on a post
export const tagsOfPostSelect = {
  tags: {
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    }
  }
}

// Select all relevant author data
export const authorOfPostSelect = {
  author: {
    select: {
      id: true,
      username: true,
      displayName: true,
    }
  },
}

// Selects all relevant data for post feed pages
export const postOfFeedSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  description: true,
  featured: true,
  rating: true,
  ...authorOfPostSelect,
  ...countsOfPost,
  ...tagsOfPostSelect,
}

// Selects all relevant data for post pages
export const postOfPageSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  description: true,
  featured: true,
  rating: true,
  content: true,
  ...authorOfPostSelect,
  ...countsOfPost,
  ...tagsOfPostSelect,
}
