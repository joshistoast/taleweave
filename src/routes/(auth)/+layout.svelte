<script lang="ts">
import { page } from '$app/stores'
import Tab from '$lib/components/common/Tab.svelte'
import Tabs from '$lib/components/common/Tabs.svelte'
import TabContent from '$lib/components/common/TabContent.svelte'

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
  {#if !pathname.includes('/logout')}
    <div class="p-4 lg:px-0">
      <h1 class="text-xl font-bold lg:text-3xl">Start using Taleweave.</h1>
      <p class="text-sm">Log in or register to start writing.</p>
    </div>
  {/if}

  <Tabs selected={ +nav.indexOf(nav.find(({ href }) => href === pathname)) }>
    {#each nav as { label, href, show }}
      {#if show === undefined || show()}
        <Tab {href} {label} selected={href === pathname} />
      {/if}
    {/each}
  </Tabs>
</div>

<slot />
