<script lang="ts">
import type { PageData } from './$types'

export let data: PageData

$: ({ author } = data)
</script>

{JSON.stringify(author)}
