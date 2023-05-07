<script lang="ts">
import type { PageServerData } from './$types'
import Feed from '$lib/components/Feed.svelte'

export let data: PageServerData

$: ({ posts } = data)
</script>

<div class="p-4">
  <Feed {posts} />
</div>
