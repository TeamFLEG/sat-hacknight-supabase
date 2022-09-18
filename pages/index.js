import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../api'

export default function Home() {
  const [notes, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchNotes()
  }, [])
  async function fetchNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select()
    setPosts(data)
    setLoading(false)
  }
  if (loading) return <p className="text-2xl">Loading ...</p>
  if (!notes.length) return <p className="text-2xl">No notes.</p>
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      {
        notes.map(note => (
          <Link key={note.id} href={`/notes/${note.id}`}>
            <div className="cursor-pointer border-b border-gray-300	mt-8 pb-4">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-500 mt-2">Author: {note.user_email}</p>
            </div>
          </Link>)
        )
      }
    </div>
  )
}