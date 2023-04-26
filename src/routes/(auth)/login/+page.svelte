<script lang="ts">
import { enhance } from '$app/forms'
import { dev } from '$app/environment'

const testLogin = () => {
  const username = document.querySelector('input[name="username"]') as HTMLInputElement
  const password = document.querySelector('input[name="password"]') as HTMLInputElement

  username.value = 'joshistoast'
  password.value = 'Vacation1'
}

</script>

<form method="POST" class="grid gap-4" use:enhance>
  <h1 class="text-4xl font-bold">Login</h1>
  <label class="grid">
    <span>Username</span>
    <input type="text" name="username" />
  </label>

  <label class="grid">
    <span>Password</span>
    <input type="password" name="password" />
  </label>

  <button type="submit" class="bg-gray-800 p-1 hover:bg-gray-700">
    Login
  </button>

</form>

{#if dev}
  <button on:click={testLogin}>
    Test Login
  </button>
{/if}

<p>Don't have an account yet? <a href="/register">Create an account</a></p>
