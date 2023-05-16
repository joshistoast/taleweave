<script lang="ts">
import Icon from '@iconify/svelte'
import TagsInput from '$lib/components/TagsInput.svelte'
import { onMount, onDestroy } from 'svelte'
import { useRating } from '$lib/utils'
import type { Tag } from '@prisma/client'
// Tiptap
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

const Rating = ['s', 't', 'm', 'x']

export let id: string | undefined
export let description: string = ''
export let content: string = ''
export let title: string = ''
export let published: boolean = false
export let rating = Rating[0]
export let tags: Tag[] = []

const placeholders = {
  title: 'Write a unique title...',
  description: 'Write an enticing description...',
  content: 'Write an amazing story...',
  tags: 'Add tags...',
}

$: content
$: isEditing = !!id

let element: HTMLElement
let editor: Editor

$: editor

onMount(() => {
  editor = new Editor({
    element,
    content,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholders.content,
        emptyEditorClass: `text-white/50`
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full px-5 pt-5 pb-32 outline-none break-words',
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

<div class="grid gap-4 p-4">
  <label class="grid gap-1 p-2 border rounded-md border-white/10">
    <span class="pl-2 text-sm font-bold text-white/50">Title</span>
    <input
      bind:value={title}
      type="text"
      required
      name="title"
      class="w-full px-3 py-2 bg-transparent rounded-md outline-none ring-1 hover:bg-white/10 ring-transparent focus:ring-orange-300"
      placeholder={placeholders.title}
    />
  </label>

  <label class="grid gap-1 p-2 border rounded-md border-white/10">
    <span class="pl-2 text-sm font-bold text-white/50">Description</span>
    <textarea
      name="description"
      bind:value={description}
      placeholder={placeholders.description}
      class="w-full h-20 px-3 py-2 bg-transparent rounded-md outline-none resize-none ring-1 hover:bg-white/10 ring-transparent focus:ring-orange-300"
    ></textarea>
  </label>

  <div class="p-2 border rounded-md border-white/10">
    <span class="pl-2 text-sm font-bold text-white/50">Tags</span>
    <TagsInput
      bind:selectedTags={tags}
      placeholder={placeholders.tags}
      allowCustomTags
      isDropdown
      maxTags={5}
    />
    <input name="tags" type="hidden" value={tags.map(t => t.name).join(',')} />
  </div>

  <div class="flex flex-col gap-4 p-2 border rounded-md lg:items-center lg:pr-4 lg:justify-between lg:flex-row border-white/10">
    <div class="flex flex-col gap-4 lg:flex-row">
      <label class="grid gap-1">
        <span class="pl-2 text-sm font-bold text-white/50">Age Rating</span>
        <select name="rating" bind:value={rating} class="px-3 py-2 bg-transparent rounded-md outline-none ring-1 hover:bg-white/10 ring-transparent focus:ring-orange-300">
          {#each Rating as r}
            <option value={r}>{r.toUpperCase()} - {useRating(r)}</option>
          {/each}
        </select>
      </label>
      <label class="grid gap-1">
        <span class="pl-2 text-sm font-bold text-white/50">Visibility</span>
        <select name="published" bind:value={published} class="px-3 py-2 bg-transparent rounded-md outline-none ring-1 hover:bg-white/10 ring-transparent focus:ring-orange-300">
          {#each Array.from([true, false]) as p}
            <option value={p}>{p ? 'Public' : 'Private'}</option>
          {/each}
        </select>
      </label>
    </div>
    <button
      type="submit"
      class="flex items-center gap-2 px-3 py-2 text-orange-300 rounded-md bg-orange-500/10 hover:bg-orange-500/20"
    >
      <Icon icon="fluent:save-24-filled" class="w-4 h-4" />
      <span>Save</span>
    </button>
  </div>
</div>

<div class="sticky top-0 z-50 flex items-center px-4 py-2 border-y border-white/10 backdrop-blur-md bg-[#121212]/50">
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
</div>

<div id="editorWrapper">
  <div class="w-full" bind:this={element} />
</div>

<input type="hidden" name="content" bind:value={content} />

<style lang="postcss">
  :global(.ProseMirror p.is-empty:first-child::before) {
    @apply content-[attr(data-placeholder)] pointer-events-none float-left h-0;
  }
</style>
