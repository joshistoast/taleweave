<script lang="ts">
import type { Tag, Rating } from '@prisma/client'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Icon from '@iconify/svelte'
import Dropdown from '$lib/components/common/Dropdown.svelte'
import TagsInput from '$lib/components/TagsInput.svelte'
import { useRating, useRatingIcon } from '$lib/utils'

// TODO: sorting by date, rating, etc

// const sortOptions = [
//   { name: 'Date', value: 'date' },
//   { name: 'Rating', value: 'rating' },
//   { name: 'Title', value: 'title' },
// ]
const ratingOptions = ['s', 't', 'm', 'e']

export let search: string = $page.url.searchParams.get('search') || ''
export let tags: Tag[] = []
export let ratings = $page.url.searchParams.get('ratings') || undefined
// export let sorting = sortOptions[0]

$: selectedRatings = ratings?.split(',') || ['s', 't', 'm', 'e']
$: isRatingSelected = (rating: Rating | string) => selectedRatings.includes(rating)
const toggleRating = (rating: Rating | string) => {
  if (isRatingSelected(rating)) {
    selectedRatings = selectedRatings.filter((r) => r !== rating)
  } else {
    selectedRatings = [...selectedRatings, rating]
  }
  ratings = selectedRatings.join(',')
}

let stagedSearchParamsString: string
$: {
  let params = new URLSearchParams()
  search?.length ? params.set('search', search) : undefined
  tags?.length ? params.set('tags', tags.map((tag) => tag.name).join(',')) : undefined
  ratings ? params.set('ratings', ratings) : undefined
  // sorting ? params.set('sort', sorting.value) : undefined

  stagedSearchParamsString = params.toString()
}

const doSearch = () => {
  // navigate to new url
  goto(`${$page.url.pathname}?${stagedSearchParamsString.toString()}`)
}
</script>

<div class="flex flex-col gap-2 py-2">
  <div class="flex items-center gap-2 px-2">
    <input
      type="text"
      bind:value={search}
      on:keydown={(e) => e.key === 'Enter' && doSearch()}
      class="w-full px-4 py-2 text-sm bg-transparent border rounded-md outline-none placeholder-white/50 focus:placeholder-white/75 border-white/10"
      placeholder="Search by title..."
    />

    <div class="flex gap-1">
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
      <button title="Search posts" on:click={doSearch} class="flex items-center p-2 text-sm font-bold rounded-md text-white/60 hover:text-orange-300 hover:bg-white/10">
        <Icon icon="fluent:search-24-filled" class="w-6 h-6" />
        <span class="px-1">Search</span>
      </button>
    </div>
  </div>

  <div class="flex px-2">
    <div class="flex items-center gap-1">
      {#each ratingOptions as option}
        <button
          title="Include Rating {useRating(option)}"
          on:click={() => toggleRating(option)}
          class="flex items-center p-1 rounded-md { isRatingSelected(option) ? 'bg-white/10' : 'hover:bg-white/10' } text-white/50"
        >
          <Icon icon={useRatingIcon(option)} class="w-4 h-4" />
          <span class="px-1 text-xs font-semibold">{useRating(option)}</span>
          <Icon icon="{isRatingSelected(option) ? 'fluent:checkbox-checked-16-filled' : 'fluent:checkbox-unchecked-12-filled'}" class="w-4 h-4" />
        </button>
      {/each}
    </div>
  </div>

</div>
