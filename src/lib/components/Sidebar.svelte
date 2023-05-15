<script lang="ts">
import Icon from '@iconify/svelte'
import Brand from '$lib/components/Brand.svelte'
import { page } from '$app/stores'
import { sidebarOpen } from '$lib/stores'

$: user = $page.data.user
$: path = $page.url.pathname + $page.url.search

const closeSidebar = () => sidebarOpen.set(false)

type SidebarItemBase = {
  type: 'link' | 'heading' | 'button',
  label: string,
  show?: () => boolean | boolean
}
type SidebarLink = SidebarItemBase & {
  type: 'link',
  href: string,
  icon?: string,
}
type SidebarButton = SidebarItemBase & {
  type: 'button',
  href: string,
  icon?: string,
}
type SidebarHeading = SidebarItemBase & {
  type: 'heading',
}
type SidebarItem = SidebarButton | SidebarLink | SidebarHeading
type SidebarGroup = SidebarItem[]

let tree: SidebarGroup[] = []
$: tree = [
  [
    {
      type: 'button',
      label: 'Write',
      href: '/posts/new',
      icon: 'fluent:edit-24-filled',
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
    {
      type: 'link',
      label: 'Tags',
      href: '/tags',
      icon: 'fluent:tag-24-filled',
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
  ],
]

type subTreeItem = {
  label: string
  href: string
}
const subTree: subTreeItem[] = [
    {
    label: 'Github',
    href: 'https://github.com/joshwcorbett/taleweave',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/CXz9Aqb9My',
  },
  {
    label: 'Privacy Policy',
    href: 'https://github.com/joshwcorbett/taleweave/blob/terms-and-privacy/PRIVACY.md',
  },
  {
    label: 'Terms of Service',
    href: 'https://github.com/joshwcorbett/taleweave/blob/terms-and-privacy/TOS.md',
  },
]
</script>

<div class="grid content-between h-full gap-4 py-6">

  <div class="grid gap-4">
    <div class="flex items-center justify-between px-2">
      <Brand />
      <button on:click={closeSidebar} class="p-3 rounded-md hover:bg-white/10 lg:hidden">
        <Icon icon="fluent:dismiss-24-filled" class="w-5 h-5" />
      </button>
    </div>

    <nav class="grid px-2">
      {#each tree as group}
        {#if group.some(item => item.show === undefined || item.show())}
          <div class="grid py-2">
            {#each group as item}
              {#if item.show === undefined || item.show()}
                {#if item.type === 'heading'}
                  <span class="px-2 text-xs font-bold text-gray-500 uppercase">{ item.label }</span>
                {:else if item.type === 'link'}
                  <a
                    class="
                      text-sm px-3 py-3 font-semibold rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all duration-100 ease-in-out
                      { item.href === path ? 'text-orange-300' : 'text-white/40 hover:text-white/80' }
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
                {:else if item.type === 'button'}
                  <a
                    href={item.href}
                    class="
                      flex items-center gap-2 p-3 text-sm font-semibold transition-all duration-100 ease-in-out rounded-lg
                      {item.href === path ? 'bg-orange-300 text-gray-900' : 'hover:bg-orange-400/20 bg-orange-400/10 text-orange-300'}
                    "
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
        {/if}
      {/each}
    </nav>
  </div>


  <nav class="grid gap-2 px-2">
    {#each subTree as { label, href }}
      <a
        {href}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 px-3 text-sm text-gray-500 hover:text-gray-300"
      >
        <span>{label}</span>
      </a>
    {/each}
  </nav>
</div>
