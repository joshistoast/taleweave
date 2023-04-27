<script lang="ts">
import { enhance } from '$app/forms'
import Editor from '$lib/components/Editor.svelte'
import type { PageData } from './$types'

export let data: PageData

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

  <Editor
    bind:content
    bind:title
    bind:description
    bind:published
  />

</form>
