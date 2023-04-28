<script lang="ts">
import { page } from '$app/stores'
import type { PageData } from './$types'
import Feed from '$lib/components/Feed.svelte'

$: user = $page.data.user
export let data: PageData

$: ({ posts } = data)
</script>

<Feed {posts} />
