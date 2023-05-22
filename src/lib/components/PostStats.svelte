<script lang="ts">
import type { AgeRating } from '@prisma/client'
import Icon from '@iconify/svelte'
import { useRating } from '$lib/utils'

export let rating: AgeRating | undefined = undefined
export let bookmarks: number | undefined = undefined
export let comments: number | undefined = undefined
</script>

<div class="flex items-center w-full gap-4 text-xs font-bold text-white/30">
  {#if rating !== undefined}
    <span>{useRating(rating)}</span>
  {/if}
  {#if bookmarks !== undefined}
    <div class="flex items-center gap-1">
      <Icon icon="fluent:bookmark-16-filled" class="w-4 h-4" />
      <span>{bookmarks} Bookmark{bookmarks !== 1 ? 's' : ''}</span>
    </div>
  {/if}
  {#if comments !== undefined}
    <div class="flex items-center gap-1">
      <Icon icon="fluent:comment-12-filled" class="w-4 h-4" />
      <span>{comments} Comment{comments !== 1 ? 's' : ''}</span>
    </div>
  {/if}
</div>
