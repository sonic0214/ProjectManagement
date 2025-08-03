"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileText,
  Table,
  BarChart3,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileImage,
  Upload
} from "lucide-react"
import { LocalStorage } from "@/lib/storage"
import { useProjects } from "@/hooks/use-projects"

interface ExportOptions {
  projects: boolean
  teamMembers: boolean
  milestones: boolean
  requirements: boolean
  updates: boolean
  risks: boolean
}

export function DataExport() {
  const { projects } = useProjects()
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    projects: true,
    teamMembers: true,
    milestones: true,
    requirements: true,
    updates: true,
    risks: true
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [showExportDialog, setShowExportDialog] = useState(false)

  // 导出数据为JSON
  const exportToJson = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      const data: any = {}
      
      if (exportOptions.projects) {
        setExportProgress(20)
        data.projects = projects
      }
      
      if (exportOptions.teamMembers) {
        setExportProgress(40)
        data.teamMembers = LocalStorage.getTeamMembers()
      }
      
      if (exportOptions.milestones) {
        setExportProgress(60)
        data.milestones = projects.flatMap(p => 
          Object.entries(p.milestones).map(([key, milestone]) => ({
            projectId: p.id,
            projectName: p.name,
            milestoneName: key,
            ...milestone
          }))
        )
      }
      
      if (exportOptions.requirements) {
        setExportProgress(80)
        data.requirements = projects.flatMap(p => 
          p.requirements.map(req => ({
            projectId: p.id,
            projectName: p.name,
            ...req
          }))
        )
      }
      
      if (exportOptions.updates) {
        data.updates = projects.flatMap(p => 
          (p.updates || []).map(update => ({
            projectId: p.id,
            projectName: p.name,
            ...update
          }))
        )
      }
      
      if (exportOptions.risks) {
        data.risks = projects.flatMap(p => 
          p.risks.map(risk => ({
            projectId: p.id,
            projectName: p.name,
            ...risk
          }))
        )
      }
      
      setExportProgress(100)
      
      // 添加导出元数据
      data.exportInfo = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        totalProjects: projects.length,
        totalTeamMembers: LocalStorage.getTeamMembers().length
      }

      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `project-management-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setShowExportDialog(false)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  // 导出为CSV
  const exportToCsv = async () => {
    setIsExporting(true)
    
    try {
      if (exportOptions.projects) {
        const csvData = [
          ['ID', '项目名称', '描述', '状态', '优先级', '分类', '进度', '开始时间', '结束时间', '负责人', '最后更新'],
          ...projects.map(p => [
            p.id,
            p.name,
            p.description,
            p.status,
            p.priority,
            p.category,
            p.progress,
            p.startDate,
            p.endDate,
            p.owner.name,
            p.lastUpdate
          ])
        ]
        
        const csvContent = csvData.map(row => 
          row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n')
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `projects-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      
      setShowExportDialog(false)
    } catch (error) {
      console.error('CSV导出失败:', error)
      alert('CSV导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  // 导入数据
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const success = LocalStorage.importData(content)
          if (success) {
            alert('数据导入成功！请刷新页面查看更新。')
            window.location.reload()
          } else {
            alert('数据导入失败，请检查文件格式。')
          }
        } catch (error) {
          console.error('导入失败:', error)
          alert('数据导入失败，请检查文件格式。')
        }
      }
      reader.readAsText(file)
    } else {
      alert('请选择JSON格式的文件')
    }
  }

  // 获取导出统计信息
  const getExportStats = () => {
    let itemCount = 0
    if (exportOptions.projects) itemCount += projects.length
    if (exportOptions.teamMembers) itemCount += LocalStorage.getTeamMembers().length
    if (exportOptions.milestones) itemCount += projects.reduce((sum, p) => sum + Object.keys(p.milestones).length, 0)
    if (exportOptions.requirements) itemCount += projects.reduce((sum, p) => sum + p.requirements.length, 0)
    if (exportOptions.updates) itemCount += projects.reduce((sum, p) => sum + (p.updates?.length || 0), 0)
    if (exportOptions.risks) itemCount += projects.reduce((sum, p) => sum + p.risks.length, 0)
    
    return itemCount
  }

  return (
    <div className="space-y-4">
      {/* 数据导出卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            数据导出
          </CardTitle>
          <CardDescription>
            导出项目管理数据到本地文件，支持JSON和CSV格式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 当前数据统计 */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">当前数据概览</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">项目数:</span>
                  <Badge variant="secondary">{projects.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">团队成员:</span>
                  <Badge variant="secondary">{LocalStorage.getTeamMembers().length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">里程碑:</span>
                  <Badge variant="secondary">
                    {projects.reduce((sum, p) => sum + Object.keys(p.milestones).length, 0)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">需求:</span>
                  <Badge variant="secondary">
                    {projects.reduce((sum, p) => sum + p.requirements.length, 0)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 导出选项 */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">选择导出内容</h4>
              <div className="space-y-2">
                {Object.entries(exportOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setExportOptions(prev => ({ ...prev, [key]: checked as boolean }))
                      }
                    />
                    <Label htmlFor={key} className="text-sm">
                      {key === 'projects' ? '项目信息' :
                       key === 'teamMembers' ? '团队成员' :
                       key === 'milestones' ? '里程碑' :
                       key === 'requirements' ? '需求' :
                       key === 'updates' ? '项目动态' : '风险信息'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 导出操作 */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">导出操作</h4>
              <div className="space-y-2">
                <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" disabled={getExportStats() === 0}>
                      <FileText className="w-4 h-4 mr-2" />
                      导出为JSON ({getExportStats()} 项)
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>确认导出数据</DialogTitle>
                      <DialogDescription>
                        即将导出 {getExportStats()} 项数据到JSON文件
                      </DialogDescription>
                    </DialogHeader>
                    {isExporting && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>导出进度:</span>
                          <span>{exportProgress}%</span>
                        </div>
                        <Progress value={exportProgress} />
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowExportDialog(false)} disabled={isExporting}>
                        取消
                      </Button>
                      <Button onClick={exportToJson} disabled={isExporting}>
                        {isExporting ? '导出中...' : '开始导出'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={exportToCsv}
                  disabled={!exportOptions.projects || isExporting}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  导出项目为CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据导入卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            数据导入
          </CardTitle>
          <CardDescription>
            从本地JSON文件导入项目管理数据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              <div className="text-center space-y-2">
                <FileImage className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium">选择JSON文件导入</p>
                  <p className="text-xs text-gray-500">支持从本系统导出的JSON文件</p>
                </div>
                <label htmlFor="import-file" className="cursor-pointer">
                  <Button variant="outline" className="mt-2" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      选择文件
                    </span>
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">导入注意事项</p>
                  <ul className="text-yellow-700 text-xs mt-1 space-y-1">
                    <li>• 导入会覆盖现有数据，建议先导出备份</li>
                    <li>• 只支持本系统导出的JSON格式文件</li>
                    <li>• 导入后需要刷新页面查看更新</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}