<script lang="ts">
import Icon from '@iconify/svelte'
import type { Tag } from '@prisma/client'
import { clickOutside } from '$lib/utils'
import { page } from '$app/stores'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let placeholder= 'Search tags...'
export let selectedTags: Tag[] = []

let loading = false
let search = ''
let tagResults: Tag[] = []
let resultsOpen: boolean
$: resultsOpen = tagResults.length > 0

$: isTagSelected = (tag: Tag) => {
  return selectedTags.some((t) => t.id === tag.id)
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
      .then((res) => (tagResults = res))
      .catch((err) => console.error(err))
      .finally(() => (loading = false))
  } else {
    tagResults = []
  }
}
const toggleTag = (tag: Tag) => {
  isTagSelected(tag) ? removeTag(tag) : selectTag(tag)
  dispatch('change', selectedTags)
}
const selectTag = (tag: Tag) => {
  selectedTags = [...selectedTags, tag]
  dispatch('select', tag)
}
const removeTag = (tag: Tag) => {
  selectedTags = selectedTags.filter((t) => t.id !== tag.id)
  dispatch('remove', tag)
}
</script>

<div class="p-1">
  <div
    class="relative"
    use:clickOutside
    on:clickOutside={() => (resultsOpen = false)}
  >
    <!-- tag search -->
    <div class="relative">
      <input
        bind:value={search}
        type="text"
        placeholder={placeholder}
        on:input={onInput}
        class="w-full px-3 py-2 text-sm transition-all duration-100 ease-in-out rounded-md outline-none ring-0 hover:ring-2 focus:ring-2 hover:ring-white/20 focus:ring-orange-300 bg-white/10 focus:bg-transparent"
      />
      <div class="absolute inset-y-0 right-0 flex items-center p-1">
        {#if loading}
          <div class="text-orange-300 pointer-events-none">
            <Icon icon="ri:loader-5-line" class="w-5 h-5 animate-spin" />
          </div>
        {/if}
        {#if search?.length}
          <button on:click={clearSearch} class="p-1 rounded-md hover:bg-white/10">
            <Icon icon="fluent:dismiss-12-filled" class="w-4 h-4" />
          </button>
        {/if}
      </div>
    </div>
    <!-- tag results -->
    <div class="
      {resultsOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}
      absolute w-full p-2 bg-gray-800 rounded-md top-[calc(100%+0.25rem)] transition-all duration-100 ease-in-out
    ">
      {#each tagResults as tag}
        <button
          class="flex items-center justify-between w-full p-2 rounded-md hover:bg-white/10"
          on:click={() => toggleTag(tag)}
        >
          <div class="flex items-center gap-1 px-1">
            <span class="text-sm">{tag.name}</span>
            <span class="text-xs text-white/50">{tag._count.posts} post{tag._count.posts !== 1 ? 's' : ''}</span>
          </div>
          <Icon icon={isTagSelected(tag) ? 'fluent:checkbox-checked-24-filled' : 'fluent:checkbox-unchecked-24-filled'} class="w-5 h-5" />
        </button>
      {/each}
    </div>
  </div>
  <!-- selected tags -->
  {#if selectedTags?.length}
    <div>
      {#each selectedTags as tag}
        <span>{tag.name}</span>
      {/each}
    </div>
  {/if}
</div>
