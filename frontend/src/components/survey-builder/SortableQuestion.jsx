import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


function SortableQuestion({
  question,
  children,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: question.id,
  })

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm transition hover:text-slate-900 active:cursor-grabbing"
        >
          ↕ Drag
        </button>
      </div>

      {children}
    </div>
  )
}

export default SortableQuestion