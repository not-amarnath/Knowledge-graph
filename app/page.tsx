"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { Globe, Brain, Network, MessageSquare, Database, Bot, FileText, Zap, Settings, Menu, X } from "lucide-react"
import NLPProcessor from "@/components/nlp-processor"
import KnowledgeGraph from "@/components/knowledge-graph"
import ChatInterface from "@/components/chat-interface"
import DataIngestion from "@/components/data-ingestion"
import VectorSearch from "@/components/vector-search"

export default function KnowledgeGraphChatbot() {
  const [activeWorkflow, setActiveWorkflow] = useState<string>("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      color: "bg-blue-500 dark:bg-blue-600",
      tools: ["Scrapy", "BeautifulSoup", "Playwright", "pdfminer", "docx2txt"],
    },
    {
      id: "nlp",
      title: "NLP Processing",
      description: "Named Entity Recognition and relationship extraction",
      icon: Brain,
      color: "bg-green-500 dark:bg-green-600",
      tools: ["spaCy", "BERT", "Stanford NLP", "HuggingFace Transformers"],
    },
    {
      id: "kg",
      title: "Knowledge Graph Construction",
      description: "Graph database creation and ontology design",
      icon: Network,
      color: "bg-purple-500 dark:bg-purple-600",
      tools: ["Neo4j", "RDFLib", "NetworkX"],
    },
    {
      id: "ai",
      title: "AI/ML Integration",
      description: "Intent detection, semantic search, and RAG implementation",
      icon: Zap,
      color: "bg-orange-500 dark:bg-orange-600",
      tools: ["BERT", "SentenceTransformers", "FAISS", "ChromaDB", "LangChain"],
    },
    {
      id: "chat",
      title: "Chatbot Interface",
      description: "UI layer and backend API development",
      icon: MessageSquare,
      color: "bg-pink-500 dark:bg-pink-600",
      tools: ["React", "FastAPI", "Streamlit", "Flask"],
    },
    {
      id: "deployment",
      title: "Deployment & Modularization",
      description: "Hosting and microservices architecture",
      icon: Settings,
      color: "bg-gray-500 dark:bg-gray-600",
      tools: ["Vercel", "Railway", "AWS", "Docker"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 transition-colors duration-300">
      <div className="container-responsive">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border py-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">Knowledge Graph Platform</h1>
                  <p className="text-sm text-muted-foreground hidden md:block">
                    AI-powered chatbot with knowledge graph integration
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                v1.0.0
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-4">
              <div className="space-y-2">
                {workflowSteps.map((step) => {
                  const Icon = step.icon
                  return (
                    <Button
                      key={step.id}
                      variant={activeWorkflow === step.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveWorkflow(step.id)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{step.title.split(" ")[0]}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="heading-responsive font-bold text-foreground mb-4">🧭 Knowledge Graph Chatbot Platform</h1>
          <p className="text-responsive text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Complete AI-powered chatbot with web crawling, NLP processing, knowledge graph construction, and RAG-based
            conversational interface for satellite data and scientific portals
          </p>
        </div>

        {/* Workflow Overview */}
        <Card className="mb-6 sm:mb-8 shadow-lg dark:shadow-2xl">
          <CardHeader className="card-responsive">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Database className="h-5 w-5 sm:h-6 sm:w-6" />
              Project Workflow Overview
            </CardTitle>
            <CardDescription className="text-responsive">
              End-to-end pipeline for building intelligent chatbots with knowledge graphs
            </CardDescription>
          </CardHeader>
          <CardContent className="card-responsive">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {workflowSteps.map((step) => {
                const Icon = step.icon
                return (
                  <Card
                    key={step.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      activeWorkflow === step.id ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                    onClick={() => setActiveWorkflow(step.id)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 sm:p-3 rounded-lg ${step.color} text-white flex-shrink-0`}>
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{step.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                            {step.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {step.tools.slice(0, 2).map((tool) => (
                              <Badge key={tool} variant="secondary" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                            {step.tools.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{step.tools.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Progress
                            value={workflowProgress[step.id as keyof typeof workflowProgress]}
                            className="h-1.5 sm:h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Workflow Diagram */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
                <Network className="h-4 w-4 sm:h-5 sm:w-5" />
                Workflow Pipeline
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 overflow-x-auto">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                      <div className={`p-2 sm:p-3 rounded-full ${step.color} text-white`}>
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium hidden md:block whitespace-nowrap">
                        {step.title.split(" ")[0]}
                      </span>
                      {index < workflowSteps.length - 1 && (
                        <div className="hidden sm:block w-6 sm:w-8 h-px bg-border mx-2" />
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
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 min-w-max lg:min-w-full">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="ingestion" className="text-xs sm:text-sm">
                Data
              </TabsTrigger>
              <TabsTrigger value="nlp" className="text-xs sm:text-sm">
                NLP
              </TabsTrigger>
              <TabsTrigger value="kg" className="text-xs sm:text-sm">
                Graph
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs sm:text-sm">
                AI/RAG
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs sm:text-sm">
                Chat
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg dark:shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <FileText className="h-5 w-5" />
                    System Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Frontend Layer</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      React/Next.js interface with real-time chat, graph visualization, and admin controls
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">API Layer</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      FastAPI/Next.js API routes handling RAG pipeline, vector search, and graph queries
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/50 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Data Layer</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Knowledge graph database, vector store, and document repository
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg dark:shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Bot className="h-5 w-5" />
                    Quick Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => setActiveWorkflow("chat")} className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Try the Chatbot
                  </Button>
                  <Button onClick={() => setActiveWorkflow("kg")} variant="outline" className="w-full" size="lg">
                    <Network className="h-4 w-4 mr-2" />
                    Explore Knowledge Graph
                  </Button>
                  <Button onClick={() => setActiveWorkflow("ingestion")} variant="outline" className="w-full" size="lg">
                    <Globe className="h-4 w-4 mr-2" />
                    Start Data Ingestion
                  </Button>
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

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 py-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 Knowledge Graph Chatbot Platform. Built with Next.js and AI SDK.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                Responsive Design
              </Badge>
              <Badge variant="outline" className="text-xs">
                Dark/Light Theme
              </Badge>
              <Badge variant="outline" className="text-xs">
                Mobile First
              </Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
