<script lang="ts">
import Icon from '@iconify/svelte'
/**
 * Specify the tab label
 * Alternatively, use the default slot (e.g., <Tab><span>Label</span></Tab>)
 */
export let label = ''
/** Specify the href attribute */
export let href = '#'
/** Set to `true` to disable the tab */
export let disabled = false
/** Specify the tabindex */
export let tabindex = 0
/** Set an id for the top-level element */
export let id = 'ccs-' + Math.random().toString(36)
/** Obtain a reference to the anchor HTML element */
export let ref = null
/** iconify id*/
export let icon: string | undefined = undefined

import { getContext } from 'svelte'
const { selectedTab, add, update, change } = getContext("Tabs")
add({ id, label, disabled, href })
$: selected = $selectedTab === id
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<li
  tabindex="-1"
  role="presentation"
  class="tabs__tab {disabled ? 'tab--disabled' : ''} {selected ? 'tab--selected' : ''}"
  {...$$restProps}
  on:click="{() => {
    if (!disabled) {
      update(id);
    }
  }}"
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:keydown="{({ key }) => {
    if (!disabled) {
      if (key === 'ArrowRight') {
        change(1);
      } else if (key === 'ArrowLeft') {
        change(-1);
      } else if (key === ' ' || key === 'Enter') {
        update(id);
      }
    }
  }}"
>
  <a
    bind:this="{ref}"
    role="tab"
    tabindex="{disabled ? -1 : tabindex}"
    aria-selected="{selected}"
    aria-disabled="{disabled}"
    {id}
    {href}
  >
    <slot>{label}</slot>
    {#if icon}
      <Icon {icon} class="w-4 h-4" />
    {/if}
  </a>
</li>

<style lang="postcss">
.tabs__tab {
  @apply appearance-none flex relative after:absolute after:w-0 after:-bottom-[1px] after:h-[1px] after:bg-orange-300;
}
.tabs__tab:not(disabled):hover > a {
  @apply bg-white/10;
}
.tab--disabled {
  @apply cursor-not-allowed text-gray-500;
}
.tab--selected {
  @apply after:w-full text-orange-300;
}
.tabs__tab > a {
  @apply px-4 py-2 flex gap-2 text-sm items-center font-medium transition-all duration-100 ease-in-out;
}
.tabs__tab:not(.tab--selected) {
  @apply text-white/50 hover:text-white/80;
}
</style>
