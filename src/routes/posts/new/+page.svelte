<script lang="ts">
import PostForm from '$lib/components/forms/PostForm.svelte'
import type { ActionData } from './$types'

export let form: ActionData
</script>

{#if form?.message}
  <div class="px-3 py-2 border-b border-gray-800 {form.success ? 'bg-emerald-500/10' : 'bg-rose-500/10'}">
    <p class={form.success ? 'text-green-300' : 'text-rose-300'}>{form.message}</p>
  </div>
{/if}

<PostForm />
