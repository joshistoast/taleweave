<script lang="ts">
import type { PageData } from './$types'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'
import { enhance } from '$app/forms'

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
  <meta name="description" content={post.description || undefined} />
</svelte:head>

<header class="flex flex-col items-start gap-4 p-4 border-b border-gray-800 lg:px-0">
  <div class="flex items-center gap-4">
    <button class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100" on:click={goBack}>
      <Icon icon="fluent:arrow-left-24-filled" class="w-5 h-5" />
      <span>Back</span>
    </button>

    <form method="POST" action="/posts/{post.id}?/bookmark" use:enhance>
      <button on:click={() => bookmarked = !bookmarked} class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100">
        <Icon icon="{ bookmarked ? 'fluent:bookmark-24-filled' : 'fluent:bookmark-24-regular' }" class="w-5 h-5" />
        <span>Bookmark{ bookmarked ? 'ed' : '' }</span>
      </button>
    </form>

    {#if post.authorId === user?.userId}
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
    <h1 class="font-serif text-xl font-bold lg:text-4xl">{post.title}</h1>
    {#if post.description}
      <p class="mt-1 text-sm text-gray-500">{post.description}</p>
    {/if}
  </div>
</header>

<div class="w-full p-4 prose-sm prose lg:pl-0 lg:prose-base max-w-none">
  {@html post.content}
</div>
