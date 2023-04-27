<script lang="ts">
import type { PageData } from './$types'
import { page } from '$app/stores'
import Icon from '@iconify/svelte'
import { enhance } from '$app/forms'

export let data: PageData

$: user = $page.data.user
$: ({ post } = data)

const goBack = () => history.back()
</script>

<svelte:head>
  <meta name="author" content={post.author.username} />
  <meta name="description" content={post.description || undefined} />
</svelte:head>

<header class="flex flex-col items-start gap-4 p-4 border-b border-gray-800">
  <div class="flex items-center gap-4">
    <button class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100" on:click={goBack}>
      <Icon icon="fluent:arrow-left-24-filled" class="w-5 h-5" />
      <span>Back</span>
    </button>

    {#if post.authorId === user?.userId}
      <form action="/posts/{post.id}?/delete" method="POST">
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
    <p class="mb-1 text-sm text-gray-400">Written by <a class="text-orange-300 hover:underline" href="/authors/{post.author.username}">{post.author.username}</a></p>
    <h1 class="font-serif text-lg lg:text-4xl">{post.title}</h1>
  </div>
</header>

<div class="w-full p-4 prose prose-invert max-w-none">
  {@html post.content}
</div>
