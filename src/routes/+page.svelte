<script lang="ts">
import type { PageData } from './$types'
import type { Prisma } from '@prisma/client'
import Feed from '$lib/components/Feed.svelte'

export let data: PageData

$: ({ posts } = data)
</script>

<form action="?/createPost" method="POST" class="grid">
  <label class="grid">
    <span>Content</span>
    <textarea id="content" name="content"></textarea>
  </label>

  <button type="submit" class="bg-emerald-500/10 text-emerald-500 p-1 font-bold hover:bg-emerald/15">Post</button>
</form>

<Feed {posts} />
