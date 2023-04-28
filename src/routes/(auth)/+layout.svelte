<script lang="ts">
import { page } from '$app/stores'

$: ({ pathname } = $page.url)

type LoginNavItem = {
  label: string
  href: string
}
const nav: LoginNavItem[] = [
  {
    label: 'Log In',
    href: '/login',
  },
  {
    label: 'Register',
    href: '/register',
  }
]
</script>

<div>
  <div class="p-4">
    <h1 class="text-xl font-bold lg:text-3xl">Start using Dusty</h1>
    <p class="text-sm">Log in or register to start writing.</p>
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
</div>

<slot />
