import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, fetch }) => {
  const isFeatured = url.searchParams.get('featured') === 'true'

  const title = isFeatured ? 'Featured Posts' : 'Browse Everything'
  const description = isFeatured
    ? 'Hand-picked by our maintainers, these are what we consider must-reads.'
    : 'Browse all of our posts, from the latest to the oldest.'

  const queryString = url.searchParams.toString()
  const { tags, posts } = await (await fetch(`/api/posts?${queryString}`)).json()

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
