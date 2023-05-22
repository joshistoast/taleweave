<script lang="ts">
import type { Comment } from '@prisma/client'

export let comment: Comment
</script>

<div class="grid gap-2 p-4 border rounded-md border-white/10">
  <a href="/authors/{comment.user.username}" class="text-orange-300 hover:text-orange-400">
    {comment.user.username}
  </a>
  <p class="w-full prose prose-invert max-w-none">
    {@html comment.content}
  </p>
</div>
