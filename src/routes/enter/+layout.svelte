<script lang="ts">
import { page } from '$app/stores'

$: path = $page.url.pathname

const links = [
  {
    label: 'Log In',
    href: '/enter/login'
  },
  {
    label: 'Register',
    href: '/enter/register'
  },
]
</script>

<nav class="flex">
  {#each links as { label, href}, i (label)}
    <a
      class="flex-1 text-center p-2 font-bold text-sm { href === path ? 'text-white' : 'text-neutral-500' }"
      {href}
    >
      {label}
    </a>
  {/each}
</nav>

<div class="p-6">
  <slot />
</div>
