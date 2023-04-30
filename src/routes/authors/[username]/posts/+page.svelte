<script lang="ts">
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

export let data: PageData
$: ({ posts } = data)
</script>

<div class="p-2 lg:pl-0">
  <Feed {posts} />
</div>
