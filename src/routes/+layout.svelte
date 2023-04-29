<script lang="ts">
import '../app.css'
import Sidebar from '$lib/components/Sidebar.svelte'
import AppHeader from '$lib/components/AppHeader.svelte'
import { sidebarOpen } from '$lib/stores'
  import { beforeNavigate } from '$app/navigation'
  import { onMount } from 'svelte'

let sidebarState: boolean

sidebarOpen.subscribe(v => sidebarState = v)

const closeSidebar = () => sidebarOpen.set(false)
beforeNavigate(() => {
  sidebarOpen.set(false)
})
onMount(() => {
  // on escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebarOpen.set(false)
    }
  })
})
</script>

<div class="flex flex-col w-full h-screen">

  <div class="lg:hidden">
    <AppHeader />
  </div>

  <div class="flex flex-1">

    <aside class="
      w-[16rem] h-full fixed lg:sticky top-0 left-0 z-[999] lg:translate-x-0 border-r border-white/10 bg-gray-900/70 lg:bg-transparent backdrop-blur-md transition-all duration-300 ease-in-out
      {sidebarState ? 'translate-x-0' : '-translate-x-full'}
    ">
      <Sidebar />
    </aside>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="fixed inset-0 lg:hidden z-[900] bg-gray-900/50 backdrop-blur-sm transition-all duration-300 ease-in-out {sidebarState ? 'opacity-100 visible' : 'opacity-0 invisible'}"
      on:click={closeSidebar}
    />

    <main class="flex flex-col flex-1 w-full max-h-screen overflow-auto">
      <slot />
    </main>
  </div>
</div>
