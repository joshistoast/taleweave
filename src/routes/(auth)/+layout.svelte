<script lang="ts">
import { page } from '$app/stores'
import Tab from '$lib/components/common/Tab.svelte'
import Tabs from '$lib/components/common/Tabs.svelte'

$: ({ pathname } = $page.url)
$: ({ user, props } = $page.data)

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

<div class="grid p-4">
  <h1 class="font-serif text-2xl font-bold lg:text-4xl">{props.title}</h1>
  <p class="text-sm leading-loose">{props.description}</p>
</div>

{#if !user}
  <Tabs selected={ +nav.indexOf(nav.find(({ href }) => href === pathname)) }>
    {#each nav as { label, href }}
      <Tab {href} {label} selected={href === pathname} />
    {/each}
  </Tabs>
{/if}

<div class="max-w-lg p-4">
  <slot />
</div>
