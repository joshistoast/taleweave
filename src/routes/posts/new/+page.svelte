<script lang="ts">
import { enhance } from '$app/forms'
import Editor from '$lib/components/Editor.svelte'
import type { ActionData } from './$types'

let content = ''
let description = ''
let title = ''
let published = false
let rating: string

export let form: ActionData
</script>

<form
  action="/posts/new"
  method="POST"
  class="flex flex-col flex-1"
  use:enhance
>

  {#if form?.message}
    <div class="px-3 py-2 border-b border-gray-800 {form.success ? 'bg-emerald-500/10' : 'bg-rose-500/10'}">
      <p class={form.success ? 'text-green-300' : 'text-rose-300'}>{form.message}</p>
    </div>
  {/if}

  <Editor
    bind:content
    bind:title
    bind:description
    bind:published
    bind:rating
  />

</form>
