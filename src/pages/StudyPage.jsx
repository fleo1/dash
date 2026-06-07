import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeck } from '../hooks/useData'
import {
  PageLayout, TopNav, Button, Card, Badge, ProgressBar, Spinner
} from '../components/UI'

/* ── Flashcard component ── */
function Flashcard({ card, onNext, onPrev, current, total }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => { setFlipped(false) }, [card])

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={current} max={total} />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 8, fontSize: 13, color: 'var(--text-3)'
        }}>
          <span>{current} / {total}</span>
          <span>clique para virar</span>
        </div>
      </div>

      {/* Card flip */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          perspective: 1200, cursor: 'pointer',
          marginBottom: 24, height: 240
        }}
      >
        <div style={{
          width: '100%', height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s cubic-bezier(.4,0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>frente</span>
            <p style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 600, textAlign: 'center', color: 'var(--text)', lineHeight: 1.4 }}>
              {card.front}
            </p>
          </div>
          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--bg-3)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}>
            <span style={{ fontSize: 11, color: 'var(--accent-2)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>verso</span>
            <p style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 600, textAlign: 'center', color: 'var(--text)', lineHeight: 1.4 }}>
              {card.back}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button variant="ghost" onClick={onPrev} disabled={current <= 1}>← Anterior</Button>
        <Button onClick={onNext} disabled={current >= total}>Próximo →</Button>
      </div>
    </div>
  )
}

/* ── Quiz component ── */
function Quiz({ cards, onFinish }) {
  const shuffled = [...cards].sort(() => Math.random() - 0.5)
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = shuffled[idx]

  const options = (() => {
    const others = shuffled.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3)
    return [current, ...others].sort(() => Math.random() - 0.5)
  })()

  const handleAnswer = (opt) => {
    if (chosen !== null) return
    setChosen(opt)
    const correct = opt.id === current.id
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      if (idx + 1 >= shuffled.length) setDone(true)
      else { setIdx(i => i + 1); setChosen(null) }
    }, 1200)
  }

  if (done) {
    const pct = Math.round((score / shuffled.length) * 100)
    const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 72, fontFamily: 'var(--font-display)', fontWeight: 700, color, marginBottom: 8 }}>
          {pct}%
        </div>
        <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 32 }}>
          {score} de {shuffled.length} corretas
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="ghost" onClick={onFinish}>Voltar</Button>
          <Button onClick={() => { setIdx(0); setChosen(null); setScore(0); setDone(false) }}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <ProgressBar value={idx} max={shuffled.length} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13, color: 'var(--text-3)' }}>
          <span>{idx + 1} / {shuffled.length}</span>
          <span>acertos: {score}</span>
        </div>
      </div>

      <Card style={{ padding: '28px 24px', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>
          {current.front}
        </p>
      </Card>

      <div style={{ display: 'grid', gap: 10 }}>
        {options.map((opt) => {
          const isCorrect = opt.id === current.id
          const isChosen = chosen?.id === opt.id
          let bg = 'var(--bg-2)', border = 'var(--border)', color = 'var(--text)'
          if (chosen) {
            if (isCorrect) { bg = 'var(--green-bg)'; border = 'rgba(74,222,128,0.35)'; color = 'var(--green)' }
            else if (isChosen) { bg = 'var(--red-bg)'; border = 'rgba(248,113,113,0.35)'; color = 'var(--red)' }
          }
          return (
            <button key={opt.id} onClick={() => handleAnswer(opt)} style={{
              padding: '14px 18px', borderRadius: 'var(--radius-sm)',
              background: bg, border: `1px solid ${border}`,
              color, fontSize: 14, fontFamily: 'var(--font-body)',
              textAlign: 'left', cursor: chosen ? 'default' : 'pointer',
              transition: 'all 0.2s', fontWeight: isChosen || (chosen && isCorrect) ? 500 : 400
            }}
              onMouseEnter={e => { if (!chosen) e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { if (!chosen) e.currentTarget.style.borderColor = 'var(--border)' }}>
              {opt.back}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Study Page ── */
export default function StudyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deck, cards, loading } = useDeck(id)
  const [mode, setMode] = useState('flash')
  const [flashIdx, setFlashIdx] = useState(0)

  if (loading) return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spinner size={32} />
      </div>
    </PageLayout>
  )

  if (!deck || cards.length === 0) return (
    <PageLayout>
      <TopNav title="Estudar" back="/" />
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-2)' }}>
        Este baralho está vazio.
        <br /><br />
        <Button onClick={() => navigate(`/deck/${id}/edit`)}>Adicionar cartões</Button>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      <TopNav
        title={deck.name}
        back="/"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant={mode === 'flash' ? 'primary' : 'ghost'} size="sm" onClick={() => setMode('flash')}>
              Flashcards
            </Button>
            <Button variant={mode === 'quiz' ? 'primary' : 'ghost'} size="sm" onClick={() => setMode('quiz')}>
              Quiz
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/deck/${id}/edit`)}>
              Editar
            </Button>
          </div>
        }
      />

      <div className="slide-up">
        {mode === 'flash' && (
          <Flashcard
            card={cards[flashIdx]}
            current={flashIdx + 1}
            total={cards.length}
            onNext={() => setFlashIdx(i => Math.min(i + 1, cards.length - 1))}
            onPrev={() => setFlashIdx(i => Math.max(i - 1, 0))}
          />
        )}
        {mode === 'quiz' && (
          <Quiz
            key={mode}
            cards={cards}
            onFinish={() => setMode('flash')}
          />
        )}
      </div>
    </PageLayout>
  )
}
