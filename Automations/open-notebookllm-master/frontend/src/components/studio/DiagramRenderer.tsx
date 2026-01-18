import { useRef, useState, useCallback } from 'react'
import { DrawIoEmbed, DrawIoEmbedRef, EventExport } from 'react-drawio'
import { Download, Copy, Check, Edit3, Eye, Maximize2 } from 'lucide-react'
import type { DiagramData } from '../../types'

interface DiagramRendererProps {
  data: DiagramData
  onUpdate?: (xml: string) => void
}

export default function DiagramRenderer({ data, onUpdate }: DiagramRendererProps) {
  const drawioRef = useRef<DrawIoEmbedRef>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [exportedSvg, setExportedSvg] = useState<string | null>(null)

  // Get diagram type label.
  const getTypeLabel = () => {
    if (data.type === 'flowchart') return 'Flowchart'
    const typeLabels: Record<string, string> = {
      architecture: 'Architecture',
      sequence: 'Sequence',
      class: 'Class',
      er: 'ER Diagram',
      network: 'Network',
      auto: 'System'
    }
    return typeLabels[data.diagram_type || 'auto'] || 'Architecture'
  }

  // Handle export events.
  const handleExport = useCallback((exportData: EventExport) => {
    if (exportData.format === 'svg') {
      setExportedSvg(exportData.data)
    }
  }, [])

  // Copy XML.
  const handleCopyXml = () => {
    if (data.xml) {
      navigator.clipboard.writeText(data.xml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download SVG.
  const handleDownloadSvg = () => {
    if (drawioRef.current) {
      drawioRef.current.exportDiagram({
        format: 'svg'
      })
    }
  }

  // Download PNG (kept for fallback).
  const _handleDownloadPng = () => {
    if (drawioRef.current) {
      drawioRef.current.exportDiagram({
        format: 'png'
      })
    }
  }
  // Avoid unused variable warning.
  void _handleDownloadPng

  // Handle download after SVG export.
  const downloadExportedSvg = useCallback(() => {
    if (exportedSvg) {
      const blob = new Blob([exportedSvg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.title || 'diagram'}-${Date.now()}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportedSvg(null)
    }
  }, [exportedSvg, data.title])

  // Download when export completes.
  if (exportedSvg) {
    downloadExportedSvg()
  }

  // Toggle edit mode.
  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  // Toggle fullscreen.
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // If no XML, show error.
  if (!data.xml) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Unable to display diagram</p>
        <p className="text-sm mt-1">Missing XML data</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            {getTypeLabel()}
          </span>
          {data.title && (
            <span className="text-sm font-medium text-gray-700">{data.title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEditMode}
            className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
              isEditing
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-200'
            }`}
            title={isEditing ? 'View mode' : 'Edit mode'}
          >
            {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'View' : 'Edit'}</span>
          </button>
          <button
            onClick={handleCopyXml}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors"
            title="Copy XML"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'XML'}</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors"
            title="Download SVG"
          >
            <Download className="w-4 h-4" />
            <span>SVG</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Diagram description */}
      {data.description && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          {data.description}
        </p>
      )}

      {/* Draw.io embed */}
      <div
        className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${
          isFullscreen ? 'flex-1' : ''
        }`}
        style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}
      >
        <DrawIoEmbed
          ref={drawioRef}
          xml={data.xml}
          configuration={{
            defaultFonts: ['Noto Sans TC', 'Microsoft JhengHei', 'sans-serif'],
          }}
          urlParameters={{
            ui: 'min',
            spin: true,
            libraries: true,
            saveAndExit: false,
            noSaveBtn: !isEditing,
            noExitBtn: true,
          }}
          onExport={handleExport}
          onSave={(saveData) => {
            if (onUpdate && saveData.xml) {
              onUpdate(saveData.xml)
            }
          }}
        />
      </div>

      {/* Diagram elements (if available) */}
      {data.elements && data.elements.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Diagram elements</h5>
          <div className="flex flex-wrap gap-2">
            {data.elements.slice(0, 10).map((element, index) => (
              <span
                key={element.id || index}
                className={`px-2 py-1 text-xs rounded ${
                  element.type === 'node'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {element.label || element.id}
              </span>
            ))}
            {data.elements.length > 10 && (
              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                +{data.elements.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
