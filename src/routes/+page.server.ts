import type { Actions, PageServerLoad } from './$types'
import { prisma } from '$lib/server/prisma'
import { error, fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  return {
    // return all posts with newest first
    posts: await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
  }
}

export const actions: Actions = {

  createPost: async ({ request }) => {
    const { content } = Object.fromEntries(await request.formData()) as {
      content: string
    }

    if (!content) return fail(400, { message: 'Content is required' })

    await prisma.post.create({
      data: {
        content,
      }
    })
      .catch(err => {
        console.error(err)
        return fail(500, { message: 'Something went wrong' })
      })
      .then(res => {
        return {
          status: 201,
        }
      })
  }

}
