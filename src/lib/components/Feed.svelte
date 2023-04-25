<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'
import Post from '$lib/components/Post.svelte'

export let posts: PostType[]
</script>

<div class="grid border-t border-gray-8">
  {#each posts as post}
    <a href={`/post/${post.id}`} class="block hover:bg-gray-9">
      <Post {post} />
    </a>
  {/each}
</div>
