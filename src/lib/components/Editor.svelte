<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import Icon from '@iconify/svelte'

// Tiptap
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

export let description: string = ''
export let content: string = ''
export let title: string = ''
export let published: boolean = false

$: content
$: description
$: title
$: published

let descriptionExpanded = false
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
    <div class="grid border-b border-white/10">
      <input bind:value={title} type="text" required name="title" class="px-4 py-3 bg-transparent border-b outline-none border-white/10" placeholder="Title" />

      <div class="flex flex-col">
        <button
          type="button"
          class="flex items-center w-full gap-4 px-3 py-2 text-xs font-bold uppercase hover:bg-white/10 text-gray-4"
          on:click={() => (descriptionExpanded = !descriptionExpanded)}
        >
          <span>Description</span>
          <span class="i-fluent-chevron-down-24-filled {descriptionExpanded ? 'transform rotate-180' : ''}" />
        </button>

        {#if descriptionExpanded}
          <textarea
            bind:value={description}
            name="description"
            class="w-full px-3 py-2 text-sm bg-transparent outline-none hover:bg-white/10 focus:bg-white/10"
            placeholder="Description"
          ></textarea>
        {/if}
      </div>
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
          type="button"
          class="px-3 py-2 rounded-md flex items-center gap-2 {published ? 'text-emerald-300' : 'text-blue-300'} hover:bg-white/10"
          on:click={togglePublish}
        >
          <Icon icon="{published ? 'fluent:eye-24-filled' : 'fluent:eye-off-24-filled'}" class="w-4 h-4" />
          <span>Visibility: {published ? 'Public' : 'Private'}</span>
          <input type="hidden" name="published" bind:value={published} />
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
