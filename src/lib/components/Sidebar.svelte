<script lang="ts">
import Icon from '@iconify/svelte'
import { page } from '$app/stores'
import { sidebarOpen } from '$lib/stores'

$: user = $page.data.user
$: path = $page.url.pathname + $page.url.search

let sidebarState: boolean

sidebarOpen.subscribe(v => sidebarState = v)
const closeSidebar = () => sidebarOpen.set(false)

type SidebarItemBase = {
  type: 'link' | 'heading',
  label: string,
  show?: () => boolean | boolean
}
type SidebarLink = SidebarItemBase & {
  type: 'link',
  href: string,
  icon?: string,
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
      type: 'link',
      label: 'Write',
      href: '/posts/new',
      icon: 'fluent:add-24-filled',
      show: () => !!user,
    }
  ],
  [
    {
      type: 'link',
      label: 'Featured',
      href: '/posts?featured=true',
      icon: 'fluent:flash-24-filled',
    },
    {
      type: 'link',
      label: 'Browse',
      href: '/posts',
      icon: 'fluent:compass-northwest-24-filled',
    },
  ],
  [
    {
      type: 'link',
      label: user?.displayName || user?.username || 'Profile',
      href: `/authors/${user?.username}`,
      icon: 'fluent:person-24-filled',
      show: () => !!user,
    },
    {
      type: 'link',
      label: 'Log In / Sign Up',
      href: '/login',
      icon: 'fluent:person-key-20-filled',
      show: () => !user,
    },
    {
      type: 'link',
      label: 'Log Out',
      href: '/logout',
      icon: 'fluent:sign-out-24-filled',
      show: () => !!user,
    },
  ],
]
</script>

<div class="grid">

  <div class="flex items-center justify-between p-2">
    <span class="py-2 pl-3 font-bold">Dustbunny.</span>
    <button on:click={closeSidebar} class="p-3 rounded-md hover:bg-white/10 lg:hidden">
      <Icon icon="fluent:dismiss-24-filled" class="w-5 h-5" />
    </button>
  </div>

  <!-- <h1 class="px-4 pt-6 text-2xl font-bold">Dustbunny.</h1> -->

  <nav class="grid px-2">
    {#each tree as group}
      <div class="grid gap-1 py-3">
        {#each group as item}
          {#if item.show === undefined || item.show()}
            {#if item.type === 'heading'}
              <span class="px-2 text-xs font-bold text-gray-500 uppercase">{ item.label }</span>
            {:else if item.type === 'link'}
              <a
                class="
                  text-sm px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10
                  { item.href === path ? 'text-orange-300' : 'text-gray-400 hover:text-gray-100' }
                "
                href={item.href}
              >
                {#if item.icon}
                  <Icon icon={item.icon} class="w-5 h-5" />
                {/if}
                <span>
                  { item.label }
                </span>
              </a>
            {/if}
          {/if}
        {/each}
      </div>
    {/each}
  </nav>
</div>
