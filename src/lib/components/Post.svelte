<script lang="ts">
import type { Post } from '@prisma/client/index'
import { page } from '$app/stores'

$: user = $page.data.user

export let post: Post
</script>

<article class="w-full flex border-b border-gray-8 flex flex-col w-full">
  <a href={`/posts/${post.id}`}>
    <p>{post.createdAt}</p>
    <h2>{post.title}</h2>
    <p>{post.description}</p>
  </a>
</article>
