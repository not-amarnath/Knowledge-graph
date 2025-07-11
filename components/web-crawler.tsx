"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Globe, Play, Pause, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function WebCrawler() {
  const [crawlUrl, setCrawlUrl] = useState("https://example.com")
  const [crawlStatus, setCrawlStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [crawlProgress, setCrawlProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<any[]>([])

  const sampleExtractedData = [
    {
      url: "https://example.com/page1",
      title: "Example Page 1",
      content: "This is the content of example page 1.",
      entities: ["Example", "Page", "Content"],
      metadata: { type: "article" },
    },
    {
      url: "https://example.com/page2",
      title: "Example Page 2",
      content: "This is the content of example page 2.",
      entities: ["Example", "Page", "Content"],
      metadata: { type: "article" },
    },
  ]

  const startCrawling = async () => {
    setCrawlStatus("running")
    setCrawlProgress(0)

    // Simulate crawling process
    const interval = setInterval(() => {
      setCrawlProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setCrawlStatus("completed")
          setExtractedData(sampleExtractedData)
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Web Crawler
        </CardTitle>
        <CardDescription>Configure and run the web crawler to extract data from websites</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target URL</label>
          <Input value={crawlUrl} onChange={(e) => setCrawlUrl(e.target.value)} placeholder="https://example.com" />
        </div>

        <div className="flex gap-2">
          <Button onClick={startCrawling} disabled={crawlStatus === "running"}>
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

        {crawlStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Crawling failed!</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              An error occurred during crawling. Please check the URL and try again.
            </p>
          </div>
        )}

        {extractedData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Extracted Data</h4>
            {extractedData.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.content}</p>
                  <p className="text-xs text-gray-500">{item.url}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
