<script lang="ts">
import type { PageData, ActionData } from './$types'
import PostForm from '$lib/components/forms/PostForm.svelte'

export let data: PageData
export let form: ActionData

$: ({ post } = data)
</script>

{#if form?.message}
  <div class="px-3 py-2 {form.success ? 'bg-emerald-500/10' : 'bg-rose-500/10'}">
    <p class="{form.success ? 'text-emerald-300' : 'text-rose-300'}">{ form.message }</p>
  </div>
{/if}

<PostForm {post} />
