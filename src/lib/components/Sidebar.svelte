<script lang="ts">
import Icon from '@iconify/svelte'
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
    {
      type: 'link',
      label: 'Following',
      href: '/posts?following=true',
      icon: 'fluent:people-24-filled',
    }
  ],
  [
    {
      type: 'link',
      label: 'Profile',
      href: `/authors/${user?.username}`,
      icon: 'fluent:person-24-filled',
      show: () => !!user,
    },
    {
      type: 'link',
      label: 'Log In',
      href: '/login',
      icon: 'fluent:person-key-20-filled',
      show: () => !user,
    },
    {
      type: 'link',
      label: 'Register',
      href: '/register',
      icon: 'fluent:person-add-24-filled',
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

<div class="grid transition-all duration-100 ease-in-out opacity-30 hover:opacity-100">

  <h1 class="px-4 pt-6 text-2xl font-bold">Dusty</h1>

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
                  text-sm px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900
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
