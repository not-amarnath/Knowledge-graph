"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Globe, Brain, Network, MessageSquare, Database, Bot, FileText, Zap, Settings } from "lucide-react"
import NLPProcessor from "@/components/nlp-processor"
import KnowledgeGraph from "@/components/knowledge-graph"
import ChatInterface from "@/components/chat-interface"
import DataIngestion from "@/components/data-ingestion"
import VectorSearch from "@/components/vector-search"

export default function KnowledgeGraphChatbot() {
  const [activeWorkflow, setActiveWorkflow] = useState<string>("overview")
  const [workflowProgress, setWorkflowProgress] = useState({
    ingestion: 0,
    nlp: 0,
    kg: 0,
    ai: 0,
    chat: 0,
    deployment: 0,
  })

  const workflowSteps = [
    {
      id: "ingestion",
      title: "Data Ingestion & Preprocessing",
      description: "Web crawling, content extraction, and format normalization",
      icon: Globe,
      color: "bg-blue-500",
      tools: ["Scrapy", "BeautifulSoup", "Playwright", "pdfminer", "docx2txt"],
    },
    {
      id: "nlp",
      title: "NLP Processing",
      description: "Named Entity Recognition and relationship extraction",
      icon: Brain,
      color: "bg-green-500",
      tools: ["spaCy", "BERT", "Stanford NLP", "HuggingFace Transformers"],
    },
    {
      id: "kg",
      title: "Knowledge Graph Construction",
      description: "Graph database creation and ontology design",
      icon: Network,
      color: "bg-purple-500",
      tools: ["Neo4j", "RDFLib", "NetworkX"],
    },
    {
      id: "ai",
      title: "AI/ML Integration",
      description: "Intent detection, semantic search, and RAG implementation",
      icon: Zap,
      color: "bg-orange-500",
      tools: ["BERT", "SentenceTransformers", "FAISS", "ChromaDB", "LangChain"],
    },
    {
      id: "chat",
      title: "Chatbot Interface",
      description: "UI layer and backend API development",
      icon: MessageSquare,
      color: "bg-pink-500",
      tools: ["React", "FastAPI", "Streamlit", "Flask"],
    },
    {
      id: "deployment",
      title: "Deployment & Modularization",
      description: "Hosting and microservices architecture",
      icon: Settings,
      color: "bg-gray-500",
      tools: ["Vercel", "Railway", "AWS", "Docker"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧭 Knowledge Graph Chatbot Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete AI-powered chatbot with web crawling, NLP processing, knowledge graph construction, and RAG-based
            conversational interface
          </p>
        </div>

        {/* Workflow Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Project Workflow Overview
            </CardTitle>
            <CardDescription>
              End-to-end pipeline for building intelligent chatbots with knowledge graphs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {workflowSteps.map((step) => {
                const Icon = step.icon
                return (
                  <Card
                    key={step.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activeWorkflow === step.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setActiveWorkflow(step.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${step.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {step.tools.slice(0, 3).map((tool) => (
                              <Badge key={tool} variant="secondary" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                            {step.tools.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{step.tools.length - 3}
                              </Badge>
                            )}
                          </div>
                          <Progress
                            value={workflowProgress[step.id as keyof typeof workflowProgress]}
                            className="mt-2 h-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Workflow Diagram */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Network className="h-5 w-5" />
                Workflow Pipeline
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`p-3 rounded-full ${step.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium hidden md:block">{step.title.split(" ")[0]}</span>
                      {index < workflowSteps.length - 1 && (
                        <div className="hidden md:block w-8 h-px bg-gray-300 mx-2" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Tabs value={activeWorkflow} onValueChange={setActiveWorkflow} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ingestion">Data</TabsTrigger>
            <TabsTrigger value="nlp">NLP</TabsTrigger>
            <TabsTrigger value="kg">Graph</TabsTrigger>
            <TabsTrigger value="ai">AI/RAG</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    System Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Frontend Layer</h4>
                      <p className="text-sm text-blue-700">
                        React/Next.js interface with real-time chat, graph visualization, and admin controls
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">API Layer</h4>
                      <p className="text-sm text-green-700">
                        FastAPI/Next.js API routes handling RAG pipeline, vector search, and graph queries
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Data Layer</h4>
                      <p className="text-sm text-purple-700">
                        Knowledge graph database, vector store, and document repository
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Quick Demo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={() => setActiveWorkflow("chat")} className="w-full" size="lg">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Try the Chatbot
                    </Button>
                    <Button onClick={() => setActiveWorkflow("kg")} variant="outline" className="w-full" size="lg">
                      <Network className="h-4 w-4 mr-2" />
                      Explore Knowledge Graph
                    </Button>
                    <Button
                      onClick={() => setActiveWorkflow("ingestion")}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Start Data Ingestion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ingestion">
            <DataIngestion
              onProgressUpdate={(progress) => setWorkflowProgress((prev) => ({ ...prev, ingestion: progress }))}
            />
          </TabsContent>

          <TabsContent value="nlp">
            <NLPProcessor
              onProgressUpdate={(progress) => setWorkflowProgress((prev) => ({ ...prev, nlp: progress }))}
            />
          </TabsContent>

          <TabsContent value="kg">
            <KnowledgeGraph
              onProgressUpdate={(progress) => setWorkflowProgress((prev) => ({ ...prev, kg: progress }))}
            />
          </TabsContent>

          <TabsContent value="ai">
            <VectorSearch onProgressUpdate={(progress) => setWorkflowProgress((prev) => ({ ...prev, ai: progress }))} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface
              onProgressUpdate={(progress) => setWorkflowProgress((prev) => ({ ...prev, chat: progress }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
