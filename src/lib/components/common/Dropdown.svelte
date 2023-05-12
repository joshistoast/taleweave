<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { clickOutside } from '$lib/utils'
import { onMount } from 'svelte'

const dispatch = createEventDispatcher()

let mounted = false
let open = false
let dropdownEl: HTMLElement
let alignRight = false

const doClose = () => {
  dispatch('close')
  open = false
}
const doOpen = () => {
  dispatch('open')
  open = true
}
const toggleOpen = () => {
  open ? doClose() : doOpen()
}

onMount(() => {
  mounted = true
})

$: {
  if (mounted) {
    dropdownEl.getBoundingClientRect().right > window.innerWidth - 20
      ? (alignRight = true)
      : (alignRight = false)
  } else {
    alignRight = false
  }
}
</script>

<div
  class="relative"
  use:clickOutside
  on:clickOutside={doClose}
>
  <slot
    name="trigger"
    {open}
    toggle={toggleOpen}
  />

  <div
    bind:this={dropdownEl}
    class="
      absolute z-10 mt-1 bg-gray-800 transition-all duration-100 ease-in-out rounded-md shadow-lg
      {open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}
      {alignRight ? 'right-0' : 'left-0'}
    "
  >
    <slot />
  </div>
</div>
