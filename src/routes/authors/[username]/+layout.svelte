<script lang="ts">
import { page } from '$app/stores'

$: ({ pathname } = $page.url)

const { username } = $page.params

const nav = [
  {
    label: 'About',
    href: `/authors/${username}`,
  },
  {
    label: 'Posts',
    href: `/authors/${username}/posts`,
  }
]
</script>

<div class="p-4">
  <h1 class="text-lg font-bold lg:text-4xl">{username}</h1>
</div>

<nav class="flex items-center border-b border-gray-800">
  {#each nav as { label, href }}
    <a
      href={href}
      class="py-3 px-4 border-b text-sm hover:bg-gray-900 {pathname === href ? 'text-orange-300 border-orange-300' : 'border-transparent'}"
    >
      {label}
    </a>
  {/each}
</nav>

<div>
  <slot />
</div>
