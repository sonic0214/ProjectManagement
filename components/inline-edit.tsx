"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Edit } from "lucide-react"

interface InlineEditProps {
  value: string | string[]
  type: "text" | "textarea" | "select" | "tags"
  options?: string[] | { value: string; label: string }[]
  onSave: (value: string | string[]) => void
  className?: string
  placeholder?: string
  allowEmpty?: boolean
  maxLength?: number
  variant?: "default" | "status" | "priority"
  getDisplayColor?: (value: string) => string
  autoSaveOnBlur?: boolean
  showSaveButtons?: boolean
}

export function InlineEdit({
  value,
  type,
  options = [],
  onSave,
  className = "",
  placeholder = "点击编辑",
  allowEmpty = true,
  maxLength,
  variant = "default",
  getDisplayColor,
  autoSaveOnBlur = false,
  showSaveButtons = true
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && type === "text" && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    } else if (isEditing && type === "textarea" && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing, type])

  const handleSave = () => {
    if (!allowEmpty && (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0))) {
      return
    }
    onSave(currentValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setCurrentValue(value)
    setIsEditing(false)
  }

  const handleBlur = () => {
    if (autoSaveOnBlur) {
      handleSave()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const addTag = (tag: string) => {
    if (Array.isArray(currentValue) && !currentValue.includes(tag)) {
      setCurrentValue([...currentValue, tag])
    }
  }

  const removeTag = (tag: string) => {
    if (Array.isArray(currentValue)) {
      setCurrentValue(currentValue.filter(t => t !== tag))
    }
  }

  if (!isEditing) {
    return (
      <div
        className={`group inline-edit-display cursor-pointer hover:bg-blue-50 hover:border-blue-200 p-2 rounded border border-transparent transition-all duration-200 ${className}`}
        onClick={() => setIsEditing(true)}
      >
        {type === "tags" && Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 text-sm">{placeholder}</span>
            )}
            <Edit className="w-3 h-3 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : variant === "status" || variant === "priority" ? (
          <div className="flex items-center gap-1 group">
            <Badge className={`${getDisplayColor?.(value as string) || ""} text-xs`}>
              {value || placeholder}
            </Badge>
            <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="flex items-center gap-1 group">
            <span className={value ? "" : "text-gray-400"}>
              {value || placeholder}
            </span>
            <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`inline-edit-input border-2 border-blue-300 rounded-md bg-blue-50 p-1 shadow-sm ${className}`}>
      {type === "text" && (
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            value={currentValue as string}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="h-8 text-sm"
            maxLength={maxLength}
          />
          {showSaveButtons && (
            <>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSave}>
                <Check className="w-3 h-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
                <X className="w-3 h-3 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}
      
      {type === "textarea" && (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={currentValue as string}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="min-h-[60px] text-sm"
            maxLength={maxLength}
          />
          {showSaveButtons && (
            <div className="flex justify-end gap-1">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
            </div>
          )}
        </div>
      )}
      
      {type === "select" && (
        <div className="flex items-center gap-1">
          <Select
            value={currentValue as string}
            onValueChange={(newValue) => {
              setCurrentValue(newValue)
              onSave(newValue)
              setIsEditing(false)
            }}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => {
                const optionValue = typeof option === "string" ? option : option.value
                const optionLabel = typeof option === "string" ? option : option.label
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
            <X className="w-3 h-3 text-red-600" />
          </Button>
        </div>
      )}
      
      {type === "tags" && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {Array.isArray(currentValue) && currentValue.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
          <Select onValueChange={addTag}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="添加标签" />
            </SelectTrigger>
            <SelectContent>
              {options
                .filter(option => {
                  const optionValue = typeof option === "string" ? option : option.value
                  return !Array.isArray(currentValue) || !currentValue.includes(optionValue)
                })
                .map((option) => {
                  const optionValue = typeof option === "string" ? option : option.value
                  const optionLabel = typeof option === "string" ? option : option.label
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  )
                })}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-1">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}