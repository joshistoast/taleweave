<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'
import Post from '$lib/components/Post.svelte'

export let posts: PostType[]
</script>

{#if posts?.length}
  {#each posts as post}
    <Post {post} />
  {/each}
{:else}
  <p class="p-4">No posts found.</p>
{/if}
