"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Bot, User, ExternalLink, ThumbsUp, ThumbsDown, Copy, RefreshCw } from "lucide-react"

interface ChatInterfaceProps {
  onProgressUpdate: (progress: number) => void
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  sources?: Array<{
    title: string
    url: string
    relevance: number
  }>
  feedback?: "positive" | "negative"
}

export default function ChatInterface({ onProgressUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI assistant for satellite data and MOSDAC services. I can help you with data access, API usage, weather information, and technical support. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const sampleResponses = [
    {
      query: "insat",
      response:
        "INSAT-3D is an advanced meteorological satellite that provides high-resolution atmospheric data including temperature and humidity profiles. You can access INSAT-3D data through our API endpoints or download directly from the MOSDAC portal.",
      sources: [
        { title: "INSAT-3D Data Products", url: "mosdac.gov.in/insat3d", relevance: 0.95 },
        { title: "API Documentation", url: "mosdac.gov.in/api", relevance: 0.87 },
      ],
    },
    {
      query: "api",
      response:
        "MOSDAC provides REST API endpoints for programmatic access to satellite data. You'll need to register for an API key and follow our authentication guidelines. The API supports various data formats including NetCDF, HDF5, and GeoTIFF.",
      sources: [
        { title: "API Getting Started Guide", url: "mosdac.gov.in/api/guide", relevance: 0.92 },
        { title: "Authentication Methods", url: "mosdac.gov.in/auth", relevance: 0.89 },
      ],
    },
    {
      query: "weather",
      response:
        "Our satellite data supports various weather applications including numerical weather prediction, climate monitoring, and severe weather detection. Real-time data is available with updates every 30 minutes for most products.",
      sources: [
        { title: "Weather Applications", url: "mosdac.gov.in/weather", relevance: 0.91 },
        { title: "Real-time Data Access", url: "mosdac.gov.in/realtime", relevance: 0.85 },
      ],
    },
  ]

  useEffect(() => {
    onProgressUpdate(100)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const matchedResponse = sampleResponses.find((r) => inputMessage.toLowerCase().includes(r.query)) || {
        response:
          "I understand you're asking about satellite data services. Let me help you find the relevant information. Could you please be more specific about what you're looking for?",
        sources: [],
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: matchedResponse.response,
        timestamp: new Date(),
        sources: matchedResponse.sources,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            AI Chatbot Interface
          </CardTitle>
          <CardDescription>
            Interactive conversational AI with RAG-powered responses and source attribution
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        <div
                          className={`rounded-lg p-3 ${
                            message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>

                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium opacity-75">Sources:</p>
                              {message.sources.map((source, index) => (
                                <div key={index} className="bg-white/10 rounded p-2">
                                  <div className="flex justify-between items-start">
                                    <a
                                      href={`https://${source.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs hover:underline flex items-center gap-1"
                                    >
                                      {source.title}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                    <Badge variant="secondary" className="text-xs">
                                      {(source.relevance * 100).toFixed(0)}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs opacity-50">{message.timestamp.toLocaleTimeString()}</span>

                            {message.type === "bot" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(message.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-6 w-6 p-0 ${message.feedback === "positive" ? "text-green-600" : ""}`}
                                  onClick={() => handleFeedback(message.id, "positive")}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-6 w-6 p-0 ${message.feedback === "negative" ? "text-red-600" : ""}`}
                                  onClick={() => handleFeedback(message.id, "negative")}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about satellite data, API usage, weather forecasting..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "How to access INSAT-3D data?",
                "API authentication guide",
                "Download weather imagery",
                "Real-time data availability",
                "Troubleshoot API errors",
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 bg-transparent"
                  onClick={() => setInputMessage(question)}
                >
                  <span className="text-xs">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Messages</span>
                <Badge variant="secondary">{messages.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <Badge variant="secondary">1.2s avg</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Satisfaction</span>
                <Badge variant="secondary">94%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>RAG-powered responses</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Source attribution</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Intent detection</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Context awareness</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Multi-modal support</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
