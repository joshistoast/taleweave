<script lang="ts">
import { page } from '$app/stores'

$: user = $page.data.user
$: path = $page.url.pathname + $page.url.search

type SidebarItemBase = {
  type: 'link' | 'heading',
  label: string,
  show?: () => boolean | boolean
}
type SidebarLink = SidebarItemBase & {
  type: 'link',
  href: string,
}
type SidebarHeading = SidebarItemBase & {
  type: 'heading',
}
type SidebarItem = SidebarLink | SidebarHeading
type SidebarGroup = SidebarItem[]

let tree: SidebarGroup[] = []
$: tree = [
  [
    {
      type: 'heading',
      label: 'Explore',
    },
    {
      type: 'link',
      label: 'Featured',
      href: '/posts?featured=true'
    },
    {
      type: 'link',
      label: 'Browse',
      href: '/posts'
    },
    {
      type: 'link',
      label: 'Following',
      href: '/posts?following=true',
    }
  ],
  [
    {
      type: 'link',
      label: 'Log In',
      href: '/login',
      show: () => !user,
    },
    {
      type: 'link',
      label: 'Register',
      href: '/register',
      show: () => !user,
    },
    {
      type: 'link',
      label: 'Log Out',
      href: '/logout',
      show: () => !!user,
    },
    {
      type: 'link',
      label: 'Profile',
      href: `/authors/${user?.username}`,
      show: () => !!user,
    },
  ],
  [
    {
      type: 'link',
      label: '+ Start Writing',
      href: '/posts/new',
      show: () => !!user,
    }
  ],
]
</script>

<div class="grid">

  <h1 class="text-4xl font-bold px-7 py-3">Dusty</h1>

  <nav class="grid p-4">
    {#each tree as group}
      <div class="grid gap-1 border-b border-gray-800 last:border-transparent py-2">
        {#each group as item}
          {#if item.show === undefined || item.show()}
            {#if item.type === 'heading'}
              <span class="text-xs px-3 font-bold uppercase text-gray-500">{ item.label }</span>
            {:else if item.type === 'link'}
              <a
                class="
                  text-sm font-bold px-3 py-2 rounded-md
                  { item.href === path ? 'text-emerald-300 bg-gray-800' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-900' }
                "
                href={item.href}
              >{ item.label }</a>
            {/if}
          {/if}
        {/each}
      </div>
    {/each}
  </nav>
</div>
