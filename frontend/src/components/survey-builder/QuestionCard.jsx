function QuestionCard({
  question,
  index,
  questions,
  canRemove,
  removeQuestion,
  updateQuestion,
  updateOption,
  addOption,
  removeOption,
}) {
  const previousQuestions =
    questions.slice(0, index)

  const conditionSources =
    previousQuestions.filter(
      (item) =>
        item.type === "single_choice"
    )

  const selectedSourceQuestion =
    conditionSources.find(
      (item) =>
        item.id ===
        question.condition?.question_id
    )

  const enableCondition = () => {
    if (conditionSources.length === 0) {
      return
    }

    const source =
      conditionSources[
        conditionSources.length - 1
      ]

    updateQuestion(
      question.id,
      "condition",
      {
        question_id: source.id,
        operator: "equals",
        value: "",
      }
    )
  }

  const disableCondition = () => {
    updateQuestion(
      question.id,
      "condition",
      null
    )
  }

  const getTypeLabel = () => {
    if (question.type === "single_choice") {
      return "Multiple Choice"
    }

    if (question.type === "checkbox") {
      return "Checkbox"
    }

    if (question.type === "rating") {
      return "Rating"
    }

    return "Text Input"
  }

  return (
    <div className="border border-slate-200 bg-white px-6 py-5">

      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <QuestionTypeIcon
              type={question.type}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Question {index + 1}
            </h3>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              {getTypeLabel()}
            </p>
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() =>
              removeQuestion(question.id)
            }
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon />
            Remove
          </button>
        )}
      </div>


      {/* Question Label */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Question
        </label>

        <input
          value={question.label}
          onChange={(event) =>
            updateQuestion(
              question.id,
              "label",
              event.target.value
            )
          }
          required
          placeholder="Enter your question"
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>


      {/* Type + Required */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Question type
          </label>

          <select
            value={question.type}
            onChange={(event) =>
              updateQuestion(
                question.id,
                "type",
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="text">
              Text Input
            </option>

            <option value="single_choice">
              Multiple Choice
            </option>

            <option value="checkbox">
              Checkbox
            </option>

            <option value="rating">
              Rating 1–5
            </option>
          </select>
        </div>


        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Requirement
          </label>

          <label className="flex min-h-10.5 cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 transition hover:border-slate-300">

            <div className="flex items-center gap-2.5">
              <RequiredIcon />

              <span className="text-sm text-slate-700">
                Required question
              </span>
            </div>

            <input
              type="checkbox"
              checked={question.required}
              onChange={(event) =>
                updateQuestion(
                  question.id,
                  "required",
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-blue-600"
            />
          </label>
        </div>

      </div>


      {/* Options */}
      {question.options && (
        <div className="mt-5 border border-slate-200 bg-slate-50/60 p-4">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-700">
                Answer options
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Add the choices respondents can select.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                addOption(question.id)
              }
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <PlusIcon />
              Add option
            </button>
          </div>


          <div className="space-y-2">

            {question.options.map(
              (option, optionIndex) => (

                <div
                  key={optionIndex}
                  className="flex items-center gap-2"
                >

                  <span className="w-6 shrink-0 text-center text-xs font-medium text-slate-400">
                    {optionIndex + 1}
                  </span>

                  <input
                    value={option}
                    onChange={(event) =>
                      updateOption(
                        question.id,
                        optionIndex,
                        event.target.value
                      )
                    }
                    required
                    placeholder={`Option ${
                      optionIndex + 1
                    }`}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeOption(
                          question.id,
                          optionIndex
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove option"
                    >
                      <CloseIcon />
                    </button>
                  )}

                </div>

              )
            )}

          </div>

        </div>
      )}


      {/* Conditional Logic */}
      {index > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-5">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BranchIcon />
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-800">
                  Conditional logic
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Show this question only when a previous multiple-choice answer matches.
                </p>
              </div>

            </div>


            {conditionSources.length > 0 ? (

              <label className="flex cursor-pointer items-center gap-2">

                <span className="text-sm text-slate-500">
                  Enable
                </span>

                <input
                  type="checkbox"
                  checked={
                    question.condition !== null
                  }
                  onChange={(event) => {
                    if (
                      event.target.checked
                    ) {
                      enableCondition()
                    } else {
                      disableCondition()
                    }
                  }}
                  className="h-4 w-4 accent-blue-600"
                />

              </label>

            ) : (

              <span className="text-xs text-slate-400">
                No multiple-choice question above
              </span>

            )}

          </div>


          {question.condition &&
            conditionSources.length > 0 && (

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  When this question
                </label>

                <select
                  value={
                    question.condition
                      .question_id
                  }
                  onChange={(event) =>
                    updateQuestion(
                      question.id,
                      "condition",
                      {
                        ...question.condition,
                        question_id:
                          event.target.value,
                        value: "",
                      }
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  {conditionSources.map(
                    (source) => {

                      const sourceIndex =
                        questions.findIndex(
                          (item) =>
                            item.id === source.id
                        )

                      return (
                        <option
                          key={source.id}
                          value={source.id}
                        >
                          Q{sourceIndex + 1}:{" "}
                          {source.label ||
                            "Untitled question"}
                        </option>
                      )
                    }
                  )}
                </select>
              </div>


              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Has answer
                </label>

                <select
                  value={
                    question.condition.value
                  }
                  onChange={(event) =>
                    updateQuestion(
                      question.id,
                      "condition",
                      {
                        ...question.condition,
                        value:
                          event.target.value,
                      }
                    )
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select answer
                  </option>

                  {selectedSourceQuestion
                    ?.options?.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                </select>
              </div>

            </div>

          )}

        </div>
      )}

    </div>
  )
}


/* ---------------- SVG Icons ---------------- */

function QuestionTypeIcon({ type }) {
  if (type === "rating") {
    return <StarIcon />
  }

  if (type === "checkbox") {
    return <CheckboxIcon />
  }

  if (type === "single_choice") {
    return <ChoiceIcon />
  }

  return <TextIcon />
}


function TextIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h7" />
    </svg>
  )
}


function ChoiceIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" />
      <path d="M11 7h8" />
      <path d="M11 17h8" />
    </svg>
  )
}


function CheckboxIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />
      <path d="m8 12 3 3 5-6" />
    </svg>
  )
}


function StarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
    </svg>
  )
}


function RequiredIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-400"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}


function BranchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="18" cy="17" r="2" />

      <path d="M8 5h3a4 4 0 0 1 4 4v6" />
      <path d="M15 9h1" />
    </svg>
  )
}


function PlusIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}


function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}


function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}


export default QuestionCard