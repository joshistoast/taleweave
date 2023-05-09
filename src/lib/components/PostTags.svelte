<script lang="ts">
import type { Tag } from '@prisma/client'

export let tags: Tag[] = []
</script>

<div
  class="flex flex-wrap gap-2"
>
  {#each tags as tag}
    <a
      class="px-2 py-1 text-xs font-bold rounded-md hover:text-orange-300 bg-white/10 text-white/50"
      href="/posts?tags={tag.name}"
    >
      {tag.name}
    </a>
  {/each}
</div>
