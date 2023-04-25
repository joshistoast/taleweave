<script lang="ts">
import { page } from '$app/stores'
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'
import PostCompose from '$lib/components/ComposePost.svelte'

$: user = $page.data.user
export let data: PageData

$: ({ posts } = data)
</script>

<div class="grid gap-4 py-4">

  <h1 class="text-4xl font-bold px-3">Feed</h1>

  {#if user?.userId}
    <PostCompose />
  {/if}

  {#if posts?.length}
    <Feed {posts} />
  {:else}
    <p>No Posts</p>
  {/if}
</div>
