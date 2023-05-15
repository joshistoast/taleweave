<script lang="ts">
import type { PageData } from './$types'
import { page } from '$app/stores'
import { enhance } from '$app/forms'
import Icon from '@iconify/svelte'
import PostStats from '$lib/components/PostStats.svelte'
import PostTags from '$lib/components/PostTags.svelte'

export let data: PageData

$: user = $page.data.user
$: ({ post, isBookmarked } = data)

$: bookmarked = isBookmarked
$: bookmarksCount = post._count?.bookmarks
$: featured = post.featured

const goBack = () => history.back()

const handleBookmark = () => {
  bookmarked = !bookmarked
  bookmarksCount += bookmarked ? 1 : -1
}
const handleDelete = async (e: any) => {
  let confirmed = confirm('Are you sure you want to delete this post?')
  if (confirmed) {
    (e.target as HTMLFormElement).submit()
  }
}
</script>

<svelte:head>
  <meta name="author" content={post.author.username} />
</svelte:head>

<header class="flex flex-col items-start gap-4 p-4 border-b border-white/10">
  <div class="flex items-center gap-4">
    <button class="flex items-center gap-2 text-sm text-white/50 hover:text-gray-100" on:click={goBack}>
      <Icon icon="fluent:arrow-left-24-filled" class="w-5 h-5" />
      <span>Back</span>
    </button>

    <form method="POST" action="/posts/{post.id}?/bookmark" use:enhance>
      <button on:click={handleBookmark} class="flex items-center gap-2 text-sm text-white/50 hover:text-gray-100">
        <Icon icon="{ bookmarked ? 'fluent:bookmark-24-filled' : 'fluent:bookmark-24-regular' }" class="w-5 h-5" />
        <span>Bookmark{ bookmarked ? 'ed' : '' }</span>
      </button>
    </form>

    {#if (post.author.id === user?.userId) || user?.role === 'admin'}
      <form method="POST" action="/posts/{post.id}?/delete" on:submit|preventDefault={handleDelete}>
        <button type="submit" class="flex items-center gap-2 text-sm text-white/50 hover:text-gray-100">
          <Icon icon="fluent:delete-24-filled" class="w-5 h-5" />
          <span>Delete</span>
        </button>
      </form>

      {#if (post.author.id === user?.userId)}
        <a href="/posts/{post.id}/edit" class="flex items-center gap-2 text-sm text-white/50 hover:text-gray-100">
          <Icon icon="fluent:edit-24-filled" class="w-5 h-5" />
          <span>Edit</span>
        </a>
      {/if}

      {#if user.role === 'admin'}
        <form method="POST" action="/posts/{post.id}?/feature" use:enhance>
          <button on:click={() => featured = !featured} class="flex items-center gap-2 text-sm {featured ? 'text-orange-300' : 'text-white/50'} hover:text-gray-100">
            <Icon icon="{featured ? 'fluent:flash-24-filled' : 'fluent:flash-24-regular'}" class="w-5 h-5" />
            <span>{featured ? 'Remove ' : ''}Feature</span>
          </button>
        </form>
      {/if}
    {/if}
  </div>

  <div class="pt-4">
    <p class="mb-1 text-xs text-white/50 lg:text-sm">Written by <a class="text-orange-300 hover:underline" href="/authors/{post.author.username}">{post.author.username}</a></p>
    <h1 class="font-serif text-4xl font-bold">{post.title}</h1>
    {#if post.description}
      <p class="mt-4 mb-3 text-sm text-white/50">{post.description}</p>
    {/if}
  </div>

  {#if post.tags?.length}
    <PostTags tags={post.tags} />
  {/if}
</header>

<div class="w-full p-4 border-b border-white/10">
  <PostStats
    bookmarks={bookmarksCount}
    rating={post.rating}
  />
</div>

<div class="w-full p-4 prose-sm prose break-words max-w-none lg:prose-base">
  {@html post.content}
</div>
