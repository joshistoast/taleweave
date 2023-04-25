<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'

export let post: PostType
</script>

<article class="w-full flex">
  <a class="p-2 border-b border-gray-8 flex flex-col w-full hover:bg-gray-9" href={`/post/${post.id}`}>
    <p class="font-bold text-sm text-gray-5">{ post.author.username }</p>
    <p>{ post.content }</p>
  </a>
</article>
