<script lang="ts">
import { page } from '$app/stores'
// import { enhance } from '$app/forms'
$: user = $page.data.user
</script>

<form method="POST" class="grid gap-4">
  <h1 class="text-4xl font-bold">Log Out</h1>

  {#if !user?.userId}
    <p>You're already logged out</p>
  {:else}
    <p>Are you sure you want to log out?</p>

    <div class="grid gap-2 text-center lg:grid-cols-2">
      <a href="/" class="p-1 bg-gray-900 hover:bg-gray-800">
        No, Cancel
      </a>

      <button type="submit" class="p-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
        Yes, Log Out
      </button>
    </div>

  {/if}
</form>
