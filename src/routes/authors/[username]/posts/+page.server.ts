import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent, fetch }) => {
  const { username } = params
  const { posts } = await (await fetch(`/api/posts?author=${username}`)).json()

  const { author } = await parent() // author data returned from parent layout

  return {
    posts,
    page: {
      title: `Posts by ${author.displayName}`,
      description: `Browse through all posts by ${author.displayName} on Taleweave`,
    },
  }
}
