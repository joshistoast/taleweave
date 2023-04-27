<script lang="ts">
import type { ActionData } from './$types'
import { enhance } from '$app/forms'

export let form: ActionData
</script>

<form
  method="POST"
  class="grid gap-4"
  use:enhance
>
  <h1 class="text-4xl font-bold">Register</h1>

  <label class="grid">
    <span>Username</span>
    <input type="text" name="username" />
  </label>

  <label class="grid">
    <span>Password</span>
    <input type="password" name="password" />
  </label>

  {#if form?.message}
    <p class={ form?.success ? 'text-emerald-300' : 'text-rose-300' }>{form.message}</p>
  {/if}

  <button type="submit" class="p-1 bg-gray-800 hover:bg-gray-700">
    Register
  </button>
</form>

<p>Already have an account? <a href="/login">Log in instead</a></p>
