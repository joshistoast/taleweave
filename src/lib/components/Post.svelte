<script lang="ts">
import type { Post, AuthUser } from '@prisma/client/index'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'

$: user = $page.data.user

type PostWithUser = Post & { author: AuthUser }

export let post: PostWithUser | Post
export let showFeaturedFlag = true

$: ({ id, title, description, rating, featured } = post)
$: writtenByYou = user?.userId === post.authorId
</script>

<article class="relative flex flex-col w-full overflow-hidden group">
  <a
    href="/posts/{id}"
    class="
      relative flex flex-col gap-1 p-4 transition-all duration-100 ease-in-out border rounded-lg
      {featured ? 'border-orange-300/10 hover:border-orange-300/30 focus:border-orange-300' : 'hover:border-white/30 border-white/10 focus:border-white'}
    "
  >

    {#if featured}
      <div class="absolute top-0 w-full opacity-60">
        <img
          src="/image/rays.avif"
          alt="Rays of Light"
          class="w-full h-full sepia saturate-200 brightness-75 hue-rotate-60"
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
      {#if post.author?.username}
        <p class="text-sm text-white/50">By {post.author.username} {writtenByYou ? '(you)' : ''}</p>
      {/if}
    </div>

    {#if description}
      <div class="pb-2">
        <p class="relative font-sans text-sm text-gray-100/60">{description}</p>
      </div>
    {/if}

    <div class="flex items-center gap-4 pt-3 text-xs font-bold border-t border-white/10 text-white/30">
      <span>Rating: {rating.toUpperCase()}</span>
    </div>
  </a>
</article>
