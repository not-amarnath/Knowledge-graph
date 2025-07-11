"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Network, Search, Filter, Download, Maximize, Database, Layers, Zap } from "lucide-react"

interface KnowledgeGraphProps {
  onProgressUpdate: (progress: number) => void
}

export default function KnowledgeGraph({ onProgressUpdate }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [graphStats, setGraphStats] = useState({
    nodes: 0,
    edges: 0,
    entities: 0,
    relationships: 0,
  })

  const sampleNodes = [
    { id: "insat3d", label: "INSAT-3D", type: "satellite", x: 300, y: 200, color: "#3b82f6" },
    { id: "atmos", label: "Atmospheric Data", type: "data", x: 500, y: 150, color: "#10b981" },
    { id: "temp", label: "Temperature", type: "measurement", x: 450, y: 300, color: "#f59e0b" },
    { id: "mosdac", label: "MOSDAC", type: "organization", x: 150, y: 250, color: "#8b5cf6" },
    { id: "api", label: "API Services", type: "service", x: 200, y: 100, color: "#ef4444" },
    { id: "users", label: "Users", type: "actor", x: 100, y: 350, color: "#06b6d4" },
  ]

  const sampleEdges = [
    { from: "insat3d", to: "atmos", label: "provides", weight: 0.9 },
    { from: "atmos", to: "temp", label: "contains", weight: 0.8 },
    { from: "mosdac", to: "api", label: "offers", weight: 0.95 },
    { from: "api", to: "atmos", label: "accesses", weight: 0.7 },
    { from: "users", to: "api", label: "uses", weight: 0.85 },
    { from: "mosdac", to: "insat3d", label: "operates", weight: 0.9 },
  ]

  useEffect(() => {
    drawGraph()
    setGraphStats({
      nodes: sampleNodes.length,
      edges: sampleEdges.length,
      entities: sampleNodes.filter((n) => n.type !== "actor").length,
      relationships: sampleEdges.length,
    })
    onProgressUpdate(100)
  }, [])

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    sampleEdges.forEach((edge) => {
      const fromNode = sampleNodes.find((n) => n.id === edge.from)
      const toNode = sampleNodes.find((n) => n.id === edge.to)
      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()

        // Draw edge label
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(edge.label, midX, midY - 5)
      }
    })

    // Draw nodes
    sampleNodes.forEach((node) => {
      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // Node label
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.label, node.x, node.y + 45)
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is on a node
    const clickedNode = sampleNodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= 25
    })

    setSelectedNode(clickedNode)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Knowledge Graph Construction
          </CardTitle>
          <CardDescription>
            Interactive graph database with entities, relationships, and ontology design
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Graph Visualization
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border rounded-lg cursor-pointer w-full"
                  onClick={handleCanvasClick}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="Search nodes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <div className="text-xs text-gray-600">Click nodes to explore relationships</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Graph Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Graph Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nodes</span>
                <Badge variant="secondary">{graphStats.nodes}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Edges</span>
                <Badge variant="secondary">{graphStats.edges}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Entities</span>
                <Badge variant="secondary">{graphStats.entities}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Relations</span>
                <Badge variant="secondary">{graphStats.relationships}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Selected Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Node Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedNode.label}</h4>
                  <Badge variant="outline" className="mt-1">
                    {selectedNode.type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Connected to:</h5>
                  {sampleEdges
                    .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                    .map((edge, index) => {
                      const connectedNodeId = edge.from === selectedNode.id ? edge.to : edge.from
                      const connectedNode = sampleNodes.find((n) => n.id === connectedNodeId)
                      return (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <span className="font-medium">{edge.label}</span> {connectedNode?.label}
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Graph Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Graph Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full bg-transparent" variant="outline">
                Export to Neo4j
              </Button>
              <Button size="sm" className="w-full bg-transparent" variant="outline">
                Generate RDF
              </Button>
              <Button size="sm" className="w-full bg-transparent" variant="outline">
                Create Ontology
              </Button>
              <Button size="sm" className="w-full bg-transparent" variant="outline">
                Analyze Patterns
              </Button>
            </CardContent>
          </Card>

          {/* Entity Types Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Entity Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: "satellite", color: "#3b82f6", label: "Satellites" },
                { type: "data", color: "#10b981", label: "Data Products" },
                { type: "measurement", color: "#f59e0b", label: "Measurements" },
                { type: "organization", color: "#8b5cf6", label: "Organizations" },
                { type: "service", color: "#ef4444", label: "Services" },
                { type: "actor", color: "#06b6d4", label: "Actors" },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
