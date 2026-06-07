import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeck } from '../hooks/useData'
import {
  PageLayout, TopNav, Button, Input, Card, Toast, useToast, Spinner
} from '../components/UI'

export default function EditDeckPage() {
  const { id } = useParams()
  const { deck, cards, loading, updateDeck, saveCards } = useDeck(id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [localCards, setLocalCards] = useState([])
  const [saving, setSaving] = useState(false)
  const { toast, show } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (deck) { setName(deck.name); setDescription(deck.description || '') }
  }, [deck])

  useEffect(() => {
    if (cards.length > 0) setLocalCards(cards.map(c => ({ front: c.front, back: c.back })))
    else if (!loading) setLocalCards([{ front: '', back: '' }])
  }, [cards, loading])

  const addCard = () => setLocalCards(p => [...p, { front: '', back: '' }])
  const removeCard = (i) => setLocalCards(p => p.filter((_, idx) => idx !== i))
  const updateCard = (i, field, value) =>
    setLocalCards(p => p.map((c, idx) => idx === i ? { ...c, [field]: value } : c))

  const handleSave = async () => {
    if (!name.trim()) { show('Nome obrigatório', 'error'); return }
    setSaving(true)
    try {
      await updateDeck({ name: name.trim(), description: description.trim() })
      const valid = localCards.filter(c => c.front.trim() && c.back.trim())
      await saveCards(valid)
      show('Baralho salvo!')
    } catch (err) {
      show(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spinner size={32} />
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      <TopNav
        title={`Editar: ${deck?.name || '…'}`}
        back="/"
        actions={
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size={14} /> : null}
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        }
      />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Card style={{ padding: '22px 24px', marginBottom: 28 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <Input label="Nome" value={name} onChange={e => setName(e.target.value)} placeholder="Nome do baralho" />
            <Input label="Descrição" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição opcional" multiline rows={2} />
          </div>
        </Card>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
          Cartões
        </h2>

        {localCards.map((card, i) => (
          <Card key={i} style={{ padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>CARTÃO {i + 1}</span>
              {localCards.length > 1 && (
                <button onClick={() => removeCard(i)} style={{
                  background: 'none', border: 'none', color: 'var(--text-3)',
                  cursor: 'pointer', fontSize: 16
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--red)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>×</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Frente" value={card.front} placeholder="Frente..." onChange={e => updateCard(i, 'front', e.target.value)} />
              <Input label="Verso" value={card.back} placeholder="Verso..." onChange={e => updateCard(i, 'back', e.target.value)} />
            </div>
          </Card>
        ))}

        <button onClick={addCard} style={{
          width: '100%', padding: 14, background: 'transparent',
          border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius)',
          color: 'var(--text-3)', fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
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
