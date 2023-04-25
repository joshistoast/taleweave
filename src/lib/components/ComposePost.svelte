<script lang="ts">
import { enhance } from '$app/forms'
import { page } from '$app/stores'

</script>

<form
  action="?/createPost"
  method="POST"
  class="grid border-y border-gray-8"
  use:enhance
>
  <textarea
    id="content"
    name="content"
    class="p-2 bg-transparent resize-none h-30 focus:bg-gray-9 outline-none"
    placeholder="Write something here..."></textarea>

  <button
    type="submit"
    class="bg-emerald-500/10 text-emerald-500 p-1 font-bold hover:bg-emerald/15"
  >
    Post
  </button>
</form>
