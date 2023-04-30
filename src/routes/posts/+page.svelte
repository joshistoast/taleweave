<script lang="ts">
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

export let data: PageData

$: ({
  posts,
  props,
} = data)
</script>

<header class="p-4 border-b lg:px-0 border-white/10">
  <h1 class="text-lg font-bold {props.isFeatured ? 'text-orange-300' : 'text-gray-300'}">{props.title}</h1>
  <p class="text-sm text-gray-400">{props.description}</p>
</header>

<div class="p-2 lg:pl-0">
  <Feed {posts} showFeaturedFlags={!props.isFeatured} />
</div>
