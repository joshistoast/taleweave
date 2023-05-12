<script lang="ts">
import type { Tag, Rating } from '@prisma/client'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Icon from '@iconify/svelte'
import Dropdown from '$lib/components/common/Dropdown.svelte'
import TagsInput from '$lib/components/TagsInput.svelte'

// TODO: sorting by date, rating, etc
// TODO: filter age ratings

export let tags: Tag[] = []

const searchDefaults = {
  search: $page.url.searchParams.get('q') || '' as string,
  selectedTags: $page.url.searchParams.get('tags')?.split(',') || tags.map((t) => t.name) || [] as string[],
  rating: $page.url.searchParams.get('r') as Rating || undefined,
}

export let search: string = searchDefaults.search || ''
let selectedTags: string[] = searchDefaults.selectedTags
let rating: Rating = searchDefaults.rating

let selectedRawTags: Tag[] = tags ? tags.filter((t) => selectedTags.includes(t.name)) : []
$: {
  selectedTags = selectedRawTags.map((t) => t.name)
}

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
  search ? urlSearchParams.set('q', search) : urlSearchParams.delete('q')
  selectedTags.length ? urlSearchParams.set('tags', selectedTags.join(',')) : urlSearchParams.delete('tags')
  rating ? urlSearchParams.set('r', rating) : urlSearchParams.delete('r')

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
    <Dropdown>
      <svelte:fragment slot="trigger" let:open let:toggle>
        <button
          title="Include Tags {selectedTags.length ? `(${selectedTags.length})` : ''}"
          class="flex items-center p-2 rounded-md hover:bg-white/10 {open ? 'bg-white/10' : ''}"
          on:click={toggle}
        >
          <Icon icon="fluent:tag-search-24-regular" class="w-6 h-6" />
          {#if selectedTags.length}
            <span class="pl-2 text-sm font-bold">{selectedTags.length}</span>
          {/if}
        </button>
      </svelte:fragment>

      <div class="p-2">
        <span class="px-1 text-xs font-bold text-white/50">Include posts with tags</span>
        <TagsInput bind:selectedTags={selectedRawTags} />
        {#if selectedTags?.length}
          <div class="grid p-1 text-sm font-bold">
            <button
              class="flex px-3 py-1 transition-all duration-100 ease-in-out rounded-md hover:bg-white/10"
              on:click={() => {
                selectedRawTags = []
              }}
            >
              Reset tags
            </button>
          </div>
        {/if}
      </div>
    </Dropdown>
    <button title="Clear filters" on:click={resetAndSearch} class="p-2 rounded-md hover:bg-white/10">
      <Icon icon="fluent:arrow-reset-24-filled" class="w-6 h-6" />
    </button>
    <button title="Search posts" on:click={doSearch} class="p-2 rounded-md hover:bg-white/10">
      <Icon icon="fluent:search-24-filled" class="w-6 h-6" />
    </button>
  </div>
</div>
