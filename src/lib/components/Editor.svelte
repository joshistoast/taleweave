<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Icon from '@iconify/svelte'
import Tab from '$lib/components/common/Tab.svelte'
import TabContent from '$lib/components/common/TabContent.svelte'
import Tabs from '$lib/components/common/Tabs.svelte'
import { useRating } from '$lib/utils'

// Tiptap
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

const Rating = ['s', 't', 'm', 'e']

export let description: string = ''
export let content: string = ''
export let title: string = ''
export let published: boolean = false
export let rating = Rating[0]

$: content

let element: HTMLElement
let editor: Editor

$: isEditing = $page.url.pathname.includes('/edit')
$: editor

onMount(() => {
  editor = new Editor({
    element,
    content,
    extensions: [
      StarterKit,
      Underline,
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full px-5 pt-5 pb-32 outline-none min-h-full',
      }
    },
    onTransaction: () => {
      editor = editor
    }
  })
  editor.on('update', () => {
    content = editor.getHTML()
  })
})

onDestroy(() => {
  if (editor)
    editor.destroy()
})

const togglePublish = () => published = !published
const doCancel = () => {
  if (window.confirm('Are you sure you want to cancel?')) {
    if (isEditing)
      goto(`/posts/${$page.params.id}`)
    else
      history.back()
  }
}

type EditorTool = {
  icon: string
  name?: string
  active: () => boolean
  action: () => void
}
type EditorToolGroup = EditorTool[]

let toolbar: EditorToolGroup[]
$: toolbar = [
  [
    {
      icon: 'ri:h-1',
      name: 'Heading 1',
      active: () => editor.isActive('heading', { level: 1 }),
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
    {
      icon: 'ri:h-2',
      name: 'Heading 2',
      active: () => editor.isActive('heading', { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      icon: 'ri:h-3',
      name: 'Heading 3',
      active: () => editor.isActive('heading', { level: 3 }),
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
    {
      icon: 'ri:paragraph',
      name: 'Paragraph',
      active: () => editor.isActive('paragraph'),
      action: () => editor.chain().focus().setParagraph().run()
    },
  ],
  [
    {
      icon: 'ri:bold',
      name: 'Bold',
      active: () => editor.isActive('bold'),
      action: () => editor.chain().focus().toggleBold().run()
    },
    {
      icon: 'material-symbols:format-italic',
      name: 'Italic',
      active: () => editor.isActive('italic'),
      action: () => editor.chain().focus().toggleItalic().run()
    },
    {
      icon: 'ri:strikethrough',
      name: 'Strikethrough',
      active: () => editor.isActive('strike'),
      action: () => editor.chain().focus().toggleStrike().run()
    },
    {
      icon: 'ri:underline',
      name: 'Underline',
      active: () => editor.isActive('underline'),
      action: () => editor.chain().focus().toggleUnderline().run()
    },
  ],
]
</script>

<div class="flex flex-col flex-1">
  <div class="sticky top-0 z-50 flex flex-col bg-gray-900/70 backdrop-blur-md">
    <div class="flex flex-col border-b border-white/10">
      <Tabs>
        <Tab>Title</Tab>
        <Tab>Description</Tab>
        <Tab>Rating</Tab>
        <Tab>Visibility</Tab>
        <svelte:fragment slot="content">
          <TabContent>
            <input bind:value={title} type="text" required name="title" class="w-full px-4 py-3 bg-transparent outline-none focus:bg-white/10" placeholder="Title" />
          </TabContent>
          <TabContent>
            <textarea
              bind:value={description}
              placeholder="Write a Description..."
              class="w-full h-20 px-4 py-3 bg-transparent outline-none resize-none focus:bg-white/10"
            ></textarea>
          </TabContent>
          <TabContent>
            <div class="flex gap-1 p-2">
              {#each Rating as r}
                <button
                  on:click|preventDefault={() => rating = r}
                  class="rounded-md px-3 py-1 ring-orange-300 {rating === r ? 'text-orange-300 ring-1 bg-orange-500/10' : 'ring-0 hover:bg-white/10'}"
                >
                  <span>{r.toUpperCase()} - {useRating(r)}</span>
                </button>
              {/each}
              <input type="hidden" name="rating" bind:value={rating} />
            </div>
          </TabContent>
          <TabContent>
            <div class="flex items-center gap-2 p-2 border-b border-white/10">
              <button
                type="button"
                class="flex items-center gap-1 p-2 rounded-md {published ? 'text-orange-300 bg-orange-500/10' : 'hover:bg-white/10'}"
                on:click={togglePublish}
              >
                <Icon icon="{published ? 'fluent:eye-20-filled' : 'fluent:eye-hide-20-filled'}" class="w-5 h-5" />
                <span>{published ? 'Public' : 'Private'}</span>
              </button>
              <input type="hidden" name="published" bind:value={published} />
            </div>
          </TabContent>
        </svelte:fragment>
      </Tabs>
    </div>

    <div class="flex items-center justify-between gap-2 p-2 border-b border-white/10">
      {#if editor}
        <div class="flex items-center gap-4">
          {#each toolbar as group}
            <div class="flex items-center gap-1">
              {#each group as tool, i (i)}
                <button
                  type="button"
                  class="p-2 rounded-md {tool.active() ? 'text-orange-300 bg-orange-500/10' : 'hover:bg-white/10'}"
                  on:click={tool.action}
                  title={tool.name}
                >
                  <Icon icon={tool.icon} class="w-5 h-5" />
                </button>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
      <div class="flex items-center gap-1 text-sm font-bold">
        <button
          type="button"
          class="px-3 py-2 rounded-md text-rose-300 hover:bg-white/10"
          on:click={doCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="flex items-center gap-2 px-3 py-2 text-orange-300 rounded-md bg-orange-500/10 hover:bg-orange-500/20"
        >
          <Icon icon="fluent:save-24-filled" class="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>

  <div id="editorWrapper" class="flex flex-1 overflow-auto">
    <div class="w-full" bind:this={element} />
  </div>

  <input type="hidden" name="content" bind:value={content} />
</div>
