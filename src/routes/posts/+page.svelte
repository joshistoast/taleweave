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

// TODO: change url query on tagsInput select

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

  {#if tags?.length}
    <div class="px-3 py-2 mt-2 border rounded-md border-white/10">
      <h3 class="text-sm font-bold">Filtering posts with the following tags</h3>
      <div class="flex flex-wrap gap-2 py-1">
        {#each tags as tag}
          <div class="flex items-center gap-1">
            <button
              title="Remove tag '{tag.name}'"
              class="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
              on:click={() => removeTag(tag.name)}
            >
              <Icon icon="mdi:close" class="w-3 h-3" />
              <span>{tag.name}</span>
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
