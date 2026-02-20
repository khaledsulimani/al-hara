const TYPE_LABELS = {
  prayer: 'أوقات الصلاة',
  wedding: 'زفاف',
  graduation: 'تخرج',
  news: 'أخبار',
}

const TYPE_STYLES = {
  prayer: 'bg-blue-100 text-blue-800',
  wedding: 'bg-emerald-100 text-emerald-800',
  graduation: 'bg-amber-100 text-amber-800',
  news: 'bg-slate-100 text-slate-800',
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function CommunityBoard({ id, announcements = [] }) {
  return (
    <section id={id || 'community-board'} className="w-full px-4 py-8 scroll-mt-[130px]" style={{ backgroundColor: 'rgba(15, 81, 50, 0.5)' }} aria-labelledby="board-heading">
      <h2 id="board-heading" className="text-2xl font-bold text-[#f5f0e6] mb-2 text-center">
        حائط الحارة
      </h2>
      <p className="text-[#d4a84b] text-sm text-center mb-6">رمضان كريم</p>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((item) => (
          <article
            key={item.id}
            className="rounded-xl shadow-md border-2 border-[#d4a84b]/50 p-4 text-start"
            style={{ backgroundColor: 'rgba(245, 240, 230, 0.95)' }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  TYPE_STYLES[item.type] || TYPE_STYLES.news
                }`}
              >
                {TYPE_LABELS[item.type] || item.type}
              </span>
              <time className="text-xs text-[#0d3b2a]/80" dateTime={item.date}>
                {formatDate(item.date)}
              </time>
            </div>
            <h3 className="font-semibold text-[#0d3b2a] mb-1">{item.title}</h3>
            <p className="text-sm text-[#0d3b2a]/80">{item.content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
