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


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {index + 1}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Question {index + 1}
            </h3>

            <p className="text-xs capitalize text-slate-400">
              {question.type.replace(
                "_",
                " "
              )}
            </p>
          </div>
        </div>


        {canRemove && (
          <button
            type="button"
            onClick={() =>
              removeQuestion(question.id)
            }
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>


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
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>


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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
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

          <label className="flex h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4">
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
              className="h-4 w-4"
            />

            <span className="text-sm text-slate-700">
              Required question
            </span>
          </label>
        </div>
      </div>


      {question.options && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Answer options
            </label>

            <button
              type="button"
              onClick={() =>
                addOption(question.id)
              }
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              + Add option
            </button>
          </div>


          <div className="space-y-2">
            {question.options.map(
              (option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400">
                    {optionIndex + 1}
                  </div>

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
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />

                  {question.options.length >
                    2 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeOption(
                          question.id,
                          optionIndex
                        )
                      }
                      className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}


      {index > 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-800">
                Conditional logic
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Show this question only when a
                previous multiple-choice answer
                matches.
              </p>
            </div>


            {conditionSources.length > 0 ? (
              <label className="flex cursor-pointer items-center gap-2">
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
                  className="h-4 w-4"
                />

                <span className="text-sm text-slate-600">
                  Enable
                </span>
              </label>
            ) : (
              <span className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-500">
                No choice question above
              </span>
            )}
          </div>


          {question.condition &&
            conditionSources.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Question
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
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
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
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Value
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
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">
                    Select value
                  </option>

                  {selectedSourceQuestion?.options?.map(
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

export default QuestionCard