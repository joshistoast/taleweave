<script lang="ts">
import type { PageData } from './$types'
import { page } from '$app/stores'

export let data: PageData

$: ({ author } = data)
</script>

<div class="p-4">
  {#if author.bio}
    <div class="w-full prose prose-invert max-w-none">
      {@html author.bio}
    </div>
  {:else}
    <p class="text-gray-500">No bio yet.</p>
  {/if}
</div>
