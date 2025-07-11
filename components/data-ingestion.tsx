"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, FileText, Play, Pause, RefreshCw, CheckCircle, Upload } from "lucide-react"

interface DataIngestionProps {
  onProgressUpdate: (progress: number) => void
}

export default function DataIngestion({ onProgressUpdate }: DataIngestionProps) {
  const [crawlUrl, setCrawlUrl] = useState("https://mosdac.gov.in")
  const [crawlStatus, setCrawlStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [crawlProgress, setCrawlProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const sampleExtractedData = [
    {
      url: "https://mosdac.gov.in/data/insat3d",
      title: "INSAT-3D Atmospheric Data",
      content: "INSAT-3D provides atmospheric temperature and humidity profiles...",
      entities: ["INSAT-3D", "Atmospheric Data", "Temperature", "Humidity"],
      metadata: { type: "product", category: "satellite" },
    },
    {
      url: "https://mosdac.gov.in/services/api",
      title: "MOSDAC API Services",
      content: "Access satellite data through our REST API endpoints...",
      entities: ["API", "REST", "Satellite Data", "Services"],
      metadata: { type: "service", category: "api" },
    },
    {
      url: "https://mosdac.gov.in/faq",
      title: "Frequently Asked Questions",
      content: "Common questions about satellite data access and usage...",
      entities: ["FAQ", "Support", "Data Access", "Usage"],
      metadata: { type: "support", category: "documentation" },
    },
  ]

  const startCrawling = async () => {
    setCrawlStatus("running")
    setCrawlProgress(0)

    // Simulate crawling process
    const interval = setInterval(() => {
      setCrawlProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setCrawlStatus("completed")
          setExtractedData(sampleExtractedData)
          onProgressUpdate(100)
          return 100
        }
        onProgressUpdate(newProgress)
        return newProgress
      })
    }, 500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Data Ingestion & Preprocessing
          </CardTitle>
          <CardDescription>Web crawling, content extraction, and format normalization pipeline</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="crawler" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crawler">Web Crawler</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="results">Extracted Data</TabsTrigger>
        </TabsList>

        <TabsContent value="crawler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Web Crawling Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target URL</label>
                  <Input
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crawl Depth</label>
                  <Input type="number" defaultValue="3" min="1" max="10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content Types</label>
                <div className="flex flex-wrap gap-2">
                  {["HTML Pages", "PDFs", "DOCX", "XLSX", "FAQs", "Product Catalogs"].map((type) => (
                    <Badge key={type} variant="secondary" className="cursor-pointer">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={startCrawling} disabled={crawlStatus === "running"} className="flex-1">
                  {crawlStatus === "running" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Crawling...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Crawling
                    </>
                  )}
                </Button>
                {crawlStatus === "running" && (
                  <Button variant="outline" onClick={() => setCrawlStatus("idle")}>
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {crawlStatus === "running" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Crawling Progress</span>
                    <span>{Math.round(crawlProgress)}%</span>
                  </div>
                  <Progress value={crawlProgress} />
                </div>
              )}

              {crawlStatus === "completed" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Crawling completed successfully!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Extracted {extractedData.length} pages with content and metadata
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extraction Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Scrapy", desc: "Web scraping framework" },
                  { name: "BeautifulSoup", desc: "HTML parsing" },
                  { name: "Playwright", desc: "Browser automation" },
                  { name: "pdfminer", desc: "PDF text extraction" },
                ].map((tool) => (
                  <div key={tool.name} className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm">{tool.name}</h4>
                    <p className="text-xs text-gray-600">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload & Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                <p className="text-gray-600 mb-4">Support for PDF, DOCX, XLSX, TXT, and other formats</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.docx,.xlsx,.txt,.json,.xml"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Files</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        Process
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Extracted Content
              </CardTitle>
              <CardDescription>Processed and normalized data ready for NLP analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {extractedData.length > 0 ? (
                <div className="space-y-4">
                  {extractedData.map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant="outline">{item.metadata.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.content}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.entities.map((entity: string) => (
                            <Badge key={entity} variant="secondary" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{item.url}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No extracted data yet. Start crawling to see results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
