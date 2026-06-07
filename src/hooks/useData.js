import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDecks() {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDecks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('decks')
      .select('*, cards(count)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setDecks(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchDecks() }, [fetchDecks])

  const createDeck = async (name, description = '') => {
    const { data, error } = await supabase
      .from('decks')
      .insert({ name, description })
      .select()
      .single()
    if (error) throw error
    return data
  }

  const deleteDeck = async (id) => {
    const { error } = await supabase.from('decks').delete().eq('id', id)
    if (error) throw error
    setDecks(prev => prev.filter(d => d.id !== id))
  }

  return { decks, loading, error, refetch: fetchDecks, createDeck, deleteDeck }
}

export function useDeck(id) {
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    const [deckRes, cardsRes] = await Promise.all([
      supabase.from('decks').select('*').eq('id', id).single(),
      supabase.from('cards').select('*').eq('deck_id', id).order('position')
    ])
    if (deckRes.error) setError(deckRes.error.message)
    else setDeck(deckRes.data)
    if (!cardsRes.error) setCards(cardsRes.data || [])
    setLoading(false)
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  const updateDeck = async (updates) => {
    const { data, error } = await supabase
      .from('decks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setDeck(data)
    return data
  }

  const saveCards = async (cardList) => {
    // Delete all existing cards for this deck, then re-insert
    await supabase.from('cards').delete().eq('deck_id', id)
    if (cardList.length === 0) { setCards([]); return }
    const toInsert = cardList.map((c, i) => ({
      deck_id: id,
      front: c.front,
      back: c.back,
      position: i
    }))
    const { data, error } = await supabase.from('cards').insert(toInsert).select()
    if (error) throw error
    setCards(data || [])
    return data
  }

  const updateStudyStats = async (cardId, correct) => {
    const card = cards.find(c => c.id === cardId)
    if (!card) return
    const times_reviewed = (card.times_reviewed || 0) + 1
    const times_correct = (card.times_correct || 0) + (correct ? 1 : 0)
    await supabase.from('cards')
      .update({ times_reviewed, times_correct, last_reviewed: new Date().toISOString() })
      .eq('id', cardId)
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, times_reviewed, times_correct } : c
    ))
  }

  return { deck, cards, loading, error, refetch: fetch, updateDeck, saveCards, updateStudyStats }
}
