<script lang="ts">
import type { Post } from '@prisma/client/index'
import { page } from '$app/stores'

$: user = $page.data.user

export let post: Post
</script>

<article class="w-full flex border-b border-gray-8 flex flex-col w-full">
  <div class="p-2">
    <p class="font-bold text-sm text-gray-5">{ post.author.username }</p>
    <div class="prose">
      {@html post.content}
    </div>
  </div>

  <div>
    {#if post.authorId === user.userId}
      <form action="/?/deletePost&id={post.id}" method="POST">
        <button type="submit" class="p-1 text-gray-5 hover:bg-gray-8 hover:text-rose-5 flex items-center gap-2">
          <span class="i-fluent-delete-24-filled" />
          <span>Delete</span>
        </button>
      </form>
    {/if}
  </div>
</article>
