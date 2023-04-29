<script lang="ts">
import type { Post } from '@prisma/client/index'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'

$: user = $page.data.user

export let post: Post
export let showFeaturedFlag = true
</script>

<article class="relative flex flex-col w-full overflow-hidden border rounded-md border-white/10">
  <a href="/posts/{post.id}" class="relative flex flex-col gap-1 p-4 {post.featured ? 'hover:bg-orange-300/5' : 'hover:bg-gray-900'}">
    {#if post.featured && showFeaturedFlag}
      <div class="flex items-center gap-1 text-xs font-bold text-orange-300 uppercase">
        <Icon icon="fluent:flash-16-filled" class="w-5 h-5" />
        <span>Featured</span>
      </div>
    {/if}
    <h2 class="relative font-serif text-3xl font-bold">{post.title}</h2>
    {#if post.description}
      <p class="relative font-sans text-sm text-gray-100/60">{post.description}</p>
    {/if}
  </a>
</article>
