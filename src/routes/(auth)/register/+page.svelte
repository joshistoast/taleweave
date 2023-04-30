<script lang="ts">
import type { ActionData } from './$types'
import { enhance } from '$app/forms'

export let form: ActionData

let username: string
let password: string
let confirmPassword: string

$: passwordsMatch = password === confirmPassword
$: canSubmit = username && password && passwordsMatch
</script>

<form
  method="POST"
  class="grid gap-4 p-4"
  use:enhance
>

  <label class="grid">
    <span>Username</span>
    <input bind:value={username} class="px-3 py-2 rounded-md" type="text" name="username" required />
  </label>

  <label class="grid">
    <span>Password</span>
    <input bind:value={password} class="px-3 py-2 rounded-md" type="password" name="password" required />
  </label>

  <label class="grid">
    <span>Confirm Password</span>
    <input bind:value={confirmPassword} class="px-3 py-2 rounded-md" type="password" name="password" required />
    {#if confirmPassword?.length && !passwordsMatch}
      <span class="text-rose-300">Passwords do not match</span>
    {/if}
  </label>

  {#if form?.message}
    <p class={ form?.success ? 'text-emerald-300' : 'text-rose-300' }>{form.message}</p>
  {/if}

  <button disabled={!canSubmit} type="submit" class="px-3 py-2 font-bold rounded-md disabled:opacity-50 disabled:pointer-events-none bg-white/10 hover:bg-white/20">
    Register
  </button>

  <p>Already have an account? <a href="/login">Log in instead</a></p>
</form>
