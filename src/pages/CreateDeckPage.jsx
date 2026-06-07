import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from '../hooks/useData'
import { useDeck } from '../hooks/useData'
import { supabase } from '../lib/supabase'
import {
  PageLayout, TopNav, Button, Input, Card, Toast, useToast, Spinner
} from '../components/UI'

function CardRow({ card, index, onChange, onRemove, total }) {
  return (
    <Card style={{ padding: '16px 18px', marginBottom: 10 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
          CARTÃO {index + 1}
        </span>
        {total > 1 && (
          <button onClick={() => onRemove(index)} style={{
            background: 'none', border: 'none', color: 'var(--text-3)',
            cursor: 'pointer', fontSize: 16, padding: 2,
            transition: 'color 0.15s'
          }}
            onMouseEnter={e => e.target.style.color = 'var(--red)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>
            ×
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Frente"
          value={card.front}
          placeholder="Pergunta ou termo..."
          onChange={e => onChange(index, 'front', e.target.value)}
        />
        <Input
          label="Verso"
          value={card.back}
          placeholder="Resposta ou definição..."
          onChange={e => onChange(index, 'back', e.target.value)}
        />
      </div>
    </Card>
  )
}

export default function CreateDeckPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState([
    { front: '', back: '' },
    { front: '', back: '' },
    { front: '', back: '' },
  ])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const { createDeck } = useDecks()
  const { toast, show } = useToast()
  const navigate = useNavigate()

  const addCard = () => setCards(prev => [...prev, { front: '', back: '' }])

  const removeCard = (i) => setCards(prev => prev.filter((_, idx) => idx !== i))

  const updateCard = (i, field, value) => {
    setCards(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))
  }

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Nome obrigatório'
    const validCards = cards.filter(c => c.front.trim() && c.back.trim())
    if (validCards.length === 0) e.cards = 'Adicione ao menos um cartão completo'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const deck = await createDeck(name.trim(), description.trim())
      const validCards = cards.filter(c => c.front.trim() && c.back.trim())
      const toInsert = validCards.map((c, i) => ({
        deck_id: deck.id, front: c.front.trim(), back: c.back.trim(), position: i
      }))
      const { error } = await supabase.from('cards').insert(toInsert)
      if (error) throw error
      navigate('/')
    } catch (err) {
      show(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const validCount = cards.filter(c => c.front.trim() && c.back.trim()).length

  return (
    <PageLayout>
      <TopNav
        title="Novo baralho"
        back="/"
        actions={
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size={14} /> : null}
            {saving ? 'Salvando…' : `Salvar baralho (${validCount})`}
          </Button>
        }
      />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Card style={{ padding: '22px 24px', marginBottom: 28 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <Input
              label="Nome do baralho *"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
              placeholder="Ex: Capitais da Europa"
              error={errors.name}
            />
            <Input
              label="Descrição (opcional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Sobre o que é este baralho?"
              multiline
              rows={2}
            />
          </div>
        </Card>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            Cartões
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 400, color: 'var(--text-3)' }}>
              {validCount} completos
            </span>
          </h2>
          {errors.cards && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.cards}</span>}
        </div>

        {cards.map((card, i) => (
          <CardRow
            key={i} card={card} index={i}
            onChange={updateCard} onRemove={removeCard}
            total={cards.length}
          />
        ))}

        <button onClick={addCard} style={{
          width: '100%', padding: '14px',
          background: 'transparent',
          border: '1px dashed var(--border-hover)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-3)', fontSize: 14,
          cursor: 'pointer', transition: 'all 0.15s',
          marginTop: 4, marginBottom: 32
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent-2)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border-hover)'; e.target.style.color = 'var(--text-3)' }}>
          + Adicionar cartão
        </button>
      </div>

      <Toast toast={toast} />
    </PageLayout>
  )
}
