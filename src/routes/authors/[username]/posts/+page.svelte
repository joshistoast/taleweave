<script lang="ts">
import type { PageData } from './$types'
// import Post from '$lib/components/Post.svelte'
import Feed from '$lib/components/Feed.svelte'

export let data: PageData
$: ({ posts } = data)
</script>

<Feed {posts} />
