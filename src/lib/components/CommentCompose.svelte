<script lang="ts">
import Icon from '@iconify/svelte'
import { enhance } from '$app/forms'

export let postId: string

let commentContent: string
$: isCommentValid = commentContent?.length > 0

</script>

<form action="/posts/{postId}?/addComment" method="POST" use:enhance>
  <div class="flex flex-col items-start gap-4 mt-4">
    <textarea
      name="content"
      rows="4"
      class="w-full p-4 bg-transparent border rounded-md resize-none text-white/50 border-white/10 focus:outline-none focus:border-orange-300"
      placeholder="Write a comment..."
      required
      bind:value={commentContent}
    ></textarea>
    <button
      class="
        flex items-center gap-2 px-3 py-2 rounded-md
        {isCommentValid ? 'hover:bg-orange-400/20 bg-orange-400/10 text-orange-300' : 'bg-white/10 text-white/50'}
      "
      disabled={!isCommentValid}
    >
      <Icon icon="fluent:comment-add-24-filled" class="w-5 h-5" />
      <span>Add Comment</span>
    </button>
  </div>
</form>
