function SurveyDetails({
  title,
  description,
  setTitle,
  setDescription,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Survey details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a clear title and short description.
        </p>
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>


        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows="3"
            placeholder="Tell users what this survey is about."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </section>
  )
}

export default SurveyDetails