import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChatStore } from '@/lib/store'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const { messages, model, isLoading, addMessage, setModel, setLoading } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    addMessage(userMessage)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model,
        }),
      })

      const data = await response.json()
      addMessage({ role: 'assistant', content: data.response })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 max-w-4xl mx-auto">
      <Card className="flex-grow mb-4 p-4 overflow-hidden flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Chat</h2>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anthropic/claude-2">Claude 2</SelectItem>
              <SelectItem value="anthropic/claude-instant-v1">Claude Instant</SelectItem>
              <SelectItem value="google/palm-2-chat-bison">PaLM 2</SelectItem>
              <SelectItem value="meta-llama/llama-2-70b-chat">Llama 2 70B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <ScrollArea className="flex-grow mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((message: { role: string; content: string }, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted mr-8'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted p-4 rounded-lg mr-8">
                Thinking...
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}