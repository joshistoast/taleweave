<script lang="ts">
import Icon from '@iconify/svelte'
import type { Tag } from '@prisma/client'
import { clickOutside } from '$lib/utils'
import { page } from '$app/stores'
import { createEventDispatcher } from 'svelte'
import type { MaybeTag } from '$lib/utils'

const dispatch = createEventDispatcher()

export let placeholder= 'Search tags...'
export let selectedTags: MaybeTag[] = []
export let isDropdown = false
export let allowCustomTags = false
export let maxTags = 5

let loading = false
let search = ''
let tagResults: Tag[] = []
let resultsOpen: boolean

$: resultsOpen = tagResults.length > 0
$: maxTagsReached = selectedTags.length >= maxTags

$: isTagSelected = (tag: MaybeTag) => {
  return selectedTags.some((t) => t.name === tag.name)
}

const clearSearch = () => {
  search = ''
  tagResults = []
}
const fetchTags = async () => {
  return await fetch(`/api/tags/autocomplete?query=${search}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))
}
const onInput = async () => {
  if (search.length >= 3) {
    loading = true
    await fetchTags()
      .then((res) => {
        if (allowCustomTags) {
          const topTag = { name: search }
          const resContainsSearch = res.some((t: Tag) => t.name === search)
          tagResults = resContainsSearch ? res : [topTag, ...res]
        } else {
          tagResults = res
        }
      })
      .catch((err) => console.error(err))
      .finally(() => (loading = false))
  } else {
    tagResults = []
  }
}
const toggleTag = (tag: MaybeTag) => {
  isTagSelected(tag) ? removeTag(tag) : selectTag(tag)
  dispatch('change', selectedTags)
}
const selectTag = (tag: MaybeTag) => {
  selectedTags = [...selectedTags, tag]
  clearSearch()
  dispatch('select', tag)
}
const removeTag = (tag: MaybeTag) => {
  selectedTags = selectedTags.filter((t) => t.name !== tag.name)
  clearSearch()
  dispatch('remove', tag)
}
const onInputEnter = (e) => {
  e.preventDefault()
  if (search.length >= 3) {
    toggleTag({ name: search })
  }
}
// return html string with <mark> tag around search query
$: tagNameWithHighlight = (name: string) => {
  const regex = new RegExp(search, 'gi')
  return name.replace(regex, (match) => `<span class="text-orange-300 underline">${match}</span>`)
}
</script>

<div class="p-1">
  <div
    class="relative"
    use:clickOutside
    on:clickOutside={() => (isDropdown && (resultsOpen = false))}
  >
    <!-- tag search -->
    <div class="relative">
      <input
        bind:value={search}
        type="text"
        placeholder={maxTagsReached ? 'Max tags reached' : placeholder}
        disabled={maxTagsReached}
        on:input={onInput}
        on:keydown={(e) => e.key === 'Enter' && onInputEnter(e)}
        class="w-full px-3 py-2 text-sm transition-all duration-100 ease-in-out rounded-md outline-none disabled:opacity-50 ring-0 hover:ring-2 focus:ring-2 hover:ring-white/20 focus:ring-orange-300 bg-white/10 focus:bg-transparent"
      />
      <div class="absolute inset-y-0 right-0 flex items-center p-1">
        {#if loading}
          <div class="text-orange-300 pointer-events-none">
            <Icon icon="ri:loader-5-line" class="w-5 h-5 animate-spin" />
          </div>
        {/if}
        {#if search?.length}
          <button on:click|preventDefault={clearSearch} class="p-1 rounded-md hover:bg-white/10">
            <Icon icon="fluent:dismiss-12-filled" class="w-4 h-4" />
          </button>
        {/if}
        <span class="px-2 font-semibold py-1 text-xs rounded-md bg-white/10 {maxTagsReached ? 'text-rose-400' : 'text-white/70'}">
          {selectedTags.length} / {maxTags}
        </span>
      </div>
    </div>
    <!-- tag results -->
    <div class="
      {resultsOpen ? 'block' : 'hidden'}
      {isDropdown ? 'absolute bg-gray-800 p-2 top-[calc(100%+0.35rem)] rounded-md' : 'pt-2'}
      w-full
    ">
      {#each tagResults as tag, i (i)}
        <button
          class="flex items-center justify-between w-full p-2 transition-all duration-100 ease-in-out rounded-md hover:bg-white/10"
          on:click|preventDefault={() => toggleTag(tag)}
        >
          <div class="flex items-center gap-1 px-1">
            <span class="text-sm">{@html tagNameWithHighlight(tag.name)}</span>
            {#if tag.__count?.posts}
              <span class="text-xs text-white/50">{tag._count.posts} post{tag._count.posts !== 1 ? 's' : ''}</span>
            {/if}
          </div>
          <Icon icon={isTagSelected(tag) ? 'fluent:checkbox-checked-24-filled' : 'fluent:checkbox-unchecked-24-filled'} class="w-5 h-5" />
        </button>
      {/each}
    </div>
  </div>
  <!-- selected tags -->
  {#if selectedTags?.length}
    <div class="flex flex-wrap gap-2 pt-2">
      {#each selectedTags as tag}
        <div class="flex items-center p-1 rounded-md bg-white/10">
          <span class="px-1 text-sm">{tag.name}</span>
          <button
            title="Remove tag '{tag.name}'"
            class="p-1 transition-all duration-100 ease-in-out rounded-md hover:bg-white/10 active:scale-90"
            on:click|preventDefault={() => removeTag(tag)}
          >
            <Icon icon="fluent:dismiss-12-filled" class="w-4 h-4" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
