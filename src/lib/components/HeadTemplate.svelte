<script lang="ts">
import { page as pageData } from '$app/stores'

$: ({ app, page } = $pageData.data)

$: title = page.title ? `${page.title} | ${app.title}` : app.title
$: description = page.description || app.description
$: robots = page.robots || 'index, follow'
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content={robots} />
</svelte:head>
