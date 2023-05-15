<script lang="ts">
import type { PageServerData } from './$types'
import Feed from '$lib/components/Feed.svelte'
import Logo from '$lib/components/Logo.svelte'
import Icon from '@iconify/svelte'

export let data: PageServerData

$: ({ recentlyFeatured, recentlyPublished } = data)
</script>

<div class="grid gap-4">

  <div class="p-4 mx-4 mt-4 rounded-md bg-white/10">
    <p>
      Taleweave as a platform is in alpha and under active development. If you find any bugs or issues, please file an issue on our <a class="text-orange-300 hover:text-orange-400" target="_blank" href="https://github.com/joshwcorbett/taleweave">Github</a>.
    </p>
  </div>

  <div class="grid gap-4 px-4 pt-8">
    <div class="w-12 h-12 p-2 text-orange-300 bg-white/5 lg:p-3 lg:w-20 lg:h-20 rounded-xl">
      <Logo />
    </div>
    <h1 class="font-serif text-2xl font-bold lg:text-4xl">Welcome to Taleweave</h1>
    <p class="text-sm">Taleweave is an open-source, and easy to use platform for writers and authors alike to share their stories and works of literature freely. On this platform you as an author can create an account, write and edit your stories, and publish them for the world to see and appreciate. Taleweave is by writers, for writers.</p>
    <div class="flex flex-col gap-2 py-4 text-sm font-bold lg:flex-row lg:items-center">
      <a class="flex items-center gap-2 px-4 py-3 text-orange-300 transition-all duration-100 ease-in-out rounded-md group bg-orange-400/10 hover:bg-orange-400/20" href="/posts">
        <span>Start Reading</span>
        <Icon icon="fluent:arrow-right-24-filled" class="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
      <a class="flex items-center gap-2 px-4 py-3 transition-all duration-100 ease-in-out rounded-md group text-white/60 hover:text-gray-100 hover:bg-white/10" href="/posts/new">
        <span>Start Writing</span>
        <Icon icon="fluent:edit-24-filled" class="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
      </a>
    </div>
  </div>

  <div class="grid gap-4 p-4 border-t border-orange-300/20 bg-orange-400/5">
    <div class="flex flex-col w-full gap-4 lg:items-center lg:flex-row lg:justify-between">
      <div>
        <h3 class="font-bold text-orange-300">Featured</h3>
        <p class="text-sm text-white/50">Hand-picked by our maintainers, these are what we consider must-reads.</p>
      </div>
      <a class="flex items-center gap-1 font-bold text-white/50 hover:text-orange-300" href="/posts?featured=true">
        <span class="text-sm">View All</span>
        <Icon icon="fluent:arrow-right-24-filled" class="w-4 h-4" />
      </a>
    </div>
    <Feed showFeaturedFlags={false} posts={recentlyFeatured} />
  </div>

  <div class="grid gap-4 p-4 border-t border-white/10">
    <div class="flex flex-col w-full gap-4 lg:items-center lg:flex-row lg:justify-between">
      <div>
        <h3 class="font-bold">Recently Published</h3>
      </div>
      <a class="flex items-center gap-1 font-bold text-white/50 hover:text-orange-300" href="/posts">
        <span class="text-sm">View All</span>
        <Icon icon="fluent:arrow-right-24-filled" class="w-4 h-4" />
      </a>
    </div>
    <Feed posts={recentlyPublished} />
  </div>

</div>
