<script lang="ts">
import { page } from '$app/stores'
import { enhance } from '$app/forms'
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

$: user = $page.data.user
export let data: PageData

$: ({ posts } = data)
</script>

{#if user?.userId}
  <form action="?/createPost" method="POST" class="grid" use:enhance>
    <label class="grid">
      <span>Content</span>
      <textarea id="content" name="content"></textarea>
    </label>

    <button type="submit" class="bg-emerald-500/10 text-emerald-500 p-1 font-bold hover:bg-emerald/15">Post</button>
  </form>
{/if}

{#if posts?.length}
  <Feed {posts} />
{:else}
  <p>No Posts</p>
{/if}
