<script lang="ts">
import { page } from '$app/stores'

$: user = $page.data.user
$: path = $page.url.pathname

type Link = {
  label: string
  href: string
  icon?: string
  show?: () => boolean | boolean
}
let links: Link[] = []
$: links = [
  {
    label: 'Feed',
    href: '/',
    icon: 'i-fluent-home-24-filled',
  },
  // {
  //   label: 'Spaces',
  //   href: '/spaces',
  //   icon: 'i-fluent-people-24-filled',
  // },
  {
    label: 'Log In',
    href: '/auth/login',
    icon: 'i-fluent-lock-24-filled',
    show: () => !user?.userId || false,
  },
  {
    label: 'Register',
    href: '/auth/register',
    icon: 'i-fluent-lock-24-filled',
    show: () => !user?.userId || false,
  },
  // {
  //   label: 'Profile',
  //   href: `/u/${user?.username}`,
  //   icon: 'i-fluent-person-24-filled',
  //   show: () => !!user?.userId,
  // },
  {
    label: 'Log Out',
    href: '/auth/logout',
    icon: 'i-fluent-person-24-filled',
    show: () => !!user?.userId,
  }
]
</script>

<div class="grid py-6 gap-6">
  <div class="mx-3">
    Training Grounds
  </div>

  <ul class="flex flex-col w-full">
    {#each links as { label, href, icon, show }, i}
      {#if show === undefined || show()}
        <li class="w-full flex">
          <a
            {href}
            class="w-full flex items-center gap-2 p-3 text-sm font-bold hover:bg-gray-9 {path === href ? 'bg-gray-9 text-emerald-5' : ''}"
          >
            <span>
              { label }
            </span>
          </a>
        </li>
      {/if}
    {/each}
  </ul>
</div>
