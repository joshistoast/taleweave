<script lang="ts">
import { page } from '$app/stores'
import { enhance } from '$app/forms'
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

$: user = $page.data.user
export let data: PageData

$: ({ posts } = data)
</script>

<div class="grid gap-4">
  {#if user?.userId}
    <form
      action="?/createPost"
      method="POST"
      class="grid"
      use:enhance
    >
      <textarea
        id="content"
        name="content"
        class="p-2 bg-transparent resize-none h-30 focus:bg-gray-9 outline-none"
        placeholder="Write something here..."></textarea>

      <button
        type="submit"
        class="bg-emerald-500/10 text-emerald-500 p-1 font-bold hover:bg-emerald/15"
      >
        Post
      </button>
    </form>
  {/if}

  {#if posts?.length}
    <Feed {posts} />
  {:else}
    <p>No Posts</p>
  {/if}
</div>

