<script lang="ts">
import type { PageData } from './$types'
import Post from '$lib/components/Post.svelte'

export let data: PageData
$: ({ posts } = data)
</script>

{#each posts as post}
  <Post {post} />
{/each}
