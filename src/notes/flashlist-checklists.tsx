import type { NoteMeta } from ".";

// DRAFT for Praveen to review. The general FlashList material is accurate
// as of FlashList v2; the yellow TODO boxes need details only Praveen has
// (device, numbers, what the checklist rows contained). Replace them, then
// remove `draft: true` to publish.

export const meta: NoteMeta = {
  slug: "flashlist-checklist-scroll-jank",
  title: "Fixing checklist scroll jank in React Native with FlashList",
  description:
    "How moving long, mixed-content checklists from FlatList to FlashList removed scroll jank in Delightree's franchise operations app, and what to watch for with recycled cells.",
  published: "2026-10-01",
  tags: ["React Native", "Performance", "FlashList"],
  draft: true,
};

function Todo({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-[#ffd60a]/25 px-4 py-3 text-sm">
      <strong>TODO (Praveen):</strong> {children}
    </p>
  );
}

export function Body() {
  return (
    <>
      <p>
        At Delightree, franchise teams work through audits and checklists on their phones: long lists that mix
        section headers, yes/no questions, notes and photo evidence. On mid-range Android phones those lists
        stuttered when scrolled quickly. Moving them from <code>FlatList</code> to Shopify&apos;s{" "}
        <code>FlashList</code> removed the jank. This note covers why it worked and the one class of bug the move
        introduces.
      </p>

      <Todo>Add the device you tested on and the before/after numbers (FPS, dropped frames or blank cells).</Todo>

      <h2>Why FlatList struggles with long, mixed lists</h2>
      <p>
        <code>FlatList</code> virtualises by mounting and unmounting rows as they enter and leave a window around
        the viewport. Every row that scrolls in is a fresh component tree to create, lay out and render on the JS
        thread. When rows are heavy (images, inputs, conditional sections) and the user flings the list, the JS
        thread falls behind and you get dropped frames or blank space where rows should be.
      </p>

      <h2>What FlashList changes</h2>
      <p>
        <code>FlashList</code> recycles cells instead: a row that leaves the screen is reused for the next row
        coming in, re-rendered with new props rather than rebuilt. Far less work happens per scrolled row, which is
        what removes the jank. FlashList v2 is built for React Native&apos;s New Architecture and measures items
        itself, so the <code>estimatedItemSize</code> prop v1 needed is gone.
      </p>

      <h2>The migration</h2>
      <p>For most lists the change is the import:</p>
      <pre>
        <code>{`import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderChecklistItem}
  keyExtractor={(item) => item.id}
  getItemType={(item) => item.kind} // "header" | "question" | "photo"
/>`}</code>
      </pre>
      <p>
        <code>getItemType</code> matters for mixed lists. It keeps separate recycling pools per row type, so a photo
        row is only ever reused as another photo row, not rebuilt from a header.
      </p>

      <h2>The catch: state in recycled rows</h2>
      <p>
        Because a cell is reused, local state inside a row component survives into the next item that cell shows.
        An expanded note or a half-typed answer can appear on the wrong question. Keep row state in the list&apos;s
        data or a store keyed by item id, or use FlashList v2&apos;s <code>useRecyclingState</code>, which resets
        when the item changes. Avoid a <code>key</code> prop inside rows that changes per item: it forces a remount
        and throws away the benefit of recycling.
      </p>

      <Todo>Describe the recycling bug you hit (if any) and how you fixed it.</Todo>

      <h2>Measure in release builds</h2>
      <p>
        Debug builds run slower JS and exaggerate jank, so compare release builds on a low-end Android phone,
        where problems show first. Watch the UI and JS frame rates while flinging the list, and profile renders to
        confirm rows re-render rather than remount.
      </p>

      <Todo>Add how you measured (Perf Monitor, Flashlight, React Native DevTools) and the final result.</Todo>
    </>
  );
}
