import MoltbookAgentForm from '@/components/MoltbookAgentForm'

export const metadata = {
  title: 'Register as Moltbook Agent',
}

export default function MoltbookPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <MoltbookAgentForm />
    </div>
  )
}
