<script lang="ts">
import { enhance, applyAction } from '$app/forms'
import type { PageServerData, ActionData } from './$types'
import Icon from '@iconify/svelte'

export let data: PageServerData
export let form: ActionData

$: ({ props } = data)
</script>

<div class="p-4">
  <form
    method="POST"
    class="flex flex-col gap-4"
    use:enhance={() => {
    // required to prevent the form resetting on submit
      return async ({ result }) => {
        await applyAction(result)
      }
    }}
  >

    {#if form?.message}
      <p class={ form?.success ? 'text-emerald-300' : 'text-rose-300' }>{form.message}</p>
    {/if}

    <label class="grid">
      <span class="text-sm text-gray-400">Display Name</span>
      <input name="displayName" required type="text" placeholder="Display Name" value={props.user?.displayName} class="px-3 py-2 rounded-md bg-white/10" />
    </label>

    <label class="grid">
      <span class="text-sm text-gray-400">Bio</span>
      <textarea name="bio" placeholder="Bio" class="h-40 px-3 py-2 rounded-md resize-none bg-white/10">{props.user?.bio}</textarea>
    </label>

    <button type="submit" class="flex gap-2 px-3 py-2 text-orange-300 transition-all duration-100 ease-in-out rounded-md bg-orange-400/10 hover:bg-orange-400/20">
      <Icon icon="fluent:save-24-filled" class="w-6 h-6" />
      <span>Save</span>
    </button>

  </form>
</div>
