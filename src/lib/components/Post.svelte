<script lang="ts">
import type { Post as PostType } from '@prisma/client/index'

export let post: PostType
</script>

<article class="border-b border-neutral-800 p-2">
  <p>Josh Corbett</p>
  <p>{ post.content }</p>
</article>
