<script lang="ts">
import type { Comment } from '@prisma/client'
import { timeAgo } from '$lib/utils'
import { enhance } from '$app/forms'
import { page } from '$app/stores'

export let comment: Comment

$: ({ user } = $page.data)
</script>

<div class="grid gap-2 p-4 border rounded-md border-white/10">
  <div class="flex items-center gap-2 text-sm">
    <a href="/authors/{comment.user.username}" class="text-orange-300 underline hover:text-orange-400">
      {comment.user.displayName}
    </a>
    •
    <span>
      {timeAgo(comment.createdAt)}
    </span>
  </div>
  <p class="w-full">
    {comment.content}
  </p>
</div>
