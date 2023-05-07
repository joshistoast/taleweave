<script lang="ts">
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

export let data: PageData
$: ({ posts } = data)
</script>

<div class="p-4">
  <Feed {posts} />
</div>
