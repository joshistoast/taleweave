<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'
import Post from '$lib/components/Post.svelte'

export let posts: PostType[]
</script>

<div class="grid border-t border-neutral-800">
  {#each posts as post}
    <Post {post} />
  {/each}
</div>
