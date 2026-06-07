import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from '../hooks/useData'
import {
  PageLayout, TopNav, Card, Button, Badge,
  EmptyState, Spinner, Toast, useToast
} from '../components/UI'

export default function DecksPage() {
  const { decks, loading, error, deleteDeck } = useDecks()
  const navigate = useNavigate()
  const { toast, show } = useToast()

  const handleDelete = async (e, id, name) => {
    e.stopPropagation()
    if (!confirm(`Excluir o baralho "${name}"? Isso removerá todos os cartões.`)) return
    try {
      await deleteDeck(id)
      show('Baralho excluído')
    } catch (err) {
      show(err.message, 'error')
    }
  }

  return (
    <PageLayout>
      <TopNav
        title="✦ Flashcards"
        actions={
          <Button onClick={() => navigate('/create')}>
            + Novo baralho
          </Button>
        }
      />

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spinner size={32} />
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px 20px', borderRadius: 'var(--radius-sm)',
          background: 'var(--red-bg)', color: 'var(--red)',
          border: '1px solid rgba(248,113,113,0.2)', marginBottom: 24, fontSize: 14
        }}>
          ⚠ Erro ao carregar: {error}. Verifique as variáveis de ambiente.
        </div>
      )}

      {!loading && !error && decks.length === 0 && (
        <EmptyState
          icon="🗂"
          title="Nenhum baralho ainda"
          description="Crie seu primeiro baralho e comece a estudar"
          action={<Button onClick={() => navigate('/create')}>Criar primeiro baralho</Button>}
        />
      )}

      {!loading && decks.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16
        }}>
          {decks.map((deck, i) => (
            <Card
              key={deck.id}
              hover
              style={{
                padding: '20px 22px',
                animation: 'fadeIn 0.3s ease both',
                animationDelay: `${i * 0.05}s`
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16, fontWeight: 600,
                  marginBottom: 6, color: 'var(--text)'
                }}>
                  {deck.name}
                </h3>
                {deck.description && (
                  <p style={{
                    fontSize: 13, color: 'var(--text-2)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {deck.description}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <Badge color="gray">
                  {deck.cards?.[0]?.count ?? 0} cartões
                </Badge>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="sm"
                  onClick={() => navigate(`/deck/${deck.id}/study`)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Estudar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/deck/${deck.id}/edit`)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => handleDelete(e, deck.id, deck.name)}
                >
                  ✕
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Toast toast={toast} />
    </PageLayout>
  )
}
