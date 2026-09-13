import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { services, process } from '../data/services';
import { workByCategory } from '../data/projects';
import { Seo } from '../components/Seo';
import { Reveal, Masked } from '../components/Reveal';
import { EASE, DUR } from '../lib/anim';

export default function ServicesPage() {
  const [open, setOpen] = useState<string>(services[0]?.id ?? '');

  return (
    <>
      <Seo page="Services" />

      <header className="mast wrap">
        <p className="label kicker">( 03 ) — Services</p>
        <h1>
          <Masked>What I can</Masked>
          <br />
          <Masked>
            <span className="it">make for you.</span>
          </Masked>
        </h1>
        <Reveal delay={0.12}>
          <p className="sub">
            Video editing is the core of the practice, graphic design sits beside it, and motion
            graphics is on the table as a service today. Nothing here overpromises.
          </p>
        </Reveal>
      </header>

      <section className="wrap" style={{ paddingBottom: 'clamp(48px,7vh,80px)' }}>
        <Reveal>
          <div className="svc-block">
            {services.map((s) => {
              const isOpen = open === s.id;
              const related = s.related ? workByCategory(s.related).slice(0, 3) : [];
              return (
                <div className={`svc-row ${isOpen ? 'is-open' : ''}`} key={s.id}>
                  <button
                    className="svc-top"
                    onClick={() => setOpen(isOpen ? '' : s.id)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-panel-${s.id}`}
                  >
                    <span className="sv-idx" aria-hidden="true">
                      {s.index}
                    </span>
                    <span className="sv-name">
                      <span className="svc-name">{s.title}</span>
                      <span className="tag-chip">{s.tag}</span>
                    </span>
                    <span className="sv-toggle" aria-hidden="true">
                      {isOpen ? 'Close' : 'Open'}
                      <span className="pm">+</span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`svc-panel-${s.id}`}
                        className="svc-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: DUR.mid, ease: EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p className="st">{s.statement}</p>

                        <div className="inc">
                          <span className="lbl">What that includes</span>
                          <ul>
                            {s.includes.map((inc) => (
                              <li key={inc}>{inc}</li>
                            ))}
                          </ul>
                        </div>

                        {related.length > 0 && (
                          <div className="rel">
                            <span className="lbl">Related work</span>
                            {related.map((p) => (
                              <Link key={p.id} to={`/work/${p.id}`}>
                                <span>{p.title}</span>
                                <span className="arr" aria-hidden="true">
                                  ↗
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {s.honest && <p className="honest">{s.honest}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <section className="section section--tight" style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <p className="label idx">
              <span className="n">( P )</span> — Process
            </p>
            <p className="note">A straight line from brief to delivery.</p>
          </div>

          <Reveal>
            <div className="proc-list">
              {process.map((step) => (
                <div className="proc-row" key={step.index}>
                  <span className="p-idx">{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
