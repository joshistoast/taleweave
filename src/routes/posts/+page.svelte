<script lang="ts">
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'

export let data: PageData

$: ({
  posts,
  props,
  tags,
} = data)

const removeTag = (tag: string) => {
  // remove the tag from the url query string
  const tags = $page.url.searchParams.get('tags')
    ?.split(',')
    .filter((t) => t !== tag)
    .join(',')

  const newUrl = new URL($page.url.href)
  newUrl.searchParams.set('tags', tags || '')

  goto(newUrl.href, { replaceState: true })
}
</script>

<header class="p-4 border-b border-white/10">
  <h1 class="text-lg font-bold {props.isFeatured ? 'text-orange-300' : 'text-gray-300'}">{props.title}</h1>
  <p class="text-sm text-gray-400">{props.description}</p>

  {#if tags.length}
    <div class="grid gap-2 pt-2 mt-4 border-t border-white/10">
      <h2 class="text-sm font-bold text-gray-300">Searching posts with tags</h2>
      <div class="flex flex-wrap">
        {#each tags as { id, name, _count }}
          <div class="flex items-center gap-1 p-1 rounded-md text-white/50 bg-white/10">
            <span class="px-1 text-sm">{name}</span>
            <button title="Remove tag" class="p-1 rounded-md hover:bg-white/10 hover:text-rose-400" on:click={() => removeTag(name)}>
              <Icon icon="fluent:dismiss-12-filled" class="w-4 h-4" />
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</header>

<div class="p-4">
  <Feed {posts} showFeaturedFlags={!props.isFeatured} />
</div>
