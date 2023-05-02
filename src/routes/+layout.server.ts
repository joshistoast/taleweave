export async function load({ locals }) {
  const { user } = await locals.auth.validateUser()

  const title = 'Taleweave'
  const description = 'An open-source, and easy to use platform for writers and authors alike to share their stories and works of literature freely. On this platform you as an author can create an account, write your stories, and publish them for the world to see and appreciate. Dustbunny is by writers, for writers.'

  return {
    user,
    app: {
      title,
      description,
    },
    page: {},
  }
}
