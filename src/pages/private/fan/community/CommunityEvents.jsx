/* ─────────────────────────────────────────────────────────────────
   CommunityEvents.jsx, Grid de eventos futuros da comunidade.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'

const TYPE_LABELS = {
    listening: 'Listening',
    battle:    'Beat Battle',
    workshop:  'Workshop',
    qa:        'Q&A',
    openmic:   'Open Mic',
    collab:    'Collab',
};

export default function CommunityEvents({ events }) {
    const [joined, setJoined] = useState(new Set());

    const toggle = id => setJoined(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Próximos eventos</h2>
                    <div className="home__section-sub">Listening parties, workshops e sessões ao vivo</div>
                </div>
                <a href="#" className="home__section-link">Ver calendário →</a>
            </div>

            <div className="com__events">
                {events.map(ev => {
                    const isJoined = joined.has(ev.id);
                    return (
                        <div key={ev.id} className="com__event">
                            <div className="com__event-head">
                                <span className={`com__event-type com__event-type--${ev.type}`}>
                                    {TYPE_LABELS[ev.type]}
                                </span>
                                {ev.isRecurring && (
                                    <span className="com__event-recurring">↻ Semanal</span>
                                )}
                            </div>

                            <h3 className="com__event-title">{ev.title}</h3>
                            <p className="com__event-desc">{ev.desc}</p>

                            <div className="com__event-foot">
                                <div>
                                    <div className="com__event-meta">
                                        <strong>{ev.date}</strong> · {ev.time}
                                    </div>
                                    <div className="com__event-meta">{ev.platform}</div>
                                    <div className="com__event-confirmed">
                                        {ev.confirmed} confirmados
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={`com__event-btn${isJoined ? ' com__event-btn--joined' : ''}`}
                                    onClick={() => toggle(ev.id)}
                                >
                                    {isJoined ? '✓ Inscrito' : 'Inscrever'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
