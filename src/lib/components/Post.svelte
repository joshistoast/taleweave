<script lang="ts">
import type { Post } from '@prisma/client/index'
import { page } from '$app/stores'

$: user = $page.data.user

export let post: Post
</script>

<article class="flex flex-col w-full border-b border-gray-800">
  <a href="/posts/{post.id}" class="p-4 hover:bg-gray-900">
    <h2 class="font-serif text-3xl">{post.title}</h2>
    {#if post.description}
      <p class="font-sans text-sm text-gray-400">{post.description}</p>
    {/if}
  </a>
</article>
