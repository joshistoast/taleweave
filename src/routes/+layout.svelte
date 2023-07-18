<script lang="ts">
import '../app.css'
import Sidebar from '$lib/components/Sidebar.svelte'
import AppHeader from '$lib/components/AppHeader.svelte'
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import { sidebarOpen } from '$lib/stores'
import { beforeNavigate } from '$app/navigation'
import { onMount } from 'svelte'
import { dev } from '$app/environment'
import { inject } from '@vercel/analytics'

// inject vercel analytics
inject({ mode: dev ? 'development' : 'production' })

let sidebarState: boolean
let mounted = false

sidebarOpen.subscribe(v => sidebarState = v)

$: if (mounted) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebarOpen.set(false)
    }
  })

  if (sidebarState) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}
const closeSidebar = () => sidebarOpen.set(false)
beforeNavigate(() => {
  sidebarOpen.set(false)
})
onMount(() => {
  mounted = true
})
</script>

<HeadTemplate />

<div class="flex flex-col min-h-screen">

  <AppHeader />

  <div class="flex h-full">
    <aside class="
      w-full max-w-[16rem] shrink-0 h-full border-r border-white/10 fixed top-0 left-0 z-[999] lg:translate-x-0 bg-gray-900/70 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none transition-all duration-300 ease-in-out
      {sidebarState ? 'translate-x-0' : '-translate-x-full'}
    ">
      <Sidebar />
    </aside>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="fixed inset-0 lg:hidden z-[900] bg-gray-900/50 backdrop-blur-sm transition-all duration-300 ease-in-out {sidebarState ? 'opacity-100 visible' : 'opacity-0 invisible'}"
      on:click={closeSidebar}
      aria-label="Close sidebar"
      role="button"
      tabindex="0"
    />

    <main class="lg:ml-[16rem] min-h-[calc(100vh-3.5rem)] lg:min-h-screen w-full max-w-7xl border-white/10 [@media(min-width:80rem)]:border-r">
      <slot />
    </main>
  </div>

</div>
