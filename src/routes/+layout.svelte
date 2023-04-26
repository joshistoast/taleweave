<script lang="ts">
import '../app.css'
import Sidebar from '$lib/components/Sidebar.svelte'
</script>

<div class="flex w-full min-h-screen border-t border-gray-800">
  <aside class="shrink-0 lg:w-[20rem] w-0 hidden lg:block border-r border-gray-800 sticky top-0">
    <Sidebar />
  </aside>

  <main class="w-full flex-1 overflow-auto">
    <slot />
  </main>
</div>
