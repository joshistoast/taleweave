<script lang="ts">
import { page } from '$app/stores'

const { username } = $page.params
</script>

<h1 class="text-lg lg:text-4xl font-bold">{username}</h1>

<nav>
  <a href="/authors/{username}">About</a>
  <a href="/authors/{username}/posts">Posts</a>
</nav>

<div>
  <slot />
</div>
