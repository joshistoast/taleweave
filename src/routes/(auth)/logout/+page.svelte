<script lang="ts">
import { page } from '$app/stores'
// import { enhance } from '$app/forms'
$: user = $page.data.user
</script>

<form method="POST" class="grid gap-4 p-4">
  <p>Are you sure you want to log out?</p>

  <div class="grid gap-2 text-center lg:grid-cols-2">
    <a href="/" class="px-3 py-2 bg-gray-900 rounded-md hover:bg-gray-800">
      No, Cancel
    </a>

    <button type="submit" class="px-3 py-2 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
      Yes, Log Out
    </button>
  </div>
</form>
