<script lang="ts">
import { createEventDispatcher, afterUpdate, setContext, tick } from 'svelte'
import { writable, derived, type Readable } from 'svelte/store'
import Icon from '@iconify/svelte'
import { goto } from '$app/navigation'

/** Specify the selected tab index */
export let selected = 0
/**
 * Specify the ARIA label for the chevron icon
 */
export let iconDescription = 'Show Menu Options'

const dispatch = createEventDispatcher()

type Tab = {
  id: string
  label: string
  disabled: boolean
  href?: string
}
const tabs = writable<Tab[]>([])
const tabsById: Readable<any> = derived(tabs, (_) =>
  _.reduce((a, c: any) => ({ ...a, [c.id]: c }), {})
)
const selectedTab = writable<string | undefined>(undefined)
const content = writable<Array<any> | undefined>([])
const contentById = derived(content, (_) =>
  _?.reduce((a, c: any) => ({ ...a, [c.id]: c }), {})
)
const selectedContent = writable(undefined)
let refTabList: HTMLUListElement | null = null
setContext('Tabs', {
  tabs,
  contentById,
  selectedTab,
  selectedContent,
  add: (data: any) => {
    tabs.update((_) => [..._, { ...data, index: _.length }])
  },
  addContent: (data: any) => {
    content.update((_) => [..._, { ...data, index: _?.length ?? 0 }])
  },
  update: (id: string) => {
    currentIndex = $tabsById[id].index
  },
  change: async (direction: number) => {
    let index = currentIndex + direction
    if (index < 0) {
      index = $tabs.length - 1
    } else if (index >= $tabs.length) {
      index = 0
    }
    let disabled = $tabs[index].disabled
    while (disabled) {
      index = index + direction
      if (index < 0) {
        index = $tabs.length - 1
      } else if (index >= $tabs.length) {
        index = 0
      }
      disabled = $tabs[index].disabled
    }
    currentIndex = index
    await tick()
    const activeTab: Element | undefined = refTabList?.querySelectorAll("[role='tab']")[currentIndex]
    // focus on the active tab if it can be focused
    if (activeTab && activeTab instanceof HTMLElement) {
      activeTab.focus()
    }
  },
})
afterUpdate(() => {
  selected = currentIndex;
  if (prevIndex > -1 && prevIndex !== currentIndex) {
    dispatch('change', currentIndex)
  }
  prevIndex = currentIndex
})
let dropdownHidden = true
let currentIndex = selected
let prevIndex = -1
$: currentIndex = selected
$: currentTab = $tabs[currentIndex] || undefined
$: currentContent = $content ? $content[currentIndex] || undefined : undefined
$: {
  if (currentTab) {
    selectedTab.set(currentTab.id)
  }
  if (currentContent) {
    selectedContent.set(currentContent.id)
  }
}
$: if ($selectedTab) {
  dropdownHidden = true
}
</script>

<div
  role="navigation"
  {...$$restProps}
>
  <div class="relative lg:hidden" role="listbox">
    <select
      class="w-full px-4 py-3 border-b appearance-none border-white/10 bg-inherit"
      on:change="{(e) => {
        currentIndex = e.target.selectedIndex
        const selectedHref = $tabs[currentIndex].href || undefined
        if (selectedHref) {
          goto(selectedHref)
        }
      }}"
      role="tablist"
    >
      {#each $tabs as tab, i}
        <option
          value="{i}"
          selected="{i === currentIndex}"
          disabled="{tab.disabled}"
        >
          {tab.label}
        </option>
      {/each}
    </select>
    <div class="absolute -translate-y-1/2 pointer-events-none right-2 top-1/2">
      <Icon icon="ion:chevron-down" class="w-6 h-6" title={iconDescription} />
    </div>
  </div>
  <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
  <ul
    bind:this="{refTabList}"
    role="tablist"
    class="hidden w-full border-b border-white/10 lg:flex"
  >
    <slot />
  </ul>
</div>

<slot name="content" />
