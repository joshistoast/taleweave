<script lang="ts">
import { page } from '$app/stores'
import { enhance } from '$app/forms'
$: user = $page.data.user
</script>

<form method="POST" class="grid gap-4" use:enhance>
  <h1 class="text-4xl font-bold">Log Out</h1>

  {#if !user?.userId}
    <p>You're already logged out</p>
  {:else}
    <p>Are you sure you want to log out?</p>

    <div class="grid lg:grid-cols-2 text-center gap-2">
      <a href="/" class="p-1 bg-gray-900">
        No, Cancel
      </a>

      <button type="submit" class="bg-rose-5/10 text-rose-500 p-1">
        Yes, Log Out
      </button>
    </div>

  {/if}
</form>
