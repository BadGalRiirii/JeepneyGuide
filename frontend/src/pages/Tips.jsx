import { Bus, MapPin, Coins, Clock, AlertTriangle, ThumbsUp, Navigation } from 'lucide-react'

const TIPS = [
  {
    icon: Bus,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Read the sign on the jeepney',
    body: 'Every jeepney displays its route code and destination on a signboard in the front window. Look for the code (e.g. "BULUA B1", "CAMP EVANGELISTA C1") and the terminal name.',
  },
  {
    icon: MapPin,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Know your terminal',
    body: 'Most routes end at Cogon Public Market (downtown) or Carmen Public Market. If you\'re heading to SM City or Limketkai Mall, look for Limketkai Drive routes.',
  },
  {
    icon: Coins,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Fare is distance-based',
    body: 'Minimum fare starts at ₱13 for the first 4 km, with ₱1.80 per km after that. Exact fare is appreciated — pass your money to the driver or ask a co-passenger to relay it.',
  },
  {
    icon: Clock,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: 'Hail the jeepney on the right side',
    body: 'Stand on the right side of the road in the direction you\'re heading. Wave your hand to signal the driver. Jeepneys typically run from early morning until around 10–11PM.',
  },
  {
    icon: Navigation,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    title: 'Tell the driver your stop',
    body: 'When you approach your destination, shout "Para!" (stop). In CDO it\'s common to say "Para diha!" meaning stop there. Don\'t be shy — it\'s the normal way to get off.',
  },
  {
    icon: ThumbsUp,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'CDO jeepney etiquette',
    body: 'Seats fill from the back — move in so others can board. Avoid eating or drinking inside. Greet with a nod; locals are generally helpful if you ask for directions.',
  },
  {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'Watch out for variant routes',
    body: 'Routes like "Bulua B1, B2, B3" or "Bayabas RA, RB" cover different paths even if they share the same origin area. Always check the full signboard — B3 goes to Limketkai, not Cogon!',
  },
]

const FAQS = [
  {
    q: 'What\'s the difference between RA, RB, R1, R2 routes?',
    a: 'These are variant codes for routes serving the same origin area but taking different paths to the terminal. RA/RB often means Route A and Route B. Always check both the origin and the final destination on the jeepney sign.',
  },
  {
    q: 'How do I get from one side of CDO to the other?',
    a: 'Most routes pass through or terminate at Cogon or Carmen. Transfer at one of these terminals to catch a connecting jeepney. It usually costs two fares.',
  },
  {
    q: 'Is there a jeepney to the airport (Lumbia)?',
    a: 'Yes — look for "Lumbia R1" (→ Carmen) or "Lumbia R2" (→ Cogon) routes. The airport is in the Lumbia area, so these routes pass by it.',
  },
  {
    q: 'How do I get to SM City or Limketkai Mall?',
    a: 'Look for "Bulua B3", "SM RA", or "SM RB" routes — these terminate at Limketkai Drive near the malls. Alternatively, take any Cogon-bound jeep and transfer to a Limketkai route there.',
  },
  {
    q: 'What time do jeepneys stop running?',
    a: 'Most routes operate from around 5:00 AM to 10:00–11:00 PM. Service may be reduced on Sundays and public holidays.',
  },
]

export default function Tips() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-1">Commuter's Guide</h1>
        <p className="text-white/40 text-sm">Everything you need to ride CDO jeepneys with confidence.</p>
      </div>

      {/* Tips grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
        {TIPS.map(({ icon: Icon, color, bg, title, body }) => (
          <div key={title} className="glass-card p-5 hover:border-white/15 transition-all">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-black text-white mb-6">FAQs</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="glass-card group">
              <summary className="px-5 py-4 cursor-pointer flex items-center justify-between font-semibold text-white text-sm list-none select-none hover:text-amber-300 transition-colors">
                {q}
                <span className="text-white/30 group-open:text-amber-400 text-lg leading-none ml-4 flex-shrink-0 transition-all">+</span>
              </summary>
              <div className="px-5 pb-4 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
