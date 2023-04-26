<script lang="ts">
import '../app.css'
import Sidebar from '$lib/components/Sidebar.svelte'
</script>

<div class="flex w-full min-h-screen">
  <aside class="shrink-0 lg:w-[16rem] w-0 hidden lg:block border-r border-gray-800 sticky top-0">
    <Sidebar />
  </aside>

  <main class="flex-1 w-full max-h-screen overflow-auto">
    <slot />
  </main>
</div>
