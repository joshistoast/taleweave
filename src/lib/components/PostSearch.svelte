<script lang="ts">
import type { Tag, Rating } from '@prisma/client'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Icon from '@iconify/svelte'
import Dropdown from '$lib/components/common/Dropdown.svelte'
import TagsInput from '$lib/components/TagsInput.svelte'
import { useRating } from '$lib/utils'

// TODO: sorting by date, rating, etc
// TODO: filter age ratings

// const sortOptions = [
//   { name: 'Date', value: 'date' },
//   { name: 'Rating', value: 'rating' },
//   { name: 'Title', value: 'title' },
// ]
const ratingOptions = ['s', 't', 'm', 'e']

export let search: string = $page.url.searchParams.get('search') || ''
// export let sorting = sortOptions[0]
export let rating = $page.url.searchParams.get('rating') || undefined
export let tags: Tag[] = []

let stagedSearchParamsString: string
$: {
  let params = new URLSearchParams()
  search?.length ? params.set('search', search) : undefined
  tags?.length ? params.set('tags', tags.map((tag) => tag.name).join(',')) : undefined
  rating ? params.set('rating', rating) : undefined
  // sorting ? params.set('sort', sorting.value) : undefined

  stagedSearchParamsString = params.toString()
}

const doSearch = () => {
  // navigate to new url
  goto(`${$page.url.pathname}?${stagedSearchParamsString.toString()}`)
}
</script>

<div class="flex">
  <input
    type="text"
    bind:value={search}
    on:keydown={(e) => e.key === 'Enter' && doSearch()}
    class="w-full p-2 px-4 bg-transparent outline-none placeholder-white/50 focus:placeholder-white/75"
    placeholder="Search by title..."
  />

  <div class="flex gap-1 py-1 pr-4">
    <Dropdown>
      <svelte:fragment slot="trigger" let:open let:toggle>
        <button
          title="Include Tags {tags?.length ? `(${tags.length})` : ''}"
          class="flex items-center p-2 rounded-md hover:bg-white/10 {open ? 'bg-white/10 text-orange-300' : 'text-white/60 hover:text-orange-300'}"
          on:click={toggle}
        >
          <Icon icon="fluent:tag-search-24-regular" class="w-6 h-6" />
          {#if tags?.length}
            <span class="pl-2 text-sm font-bold">{tags.length}</span>
          {/if}
        </button>
      </svelte:fragment>

      <div class="p-2">
        <span class="px-1 text-xs font-bold text-white/50">Include posts with tags</span>
        <TagsInput bind:selectedTags={tags} />
        {#if tags?.length}
          <div class="grid p-1 text-sm font-bold">
            <button
              class="flex px-3 py-1 transition-all duration-100 ease-in-out rounded-md hover:bg-white/10"
              on:click={() => {
                tags = []
              }}
            >
              Reset tags
            </button>
          </div>
        {/if}
      </div>
    </Dropdown>
    <a href="/posts" title="Clear filters" class="p-2 rounded-md text-white/60 hover:text-orange-300 hover:bg-white/10">
      <Icon icon="fluent:arrow-reset-24-filled" class="w-6 h-6" />
    </a>
    <button title="Search posts" on:click={doSearch} class="p-2 rounded-md text-white/60 hover:text-orange-300 hover:bg-white/10">
      <Icon icon="fluent:search-24-filled" class="w-6 h-6" />
    </button>
  </div>
</div>
