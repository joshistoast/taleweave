<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

export let content = ''
let element: HTMLElement
let editor: Editor

onMount(() => {
  editor = new Editor({
    element,
    content,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none w-full p-5 outline-none h-full'
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
</script>

{#if editor}
  <div class="flex items-center gap-1">
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
      class:active={editor.isActive('heading', { level: 1 })}
    >
      H1
    </button>
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive('heading', { level: 2 })}
    >
      H2
    </button>
    <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
      P
    </button>
  </div>
{/if}

<div class="content" bind:this={element} />

<style lang="postcss">
  button {
    @apply w-6 h-6 flex items-center justify-center rounded-sm;
  }
  button.active {
    @apply bg-emerald-500/10 text-emerald-500;
  }
  .content {
    @apply h-full;
  }
</style>
