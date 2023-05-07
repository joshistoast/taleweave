<script lang="ts">
import Icon from '@iconify/svelte'
import { sidebarOpen } from '../stores/index'

const toggleSidebar = () => {
  sidebarOpen.update(v => !v)
}
</script>

<header class="sticky top-0 w-full border-b border-gray-800 group lg:hidden bg-[#121212]">

  <div class="flex items-center gap-2 transition-all duration-100 ease-in-out group-hover:opacity-100 opacity-30">
    <button
      on:click={toggleSidebar}
      class="h-full p-4 aspect-square hover:bg-gray-800 hover:text-orange-300"
    >
      <Icon icon="fluent:line-horizontal-3-20-filled" class="w-5 h-5" />
    </button>

    <span class="text-sm font-bold">Taleweave</span>
  </div>

</header>
