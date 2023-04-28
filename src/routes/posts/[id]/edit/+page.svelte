<script lang="ts">
import { enhance } from '$app/forms'
import Editor from '$lib/components/Editor.svelte'
import type { PageData, ActionData } from './$types'

export let data: PageData
export let form: ActionData

let {
  content,
  description,
  title,
  published,
} = data.post
</script>

<form
  method="POST"
  class="flex flex-col h-full"
>

  {#if form?.message}
    <p class="{form.success ? 'text-emerald-300' : 'text-rose-300'}">{ form.message }</p>
  {/if}

  <Editor
    bind:content
    bind:title
    bind:description
    bind:published
  />

</form>
