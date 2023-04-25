<script lang="ts">
import '../app.css'
import Sidebar from '$lib/components/Sidebar.svelte'
</script>

<div class="flex w-full min-h-screen border-t border-gray-800">
  <aside class="shrink-0 md:w-32 lg:w-xs w-0">
    <!-- <slot name="sidebar" /> -->
    <Sidebar />
  </aside>

  <main class="w-full">
    <div class="max-w-2xl w-full h-full border-x border-gray-8">
      <slot />
    </div>
  </main>
</div>
