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

  <h1 class="text-4xl font-bold">Login</h1>

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
    Login
  </button>

</form>

<p>Don't have an account yet? <a href="/register">Create an account</a></p>
