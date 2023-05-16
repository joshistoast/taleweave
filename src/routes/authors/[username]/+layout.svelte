<script lang="ts">
import { page } from '$app/stores'
import type { LayoutServerData } from './$types'
import Tab from '$lib/components/common/Tab.svelte'
import Tabs from '$lib/components/common/Tabs.svelte'

export let data: LayoutServerData

$: user = $page.data.user
$: username = $page.params.username
$: ({ pathname } = $page.url)
$: ({ author } = data)

type AuthorNav = {
  label: string
  href: string
  show?: () => boolean | boolean
}
let nav: AuthorNav[] = []
$: nav = [
  {
    label: 'About',
    href: `/authors/${username}`,
  },
  {
    label: 'Posts',
    href: `/authors/${username}/posts`,
  },
  {
    label: 'Bookmarks',
    href: `/authors/${username}/bookmarks`,
    show: () => user?.userId === author?.id,
  },
  {
    label: 'Scored',
    href: `/authors/${username}/scored`,
    show: () => user?.userId === author?.id,
  },
  {
    label: 'Preferences',
    href: `/authors/${username}/preferences`,
    show: () => user?.userId === author?.id,
  },
  {
    label: 'Log Out',
    href: '/logout',
    show: () => user?.userId === author?.id,
  }
]
</script>

<div class="p-4">
  <h1 class="font-serif text-lg font-bold lg:text-4xl">{author.displayName}</h1>
  <p class="text-sm text-gray-500">{author.username}</p>
</div>

<Tabs selected={ +nav.indexOf(nav.find(({ href }) => href === pathname)) }>
  {#each nav as { label, href, show }}
    {#if show === undefined || show()}
      <Tab {href} {label} selected={href === pathname} />
    {/if}
  {/each}
</Tabs>

<slot />
