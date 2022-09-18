import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../api'

export default function Note({ note }) {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1 className="text-5xl mt-4 font-semibold tracking-wide">{note.title}</h1>
            <p className="text-sm font-light my-4">by {note.user_email}</p>
            <div className="mt-8">
                <ReactMarkdown className='prose'>{note.content}</ReactMarkdown>
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const { data, error } = await supabase
        .from('notes')
        .select('id')
    const paths = data.map(note => ({ params: { id: JSON.stringify(note.id) } }))
    return {
        paths,  
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const { id } = params
    const { data } = await supabase
        .from('notes')
        .select()
        .filter('id', 'eq', id)
        .single()
    return {
        props: {
            note: data
        }
    }
}