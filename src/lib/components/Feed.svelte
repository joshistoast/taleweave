<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'
import Post from '$lib/components/Post.svelte'

export let posts: PostType[]
</script>

<h1 class="text-4xl font-bold px-3">Feed</h1>

<div class="grid border-t border-gray-8">
  {#each posts as post}
    <Post {post} />
  {/each}
</div>
