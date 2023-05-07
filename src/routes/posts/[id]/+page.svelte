<script lang="ts">
import type { PageData } from './$types'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'
import { enhance } from '$app/forms'
import PostStats from '$lib/components/PostStats.svelte'

export let data: PageData

$: user = $page.data.user
$: ({ post, isBookmarked } = data)

$: bookmarked = isBookmarked

const goBack = () => history.back()

const handleDelete = async (e: any) => {
  // confirm dialog then submit action
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
    <button class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100" on:click={goBack}>
      <Icon icon="fluent:arrow-left-24-filled" class="w-5 h-5" />
      <span>Back</span>
    </button>

    <form method="POST" action="/posts/{post.id}?/bookmark" use:enhance>
      <button on:click={() => user?.userId ? bookmarked = !bookmarked : false} class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100">
        <Icon icon="{ bookmarked ? 'fluent:bookmark-24-filled' : 'fluent:bookmark-24-regular' }" class="w-5 h-5" />
        <span>Bookmark{ bookmarked ? 'ed' : '' }</span>
      </button>
    </form>

    {#if post.author.id === user?.userId}
      <form method="POST" action="/posts/{post.id}?/delete" on:submit|preventDefault={handleDelete}>
        <button type="submit" class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100">
          <Icon icon="fluent:delete-24-filled" class="w-5 h-5" />
          <span>Delete</span>
        </button>
      </form>

      <a href="/posts/{post.id}/edit" class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100">
        <Icon icon="fluent:edit-24-filled" class="w-5 h-5" />
        <span>Edit</span>
      </a>
    {/if}
  </div>

  <div class="pt-4">
    <p class="mb-1 text-xs text-gray-400 lg:text-sm">Written by <a class="text-orange-300 hover:underline" href="/authors/{post.author.username}">{post.author.username}</a></p>
    <h1 class="font-serif text-4xl font-bold">{post.title}</h1>
    {#if post.description}
      <p class="mt-4 mb-3 text-sm text-gray-400">{post.description}</p>
    {/if}
  </div>
</header>

<div class="w-full p-4 border-b border-white/10">
  <PostStats
    bookmarks={post._count?.bookmarks}
    rating={post.rating}
  />
</div>

<div class="w-full p-4 prose-sm prose break-words max-w-none lg:prose-base">
  {@html post.content}
</div>
