<script lang="ts">
import Logo from './Logo.svelte'
</script>

<a href="/" class="flex items-center p-2 text-orange-300 transition-all duration-100 ease-in-out rounded-lg active:scale-90 hover:bg-white/10 max-w-min group-hover:w-full">
  <div class="w-8 h-8">
    <Logo />
  </div>
  <div class="flex flex-col items-start px-2">
    <span class="text-lg font-bold leading-none">Taleweave</span>
    <span class="text-xs font-bold rounded-full text-white/60">Alpha</span>
  </div>
</a>
