<script lang="ts">
import { enhance, type SubmitFunction } from '$app/forms'
import type { Post } from '@prisma/client'
import Editor from '$lib/components/Editor.svelte'

export let post: Post | undefined = undefined
export let submit: SubmitFunction = () => {}

let defaultValues = {
  title: post?.title ?? '',
  description: post?.description ?? '',
  content: post?.content ?? '',
  rating: post?.rating ?? 's',
  published: post?.published ?? false,
}

$: isEditing = !!post?.id
</script>

<form
  method="POST"
  use:enhance={submit}
>
  <Editor {...defaultValues} />
</form>
