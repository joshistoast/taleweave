<script lang="ts">
import { enhance } from '$app/forms'
import Editor from '$lib/components/Editor.svelte'

let content = ''
let description = ''
let title = ''
let published = false
</script>

<form
  action="/posts/new"
  method="POST"
  class="flex flex-col h-full"
  use:enhance={({ form, data, action, cancel, submitter }) => {
    return async ({ result, update }) => {
      console.log('result', result)
    }
  }}
>

  <Editor
    bind:content
    bind:title
    bind:description
    bind:published
  />

</form>
