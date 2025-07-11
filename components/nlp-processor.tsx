"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Network, Zap, Play, CheckCircle, ArrowRight, Eye } from "lucide-react"

interface NLPProcessorProps {
  onProgressUpdate: (progress: number) => void
}

export default function NLPProcessor({ onProgressUpdate }: NLPProcessorProps) {
  const [processingStatus, setProcessingStatus] = useState<"idle" | "running" | "completed">("idle")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedEntities, setExtractedEntities] = useState<any[]>([])
  const [relationships, setRelationships] = useState<any[]>([])

  const sampleEntities = [
    { text: "INSAT-3D", label: "SATELLITE", confidence: 0.95 },
    { text: "Atmospheric Data", label: "DATA_PRODUCT", confidence: 0.89 },
    { text: "Temperature Profile", label: "MEASUREMENT", confidence: 0.92 },
    { text: "MOSDAC", label: "ORGANIZATION", confidence: 0.98 },
    { text: "API Services", label: "SERVICE", confidence: 0.87 },
    { text: "Meteorological Data", label: "DATA_TYPE", confidence: 0.91 },
  ]

  const sampleRelationships = [
    { subject: "INSAT-3D", predicate: "provides", object: "Atmospheric Data", confidence: 0.94 },
    { subject: "MOSDAC", predicate: "offers", object: "API Services", confidence: 0.92 },
    { subject: "Temperature Profile", predicate: "part_of", object: "Atmospheric Data", confidence: 0.88 },
    { subject: "API Services", predicate: "enables_access_to", object: "Meteorological Data", confidence: 0.85 },
  ]

  const startProcessing = async () => {
    setProcessingStatus("running")
    setProcessingProgress(0)

    // Simulate NLP processing
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + Math.random() * 12
        if (newProgress >= 100) {
          clearInterval(interval)
          setProcessingStatus("completed")
          setExtractedEntities(sampleEntities)
          setRelationships(sampleRelationships)
          onProgressUpdate(100)
          return 100
        }
        onProgressUpdate(newProgress)
        return newProgress
      })
    }, 600)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            NLP-Based Information Processing
          </CardTitle>
          <CardDescription>Named Entity Recognition, relationship extraction, and triplet generation</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ner">Entity Recognition</TabsTrigger>
          <TabsTrigger value="relations">Relationships</TabsTrigger>
          <TabsTrigger value="triplets">Triplets</TabsTrigger>
        </TabsList>

        <TabsContent value="ner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Named Entity Recognition (NER)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "spaCy", desc: "Industrial NLP", active: true },
                  { name: "BERT", desc: "Transformer model", active: true },
                  { name: "Stanford NLP", desc: "Core NLP toolkit", active: false },
                  { name: "HuggingFace", desc: "Transformers library", active: true },
                ].map((tool) => (
                  <div
                    key={tool.name}
                    className={`p-3 rounded-lg border ${tool.active ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <h4 className="font-medium text-sm">{tool.name}</h4>
                    <p className="text-xs text-gray-600">{tool.desc}</p>
                    {tool.active && <Badge className="mt-1 text-xs">Active</Badge>}
                  </div>
                ))}
              </div>

              <Button onClick={startProcessing} disabled={processingStatus === "running"} className="w-full">
                {processingStatus === "running" ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Processing Entities...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start NER Processing
                  </>
                )}
              </Button>

              {processingStatus === "running" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing Progress</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <Progress value={processingProgress} />
                </div>
              )}

              {processingStatus === "completed" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Entity extraction completed!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Extracted {extractedEntities.length} entities with high confidence scores
                  </p>
                </div>
              )}

              {extractedEntities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Extracted Entities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {extractedEntities.map((entity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{entity.text}</span>
                            <Badge variant="outline">{entity.label}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{(entity.confidence * 100).toFixed(1)}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${entity.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Relationship Extraction
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relationships.length > 0 ? (
                <div className="space-y-4">
                  {relationships.map((rel, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <Badge variant="secondary">{rel.subject}</Badge>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">{rel.predicate}</span>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      <Badge variant="secondary">{rel.object}</Badge>
                      <div className="ml-auto text-sm text-gray-600">{(rel.confidence * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run NER processing first to extract relationships</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triplets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Triplets</CardTitle>
              <CardDescription>Structured (Subject) — [Predicate] —{">"} (Object) relationships</CardDescription>
            </CardHeader>
            <CardContent>
              {relationships.length > 0 ? (
                <div className="space-y-3">
                  {relationships.map((rel, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                      <div className="font-mono text-sm">
                        <span className="text-blue-600">({rel.subject})</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-green-600">[{rel.predicate}]</span>
                        <span className="text-gray-500 mx-2">—{">"}</span>
                        <span className="text-purple-600">({rel.object})</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          Confidence: {(rel.confidence * 100).toFixed(1)}%
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3 mr-1" />
                          View in Graph
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Process entities and relationships to generate triplets</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
