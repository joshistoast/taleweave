<script lang="ts">
import { page } from '$app/stores'
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

$: user = $page.data.user
export let data: PageData

$: ({
  posts,
  props,
} = data)
</script>

<header class="py-4">
  <h1 class="text-lg font-bold {props.isFeatured ? 'text-orange-300' : 'text-gray-300'}">{props.title}</h1>
  <p class="text-sm text-gray-400">{props.description}</p>
</header>

<Feed {posts} showFeaturedFlags={!props.isFeatured} />
