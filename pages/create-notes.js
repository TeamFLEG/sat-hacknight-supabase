import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { supabase } from '../api'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
const initialState = { title: '', content: '' }

function CreateNote() {
    const [note, setNote] = useState(initialState)
    const { title, content } = note
    const router = useRouter()
    function onChange(e) {
        setNote(() => ({ ...note, [e.target.name]: e.target.value }))
    }
    async function createNewNote() {
        if (!title || !content) return
        const user = supabase.auth.user()
        const id = uuid()
        note.id = id
        const { data } = await supabase
            .from('notes')
            .insert([
                { title, content, user_id: user.id }
            ])
            .single()
        router.push(`/notes/${data.id}`)
    }
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new note</h1>
            <input
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={note.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
            />
            <SimpleMDE
                value={note.content}
                onChange={value => setNote({ ...note, content: value })}
            />
            <button
                type="button"
                className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
                onClick={createNewNote}
            >Create Note</button>
        </div>
    )
}

export default CreateNote