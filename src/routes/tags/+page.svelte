<script lang="ts">
import type { PageServerData } from './$types'

export let data: PageServerData

$: ({ tags } = data)
</script>

<header class="p-4 border-b border-white/10">
  <h1 class="text-lg font-bold">Tags</h1>
  <p class="text-sm text-gray-400">Explore all the tags authors have used to categorize their posts.</p>
</header>

<div class="grid p-4">

  {#each tags as { id, name, _count}}
    <a class="flex items-center gap-2 px-3 py-2 rounded-md group hover:bg-white/10" href="/posts?tags={name}">
      <span class="group-hover:text-orange-300">{name}</span>
      <span class="w-4 h-[1px] bg-white/50" />
      <span class="text-xs font-bold text-white/50">Used on {_count.posts} post{_count.posts === 1 ? '' : 's'}</span>
    </a>
  {/each}

</div>
