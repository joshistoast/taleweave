<script lang="ts">
import type { PageData, ActionData } from './$types'
import { page } from '$app/stores'
import { enhance } from '$app/forms'
import Icon from '@iconify/svelte'
import PostStats from '$lib/components/PostStats.svelte'
import PostTags from '$lib/components/PostTags.svelte'
import PostComment from '$lib/components/PostComment.svelte'

export let data: PageData
export let form: ActionData

let score: number | undefined

$: user = $page.data.user
$: ({ post, isBookmarked } = data)

$: bookmarked = isBookmarked
$: bookmarksCount = post._count?.bookmarks
$: featured = post.featured

$: score = data.score?.value
$: scoreIsValid = score !== undefined && score >= 0 && score <= 5

const goBack = () => history.back()

const handleBookmark = () => {
  bookmarked = !bookmarked
  bookmarksCount += bookmarked ? 1 : -1
}
const handleDelete = async (e: SubmitEvent) => {
  let confirmed = confirm('Are you sure you want to delete this post?')
  if (confirmed) {
    (e.target as HTMLFormElement).submit()
  }
}
</script>

<svelte:head>
  <meta name="author" content={post.author.displayName} />
</svelte:head>

<header class="flex flex-col items-start gap-4 p-4 border-b border-white/10">
  <div class="flex items-center max-w-full gap-4 overflow-x-auto">
    <button class="flex items-center gap-2 text-sm shrink-0 text-white/50 hover:text-gray-100" on:click={goBack}>
      <Icon icon="fluent:arrow-left-24-filled" class="w-5 h-5" />
      <span>Back</span>
    </button>

    <form method="POST" action="/posts/{post.id}?/bookmark" use:enhance>
      <button on:click={handleBookmark} class="flex items-center gap-2 text-sm shrink-0 text-white/50 hover:text-gray-100">
        <Icon icon="{ bookmarked ? 'fluent:bookmark-24-filled' : 'fluent:bookmark-24-regular' }" class="w-5 h-5" />
        <span>Bookmark{ bookmarked ? 'ed' : '' }</span>
      </button>
    </form>

    {#if (post.author.id === user?.userId) || user?.role === 'admin'}
      <form method="POST" action="/posts/{post.id}?/delete" class="shrink-0" on:submit|preventDefault={handleDelete}>
        <button type="submit" class="flex items-center gap-2 text-sm shrink-0 text-white/50 hover:text-gray-100">
          <Icon icon="fluent:delete-24-filled" class="w-5 h-5" />
          <span>Delete</span>
        </button>
      </form>

      {#if (post.author.id === user?.userId)}
        <a href="/posts/{post.id}/edit" class="flex items-center gap-2 text-sm shrink-0 text-white/50 hover:text-gray-100">
          <Icon icon="fluent:edit-24-filled" class="w-5 h-5" />
          <span>Edit</span>
        </a>
      {/if}

      {#if user.role === 'admin'}
        <form method="POST" action="/posts/{post.id}?/feature" class="shrink-0" use:enhance>
          <button on:click={() => featured = !featured} class="flex items-center shrink-0 gap-2 text-sm {featured ? 'text-orange-300' : 'text-white/50'} hover:text-gray-100">
            <Icon icon="{featured ? 'fluent:flash-24-filled' : 'fluent:flash-24-regular'}" class="w-5 h-5" />
            <span>{featured ? 'Remove ' : ''}Feature</span>
          </button>
        </form>
      {/if}
    {/if}
  </div>

  <div class="pt-4">
    <p class="mb-1 text-xs text-white/50 lg:text-sm">Written by <a class="text-orange-300 hover:underline" href="/authors/{post.author.username}">{post.author.displayName}</a></p>
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
    comments={post._count?.comments}
  />
</div>

<div class="w-full p-4 prose-sm prose break-words max-w-none lg:prose-base">
  {@html post.content}
</div>

{#if (post.author.id !== user?.userId) && user?.userId}
  <div class="grid w-full gap-4 px-4 py-10 border-t border-white/10">
    <div>
      <h2 class="font-serif text-2xl font-bold lg:text-4xl">How was it?</h2>
      <p class="text-sm text-white/50">Let the author know what you thought of their post by rating it out of 5.</p>
    </div>

    {#if form?.message}
      <p class="text-sm {form.success ? 'text-emerald-300' : 'text-rose-400'}">{form.message}</p>
    {/if}

    <form
      method="POST"
      action="/posts/{post.id}?/score"
      class="flex flex-col items-start gap-4"
      use:enhance
    >
      <div class="flex items-center gap-1">
        {#each Array.from({ length: 5 }) as s, i}
          <button on:click|preventDefault={() => score = i} class="{(score !== undefined && score >= i) ? 'text-orange-300' : 'text-white/50'} hover:text-orange-300 hover:scale-105">
            <Icon icon="{(score !== undefined && score >= i) ? 'fluent:star-24-filled' : 'fluent:star-24-regular'}" class="w-10 h-10" />
          </button>
        {/each}
      </div>
      <input type="hidden" name="value" value="{score}" />
      <button disabled={!scoreIsValid} class="flex items-center gap-2 px-3 py-2 text-orange-300 rounded-md hover:bg-orange-400/20 disabled:bg-white/10 disabled:text-white/50 bg-orange-400/10">
        <Icon icon="fluent:checkmark-24-filled" class="w-5 h-5" />
        <span>Submit</span>
      </button>
    </form>
  </div>
{/if}

<!-- comments -->
<div class="w-full px-4 py-6 border-t border-white/10" id="comments">
  <h3 class="font-serif text-xl lg:text-4xl">Comments ({post._count.comments})</h3>

  <!-- comment compose -->
  <form action="/posts/{post.id}?/addComment" method="POST" use:enhance>
    <div class="flex flex-col items-start gap-4 mt-4">
      <textarea
        name="content"
        rows="4"
        class="w-full p-4 bg-transparent border rounded-md resize-none text-white/50 border-white/10 focus:outline-none focus:border-orange-300"
        placeholder="Write a comment..."
        required
      ></textarea>
      <button class="flex items-center gap-2 px-3 py-2 text-orange-300 rounded-md hover:bg-orange-400/20 bg-orange-400/10">
        <Icon icon="fluent:checkmark-24-filled" class="w-5 h-5" />
        <span>Submit</span>
      </button>
    </div>
  </form>

  <div class="grid gap-2 py-4">
    <!-- comments -->
    {#each post.comments as comment}
      <PostComment {comment} />
    {/each}
  </div>
</div>
