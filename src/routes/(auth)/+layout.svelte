<script lang="ts">
import { page } from '$app/stores'

$: ({ pathname } = $page.url)
$: ({ user } = $page.data)

type LoginNavItem = {
  label: string
  href: string
  show?: () => boolean | boolean
}
const nav: LoginNavItem[] = [
  {
    label: 'Log In',
    href: '/login',
    show: () => !user,
  },
  {
    label: 'Register',
    href: '/register',
    show: () => !user,
  },
  {
    label: 'Log Out',
    href: '/logout',
    show: () => !!user,
  }
]
</script>

<div>
  <div class="p-4">
    <h1 class="text-xl font-bold lg:text-3xl">Start using Dustbunny.</h1>
    <p class="text-sm">Log in or register to start writing.</p>
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
</div>

<slot />
