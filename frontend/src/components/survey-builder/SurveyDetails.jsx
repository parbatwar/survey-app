function SurveyDetails({
  title,
  description,
  setTitle,
  setDescription,
}) {
  return (
    <section className="border border-slate-200 bg-white px-6 py-5">

      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <DetailsIcon />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Survey details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a clear title and short description for respondents.
          </p>
        </div>
      </div>


      <div className="space-y-4">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
            placeholder="Customer satisfaction survey"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>


        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>

            <span className="text-xs text-slate-400">
              Optional
            </span>
          </div>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows="3"
            placeholder="Tell users what this survey is about."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

      </div>
    </section>
  )
}


function DetailsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h14" />
      <path d="M5 9h14" />
      <path d="M5 14h9" />
      <path d="M5 19h6" />
    </svg>
  )
}


export default SurveyDetails
