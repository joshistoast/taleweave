import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
  let recentlyPublished
  let recentlyFeatured

  await Promise.all([
    fetch(`/api/posts?published&limit=3`).then((res) => res.json()).then((res) => recentlyPublished = res.posts),
    fetch(`/api/posts?featured&limit=3`).then((res) => res.json()).then((res) => recentlyFeatured = res.posts),
  ])

  return {
    recentlyPublished,
    recentlyFeatured,
  }
}
