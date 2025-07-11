"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Zap, Database, Brain, Target, CheckCircle, Play, Settings } from "lucide-react"

interface VectorSearchProps {
  onProgressUpdate: (progress: number) => void
}

export default function VectorSearch({ onProgressUpdate }: VectorSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isIndexing, setIsIndexing] = useState(false)
  const [indexingProgress, setIndexingProgress] = useState(0)
  const [vectorStats, setVectorStats] = useState({
    documents: 1250,
    vectors: 1250,
    dimensions: 768,
    indexed: true,
  })

  const sampleResults = [
    {
      id: 1,
      title: "INSAT-3D Atmospheric Temperature Data",
      content:
        "INSAT-3D provides high-resolution atmospheric temperature profiles for weather forecasting and climate monitoring applications.",
      score: 0.94,
      source: "mosdac.gov.in/insat3d",
      metadata: { type: "product", category: "atmospheric" },
    },
    {
      id: 2,
      title: "Satellite Data API Documentation",
      content:
        "Complete guide to accessing meteorological satellite data through MOSDAC REST API endpoints with authentication and rate limiting.",
      score: 0.87,
      source: "mosdac.gov.in/api/docs",
      metadata: { type: "documentation", category: "api" },
    },
    {
      id: 3,
      title: "Weather Forecasting Applications",
      content:
        "Applications of satellite-derived atmospheric data in numerical weather prediction models and climate research studies.",
      score: 0.82,
      source: "mosdac.gov.in/applications",
      metadata: { type: "application", category: "weather" },
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    // Simulate vector search
    setSearchResults(
      sampleResults
        .map((result) => ({
          ...result,
          score: Math.random() * 0.3 + 0.7, // Random score between 0.7-1.0
        }))
        .sort((a, b) => b.score - a.score),
    )
  }

  const startIndexing = async () => {
    setIsIndexing(true)
    setIndexingProgress(0)

    const interval = setInterval(() => {
      setIndexingProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsIndexing(false)
          onProgressUpdate(100)
          return 100
        }
        onProgressUpdate(newProgress)
        return newProgress
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            AI/ML Model Integration
          </CardTitle>
          <CardDescription>Intent detection, semantic search, and Retrieval Augmented Generation (RAG)</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Vector Search</TabsTrigger>
          <TabsTrigger value="rag">RAG Pipeline</TabsTrigger>
          <TabsTrigger value="intent">Intent Detection</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Semantic Search Interface
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about satellite data, weather forecasting, or API usage..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "INSAT-3D data access",
                      "Weather API endpoints",
                      "Atmospheric temperature",
                      "Satellite imagery download",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          handleSearch()
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>Found {searchResults.length} relevant documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchResults.map((result) => (
                      <div key={result.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{result.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{(result.score * 100).toFixed(1)}%</Badge>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${result.score * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{result.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{result.source}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.metadata.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Vector Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documents</span>
                    <Badge variant="secondary">{vectorStats.documents.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vectors</span>
                    <Badge variant="secondary">{vectorStats.vectors.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dimensions</span>
                    <Badge variant="secondary">{vectorStats.dimensions}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant={vectorStats.indexed ? "default" : "secondary"}>
                      {vectorStats.indexed ? "Indexed" : "Indexing"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vector Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={startIndexing}
                    disabled={isIndexing}
                    className="w-full bg-transparent"
                    variant="outline"
                  >
                    {isIndexing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        Indexing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Rebuild Index
                      </>
                    )}
                  </Button>

                  {isIndexing && (
                    <div className="space-y-2">
                      <Progress value={indexingProgress} />
                      <p className="text-xs text-gray-600 text-center">{Math.round(indexingProgress)}% complete</p>
                    </div>
                  )}

                  <Button variant="outline" className="w-full bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    Optimize Vectors
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    Export Embeddings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Search Models</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "BERT", desc: "Transformer embeddings", active: true },
                    { name: "SentenceTransformers", desc: "Semantic similarity", active: true },
                    { name: "TF-IDF", desc: "Term frequency", active: false },
                    { name: "Word2Vec", desc: "Word embeddings", active: false },
                  ].map((model) => (
                    <div
                      key={model.name}
                      className={`p-2 rounded border ${model.active ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-sm font-medium">{model.name}</h5>
                          <p className="text-xs text-gray-600">{model.desc}</p>
                        </div>
                        {model.active && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rag" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                RAG Pipeline Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Retrieval</h4>
                  <p className="text-sm text-blue-700">Vector similarity search + Knowledge graph traversal</p>
                  <Badge className="mt-2">FAISS + Neo4j</Badge>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. Augmentation</h4>
                  <p className="text-sm text-green-700">Context enrichment with metadata and relationships</p>
                  <Badge className="mt-2">LangChain</Badge>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">3. Generation</h4>
                  <p className="text-sm text-purple-700">LLM response with source attribution</p>
                  <Badge className="mt-2">GPT-4 / Llama3</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">RAG Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Top-K Results</label>
                    <Input type="number" defaultValue={5} min={1} max={20} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Similarity Threshold</label>
                    <Input type="number" defaultValue={0.7} min={0} max={1} step={0.1} />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Test RAG Pipeline
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Intent Detection & Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { intent: "data_access", label: "Data Access", count: 45, color: "bg-blue-100 text-blue-800" },
                  { intent: "api_usage", label: "API Usage", count: 32, color: "bg-green-100 text-green-800" },
                  { intent: "troubleshooting", label: "Support", count: 28, color: "bg-orange-100 text-orange-800" },
                  { intent: "general_info", label: "Information", count: 19, color: "bg-purple-100 text-purple-800" },
                ].map((item) => (
                  <div key={item.intent} className={`p-3 rounded-lg ${item.color}`}>
                    <h5 className="font-medium text-sm">{item.label}</h5>
                    <p className="text-xs opacity-75">{item.count} queries</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Intent Classification Models</h4>
                <div className="space-y-2">
                  {[
                    { model: "DistilBERT", accuracy: 0.94, active: true },
                    { model: "RoBERTa", accuracy: 0.91, active: false },
                    { model: "SVM + TF-IDF", accuracy: 0.87, active: false },
                  ].map((model) => (
                    <div key={model.model} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm font-medium">{model.model}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{(model.accuracy * 100).toFixed(1)}%</span>
                        {model.active && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Vector Database Settings</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">Vector Store</label>
                      <select className="w-full p-2 border rounded">
                        <option>FAISS</option>
                        <option>ChromaDB</option>
                        <option>Pinecone</option>
                        <option>Weaviate</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Embedding Model</label>
                      <select className="w-full p-2 border rounded">
                        <option>sentence-transformers/all-MiniLM-L6-v2</option>
                        <option>text-embedding-ada-002</option>
                        <option>BERT-base-uncased</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">LLM Configuration</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">Primary Model</label>
                      <select className="w-full p-2 border rounded">
                        <option>GPT-4</option>
                        <option>GPT-3.5-turbo</option>
                        <option>Llama3-70B</option>
                        <option>Mistral-7B</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Temperature</label>
                      <Input type="number" defaultValue={0.3} min={0} max={1} step={0.1} />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
