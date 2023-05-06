<script lang="ts">
import type { Rating } from '@prisma/client'
import { useRating } from '$lib/utils'

export let rating: Rating
export let bookmarks: number
</script>

<div class="flex items-center w-full gap-4 text-xs font-bold text-white/30">
  <span>{useRating(rating)}</span>
  <span>{bookmarks} Bookmark{bookmarks !== 1 ? 's' : ''}</span>
</div>
