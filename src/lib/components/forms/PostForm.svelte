<script lang="ts">
import { applyAction, enhance, type SubmitFunction } from '$app/forms'
import type { Post } from '@prisma/client'
import Editor from '$lib/components/Editor.svelte'

export let post: Post | undefined = undefined

let defaultValues = {
  id: post?.id ?? undefined,
  title: post?.title ?? '',
  description: post?.description ?? '',
  content: post?.content ?? '',
  rating: post?.rating ?? 's',
  published: post?.published ?? false,
}
$: defaultValues
$: isEditing = !!post?.id
</script>

<form
  method="POST"
  use:enhance={() => {
    // required to prevent the form resetting on submit
    return async ({ result }) => {
      await applyAction(result)
    }
  }}
>
  <Editor {...defaultValues} />
</form>
