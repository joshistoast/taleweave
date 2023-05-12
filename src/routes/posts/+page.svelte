<script lang="ts">
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'
import PostSearch from '$lib/components/PostSearch.svelte'

export let data: PageData
let postSearchQuery: string

$: ({
  posts,
  props,
  tags,
} = data)
</script>

<header class="border-b border-white/10">
  <div class="p-4">
    <h1 class="text-lg font-bold {props.isFeatured ? 'text-orange-300' : 'text-gray-300'}">{props.title}</h1>
    <p class="text-sm text-gray-400">{props.description}</p>
  </div>

  {#if !props.isFeatured}
    <div class="border-t border-white/10">
      <PostSearch {tags} bind:search={postSearchQuery} />
    </div>
  {/if}
</header>

<div class="grid gap-4 p-4">
  {#if !props.isFeatured && $page.url.searchParams.get('q') === postSearchQuery}
    <h2>Searching posts for "{postSearchQuery}"</h2>
  {/if}
  <Feed {posts} showFeaturedFlags={!props.isFeatured} />
</div>
