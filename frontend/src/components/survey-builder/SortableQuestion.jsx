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
    isDragging,
  } = useSortable({
    id: question.id,
  })

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${
        isDragging
          ? "z-20 opacity-90"
          : ""
      }`}
    >
      <div className="mb-2 flex justify-end">

        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag question"
          title="Drag to reorder"
          className="inline-flex cursor-grab items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:cursor-grabbing"
        >
          <DragIcon />

          Reorder
        </button>

      </div>

      {children}
    </div>
  )
}


function DragIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="6" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
    </svg>
  )
}


export default SortableQuestion
