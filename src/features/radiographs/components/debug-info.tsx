// src/features/radiographs/components/debug-info.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/shadcn/collapsible'
import { Badge } from '@/components/ui/shadcn/badge'
import { ChevronDown, ChevronRight, Copy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { apiUrl } from '@/types/environment'

interface DebugInfoProps {
  error?: Error | null
  file?: File | null
  patientName?: string
}

export function DebugInfo({ error, file, patientName }: DebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const debugData = {
    timestamp: new Date().toISOString(),
    environment: {
      apiUrl: apiUrl,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
    },
    file: file ? {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    } : null,
    patientName,
    error: error ? {
      message: error.message,
      name: error.name,
      stack: error.stack,
    } : null,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
    toast({
      title: 'Debug info copied',
      description: 'Debug information has been copied to clipboard',
    })
  }

  if (!error && import.meta.env.PROD) {
    return null
  }

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">
            <CardTitle className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Debug Information
              {error && <Badge variant="destructive" className="ml-auto">Error</Badge>}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Use this information when reporting issues to support
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-7 px-2"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border overflow-auto max-h-60">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
