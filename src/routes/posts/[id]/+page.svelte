<script lang="ts">
import type { PageData } from './$types'
import Post from '$lib/components/Post.svelte'

export let data: PageData

$: ({ post } = data)

const goBack = () => history.back()
</script>

<header class="flex border-b border-gray-800">
  <button
    on:click={goBack}
    class="p-2 text-gray-5 hover:bg-gray-900 flex w-full items-center gap-2 hover:text-gray-1 text-sm font-bold"
  >
    <span class="i-fluent-arrow-left-24-filled" />
    <span>Back</span>
  </button>
</header>

<h1 class="text-lg lg:text-4xl font-bold">{post.title}</h1>

<div class="prose prose-invert prose-sm max-w-none w-full">
  {@html post.content}
</div>
