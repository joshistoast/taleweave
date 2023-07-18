<script lang="ts">
import type { Post } from '@prisma/client/index'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'
import PostStats from '$lib/components/PostStats.svelte'
import PostTags from '$lib/components/PostTags.svelte'
import { truncate } from '$lib/utils'

$: user = $page.data.user

export let post: Post
export let showFeaturedFlag = true

$: ({ id, title, description, rating, featured } = post)
$: writtenByYou = user?.userId === post.author.id
</script>

<article class="relative flex flex-col w-full overflow-hidden group">
  <a
    href="/posts/{id}"
    class="
      relative flex flex-col gap-1 p-4 transition-all duration-100 ease-in-out border rounded-lg
      {featured ? 'border-orange-300/20 hover:border-orange-300/50 focus:border-orange-300' : 'hover:border-white/30 border-white/10 focus:border-white'}
    "
  >

    {#if featured}
      <div class="absolute top-0 left-0 w-full max-w-[800px] h-full transition-all duration-100 ease-in-out">
        <img
          src="/image/rays.avif"
          alt="Rays of Light"
          class="object-cover w-full h-full sepia saturate-200 brightness-[60%] hue-rotate-60 -scale-x-[1] object-top"
        >
      </div>
    {/if}

    {#if featured && showFeaturedFlag}
      <div class="flex items-center gap-1 py-1 text-xs font-bold text-orange-300 uppercase">
        <Icon icon="fluent:flash-16-filled" class="w-5 h-5" />
        <span>Featured</span>
      </div>
    {/if}

    <div class="flex flex-col pb-2">
      <h2 class="relative font-serif text-3xl font-bold">{title}</h2>
      {#if post.author?.displayName}
        <p class="text-sm text-white/50">By {post.author.displayName} {writtenByYou ? '(you)' : ''}</p>
      {/if}
    </div>

    {#if description}
      <div class="pb-2">
        <p class="relative font-sans text-sm text-gray-100/60">
          {truncate(description, 200)}
        </p>
      </div>
    {/if}

    {#if post.tags?.length}
      <div class="pb-2">
        <PostTags tags={post.tags} />
      </div>
    {/if}

    <div class="pt-3 border-t transition-all duration-100 ease-in-out {featured ? 'border-orange-300/20' : 'border-white/10'} text-white/30">
      <PostStats rating={rating} bookmarks={post._count?.bookmarks} comments={post._count?.comments} />
    </div>
  </a>
</article>
