<script lang="ts">
import { enhance } from '$app/forms'
import Editor from '$lib/components/Editor.svelte'

let descriptionExpanded = false
let content = ''
</script>

<form
  action="/posts?/createPost"
  method="POST"
  class="h-full flex flex-col"
  use:enhance
>

  <div class="border-b border-gray-800 bg-gray-900/50 grid">
    <input type="text" required name="title" class="py-3 px-4 bg-transparent border-b border-gray-800 outline-none" placeholder="Title" />

    <div class="flex flex-col">
      <button
        type="button"
        class="flex w-full px-3 py-2 hover:bg-gray-800 items-center font-bold text-xs uppercase text-gray-4 gap-4"
        on:click={() => (descriptionExpanded = !descriptionExpanded)}
      >
        <span>Description</span>
        <span class="i-fluent-chevron-down-24-filled {descriptionExpanded ? 'transform rotate-180' : ''}" />
      </button>

      {#if descriptionExpanded}
        <textarea
          name="description"
          class="p-3 w-full text-sm bg-transparent hover:bg-gray-800 focus:bg-gray-800 outline-none"
          placeholder="Description"
        ></textarea>
      {/if}
    </div>
  </div>

  <Editor bind:content />
  <input type="hidden" name="content" value={content} />

  <!-- <textarea
    id="content"
    name="content"
    class="p-5 bg-transparent flex-1 overflow-auto resize-none w-full outline-none"
    placeholder="Start writing..."
    required
    value={content}
  ></textarea> -->

  <div class="flex gap-4 p-4 justify-between border-t border-gray-800">
    <div></div>
    <button
      type="submit"
      class="bg-emerald-500/10 hover:bg-emerald-500/20 text-sm text-emerald-500 px-3 py-2 rounded-sm font-bold hover:bg-emerald/15"
    >
      Save
    </button>
  </div>
</form>
