<script lang="ts">
import type { Tag, Rating } from '@prisma/client'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Icon from '@iconify/svelte'

// TODO: fix search doesn't always return new results
// TODO: tag searching
// TODO: sorting by date, rating, etc
// TODO: filter age ratings

const searchDefaults = {
  search: $page.url.searchParams.get('q') || '' as string,
  selectedTags: $page.url.searchParams.get('tags')?.split(',') || [] as string[],
  rating: $page.url.searchParams.get('r') as Rating || 's' as Rating,
}

let search = searchDefaults.search
let selectedTags = searchDefaults.selectedTags
let rating = searchDefaults.rating

// reactive search params
$: search
$: selectedTags
$: rating
// if search params are equal to defaults
$: searchParamsAreDefault = search === searchDefaults.search && selectedTags === searchDefaults.selectedTags && rating === searchDefaults.rating

const resetParams = () => {
  // reset url params
  search = searchDefaults.search
  selectedTags = searchDefaults.selectedTags
  rating = searchDefaults.rating
}
const resetSearch = () => {
  goto($page.url.pathname)
}
const resetAndSearch = () => {
  resetParams()
  resetSearch()
}
const doSearch = () => {
  // stage new url params
  const urlSearchParams = $page.url.searchParams
  urlSearchParams.set('q', search)
  urlSearchParams.set('tags', selectedTags.join(','))
  urlSearchParams.set('r', rating)

  if (searchParamsAreDefault) {
    resetParams()
    resetSearch()
  } else {
    goto($page.url.pathname + '?' + urlSearchParams.toString())
  }
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
    <button title="Clear filters" on:click={resetAndSearch} class="p-2 rounded-md hover:bg-white/10">
      <Icon icon="fluent:arrow-reset-24-filled" class="w-6 h-6" />
    </button>
    <button title="Search posts" on:click={doSearch} class="p-2 rounded-md hover:bg-white/10">
      <Icon icon="fluent:search-24-filled" class="w-6 h-6" />
    </button>
  </div>
</div>
