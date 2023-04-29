<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'
import Post from '$lib/components/Post.svelte'

export let posts: PostType[]
export let showFeaturedFlags = true
</script>

{#if posts?.length}
  {#each posts as post}
    <Post
      {post}
      showFeaturedFlag={showFeaturedFlags}
    />
  {/each}
{:else}
  <p class="p-4 text-gray-500">No posts.</p>
{/if}
