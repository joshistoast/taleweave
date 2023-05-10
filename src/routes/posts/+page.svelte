<script lang="ts">
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'
import TagsInput from '$lib/components/TagsInput.svelte'

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

  <TagsInput bind:selectedTags={tags} />
</header>

<div class="p-4">
  <Feed {posts} showFeaturedFlags={!props.isFeatured} />
</div>
