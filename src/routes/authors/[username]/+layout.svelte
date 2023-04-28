<script lang="ts">
import { page } from '$app/stores'
import type { LayoutServerData } from './$types'

$: ({ pathname } = $page.url)
$: user = $page.data.user

export let data: LayoutServerData

const { username } = $page.params
const { author } = data

type AuthorNav = {
  label: string
  href: string
  show?: () => boolean | boolean
}
const nav = [
  {
    label: 'About',
    href: `/authors/${username}`,
  },
  {
    label: 'Posts',
    href: `/authors/${username}/posts`,
  },
  {
    label: 'Preferences',
    href: `/authors/${username}/preferences`,
    show: () => user?.userId === author?.id,
  }
]
</script>

<div class="p-4">
  <h1 class="text-lg font-bold lg:text-4xl">{author?.displayName || username}</h1>
  {#if author?.displayName}
    <p class="text-sm text-gray-500">{author.username}</p>
  {/if}
</div>

<nav class="flex items-center border-b border-gray-800">
  {#each nav as { label, href, show }}
    {#if show === undefined || show()}
      <a
        href={href}
        class="py-3 px-4 border-b text-sm hover:bg-gray-900 {pathname === href ? 'text-orange-300 border-orange-300' : 'border-transparent'}"
      >
        {label}
      </a>
    {/if}
  {/each}
</nav>

<div>
  <slot />
</div>
