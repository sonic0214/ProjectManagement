"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Users,
  Target,
  AlertTriangle,
  Edit,
  Tag,
  X,
  Download,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useProjects, useProjectFilters } from "@/hooks/use-projects"
import { Project } from "@/lib/storage"
import { TeamManagement } from "@/components/team-management"
import { DataExport } from "@/components/data-export"

// 旧的静态数据已移动到storage.ts中作为默认数据
const oldStaticProjects = [
  {
    id: 1,
    name: "电商平台升级",
    description: "升级现有电商平台，增加新的支付方式和用户体验优化，提升整体系统性能",
    status: "技术开发",
    priority: "高",
    category: "产品开发",
    tags: ["支付", "用户体验", "性能优化"],
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-03-30",
    owner: {
      name: "张三",
      avatar: "/placeholder.svg?height=24&width=24",
      role: "产品经理",
    },
    team: {
      frontend: { name: "李四", avatar: "/placeholder.svg?height=20&width=20", progress: 70, workload: "70%" },
      backend: { name: "王五", avatar: "/placeholder.svg?height=20&width=20", progress: 80, workload: "90%" },
      data: { name: "赵六", avatar: "/placeholder.svg?height=20&width=20", progress: 50, workload: "60%" },
      test: { name: "钱七", avatar: "/placeholder.svg?height=20&width=20", progress: 30, workload: "40%" },
      product: { name: "张三", avatar: "/placeholder.svg?height=20&width=20", progress: 90, workload: "80%" },
    },
    milestones: {
      prd: { status: "completed", date: "2024-01-20", plannedDate: "2024-01-18", owner: "张三" },
      techReview: { status: "completed", date: "2024-01-25", plannedDate: "2024-01-23", owner: "王五" },
      development: { status: "in-progress", date: "2024-02-01", plannedDate: "2024-02-01", owner: "李四" },
      integration: { status: "pending", date: null, plannedDate: "2024-03-01", owner: "李四" },
      testing: { status: "pending", date: null, plannedDate: "2024-03-15", owner: "钱七" },
      launch: { status: "pending", date: null, plannedDate: "2024-03-30", owner: "王五" },
    },
    requirements: [
      { id: 1, title: "微信支付集成", status: "开发中", priority: "高", assignee: "王五", progress: 60 },
      { id: 2, title: "搜索功能优化", status: "已完成", priority: "中", assignee: "李四", progress: 100 },
      { id: 3, title: "UI界面重构", status: "设计中", priority: "中", assignee: "钱七", progress: 40 },
    ],
    dailyProgress: "完成了支付模块的核心功能开发，明天开始集成测试。发现性能问题正在优化中。",
    lastUpdate: "2024-02-15",
    risks: [
      { level: "中", description: "第三方支付接口响应慢" },
      { level: "低", description: "UI设计评审延期" },
    ],
  },
  {
    id: 2,
    name: "移动端APP重构",
    description: "重构移动端应用，提升性能和用户体验，支持最新的移动端技术栈",
    status: "联调",
    priority: "中",
    category: "技术重构",
    tags: ["移动端", "性能", "重构"],
    progress: 80,
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    owner: {
      name: "陈七",
      avatar: "/placeholder.svg?height=24&width=24",
      role: "技术经理",
    },
    team: {
      frontend: { name: "孙八", avatar: "/placeholder.svg?height=20&width=20", progress: 85, workload: "100%" },
      backend: { name: "周九", avatar: "/placeholder.svg?height=20&width=20", progress: 90, workload: "80%" },
      data: { name: "吴十", avatar: "/placeholder.svg?height=20&width=20", progress: 75, workload: "50%" },
      test: { name: "郑十一", avatar: "/placeholder.svg?height=20&width=20", progress: 60, workload: "70%" },
      product: { name: "陈七", avatar: "/placeholder.svg?height=20&width=20", progress: 95, workload: "60%" },
    },
    milestones: {
      prd: { status: "completed", date: "2024-02-05", plannedDate: "2024-02-03", owner: "陈七" },
      techReview: { status: "completed", date: "2024-02-10", plannedDate: "2024-02-08", owner: "周九" },
      development: { status: "completed", date: "2024-03-01", plannedDate: "2024-02-28", owner: "孙八" },
      integration: { status: "in-progress", date: "2024-03-20", plannedDate: "2024-03-18", owner: "孙八" },
      testing: { status: "pending", date: null, plannedDate: "2024-04-01", owner: "郑十一" },
      launch: { status: "pending", date: null, plannedDate: "2024-04-15", owner: "周九" },
    },
    requirements: [
      { id: 1, title: "iOS适配优化", status: "联调中", priority: "高", assignee: "孙八", progress: 80 },
      { id: 2, title: "Android性能优化", status: "已完成", priority: "高", assignee: "孙八", progress: 100 },
      { id: 3, title: "API接口联调", status: "进行中", priority: "中", assignee: "周九", progress: 70 },
    ],
    dailyProgress: "前后端联调进展顺利，发现2个接口问题已修复，iOS端适配基本完成。",
    lastUpdate: "2024-02-14",
    risks: [{ level: "低", description: "iOS审核可能延期" }],
  },
  {
    id: 3,
    name: "数据分析平台",
    description: "构建企业级数据分析平台，支持实时数据处理和可视化展示，提供多维度数据分析能力",
    status: "PRD评审",
    priority: "高",
    category: "数据平台",
    tags: ["数据分析", "可视化", "实时处理"],
    progress: 15,
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    owner: {
      name: "刘十一",
      avatar: "/placeholder.svg?height=24&width=24",
      role: "产品总监",
    },
    team: {
      frontend: { name: "郑十二", avatar: "/placeholder.svg?height=20&width=20", progress: 10, workload: "30%" },
      backend: { name: "钱十三", avatar: "/placeholder.svg?height=20&width=20", progress: 20, workload: "70%" },
      data: { name: "孙十四", avatar: "/placeholder.svg?height=20&width=20", progress: 30, workload: "90%" },
      test: { name: "李十五", avatar: "/placeholder.svg?height=20&width=20", progress: 5, workload: "20%" },
      product: { name: "刘十一", avatar: "/placeholder.svg?height=20&width=20", progress: 40, workload: "80%" },
    },
    milestones: {
      prd: { status: "in-progress", date: null, plannedDate: "2024-03-10", owner: "刘十一" },
      techReview: { status: "pending", date: null, plannedDate: "2024-03-20", owner: "钱十三" },
      development: { status: "pending", date: null, plannedDate: "2024-04-01", owner: "郑十二" },
      integration: { status: "pending", date: null, plannedDate: "2024-05-15", owner: "郑十二" },
      testing: { status: "pending", date: null, plannedDate: "2024-06-01", owner: "李十五" },
      launch: { status: "pending", date: null, plannedDate: "2024-06-30", owner: "钱十三" },
    },
    requirements: [
      { id: 1, title: "数据源接入设计", status: "设计中", priority: "高", assignee: "孙十四", progress: 30 },
      { id: 2, title: "可视化组件库", status: "调研中", priority: "中", assignee: "郑十二", progress: 20 },
      { id: 3, title: "权限管理系统", status: "待开始", priority: "中", assignee: "钱十三", progress: 0 },
    ],
    dailyProgress: "PRD文档编写中，预计本周完成初稿。正在调研相关技术方案。",
    lastUpdate: "2024-02-13",
    risks: [
      { level: "高", description: "数据源接入复杂度超预期" },
      { level: "中", description: "技术选型需要更多时间" },
    ],
  },
  {
    id: 4,
    name: "用户权限系统重构",
    description: "重构现有用户权限管理系统，支持更细粒度的权限控制和角色管理",
    status: "测试",
    priority: "中",
    category: "系统优化",
    tags: ["权限管理", "系统重构", "安全"],
    progress: 90,
    startDate: "2024-01-01",
    endDate: "2024-02-28",
    owner: {
      name: "王小明",
      avatar: "/placeholder.svg?height=24&width=24",
      role: "产品经理",
    },
    team: {
      frontend: { name: "张小红", avatar: "/placeholder.svg?height=20&width=20", progress: 95, workload: "60%" },
      backend: { name: "李小绿", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "80%" },
      data: { name: "赵小蓝", avatar: "/placeholder.svg?height=20&width=20", progress: 85, workload: "40%" },
      test: { name: "钱小黄", avatar: "/placeholder.svg?height=20&width=20", progress: 80, workload: "90%" },
      product: { name: "王小明", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "50%" },
    },
    milestones: {
      prd: { status: "completed", date: "2024-01-05", plannedDate: "2024-01-03", owner: "王小明" },
      techReview: { status: "completed", date: "2024-01-10", plannedDate: "2024-01-08", owner: "李小绿" },
      development: { status: "completed", date: "2024-02-01", plannedDate: "2024-01-30", owner: "张小红" },
      integration: { status: "completed", date: "2024-02-10", plannedDate: "2024-02-08", owner: "张小红" },
      testing: { status: "in-progress", date: "2024-02-15", plannedDate: "2024-02-12", owner: "钱小黄" },
      launch: { status: "pending", date: null, plannedDate: "2024-02-28", owner: "李小绿" },
    },
    requirements: [
      { id: 1, title: "角色权限管理", status: "已完成", priority: "高", assignee: "李小绿", progress: 100 },
      { id: 2, title: "用户组管理", status: "测试中", priority: "高", assignee: "张小红", progress: 90 },
      { id: 3, title: "权限继承机制", status: "测试中", priority: "中", assignee: "李小绿", progress: 85 },
    ],
    dailyProgress: "功能测试基本完成，性能测试进行中。发现一个权限继承的边界问题正在修复。",
    lastUpdate: "2024-02-16",
    risks: [],
  },
  {
    id: 5,
    name: "API网关性能优化",
    description: "优化API网关的性能和稳定性，提升系统整体响应速度和并发处理能力",
    status: "上线",
    priority: "低",
    category: "基础设施",
    tags: ["API网关", "性能优化", "基础设施"],
    progress: 100,
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    owner: {
      name: "陈大华",
      avatar: "/placeholder.svg?height=24&width=24",
      role: "架构师",
    },
    team: {
      frontend: { name: "林小芳", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "30%" },
      backend: { name: "黄小强", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "100%" },
      data: { name: "吴小丽", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "60%" },
      test: { name: "郑小伟", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "70%" },
      product: { name: "陈大华", avatar: "/placeholder.svg?height=20&width=20", progress: 100, workload: "40%" },
    },
    milestones: {
      prd: { status: "completed", date: "2023-12-05", plannedDate: "2023-12-03", owner: "陈大华" },
      techReview: { status: "completed", date: "2023-12-10", plannedDate: "2023-12-08", owner: "黄小强" },
      development: { status: "completed", date: "2024-01-01", plannedDate: "2023-12-30", owner: "黄小强" },
      integration: { status: "completed", date: "2024-01-10", plannedDate: "2024-01-08", owner: "黄小强" },
      testing: { status: "completed", date: "2024-01-20", plannedDate: "2024-01-18", owner: "郑小伟" },
      launch: { status: "completed", date: "2024-01-31", plannedDate: "2024-01-31", owner: "黄小强" },
    },
    requirements: [
      { id: 1, title: "缓存机制优化", status: "已完成", priority: "高", assignee: "黄小强", progress: 100 },
      { id: 2, title: "负载均衡优化", status: "已完成", priority: "高", assignee: "黄小强", progress: 100 },
      { id: 3, title: "监控告警完善", status: "已完成", priority: "中", assignee: "吴小丽", progress: 100 },
    ],
    dailyProgress: "项目已成功上线，运行稳定。性能提升明显，响应时间减少40%。",
    lastUpdate: "2024-01-31",
    risks: [],
  },
]

// 所有可用的标签和分类
const availableTags = [
  "支付",
  "用户体验",
  "性能优化",
  "移动端",
  "重构",
  "数据分析",
  "可视化",
  "实时处理",
  "权限管理",
  "安全",
  "API网关",
  "基础设施",
]
const availableCategories = ["产品开发", "技术重构", "数据平台", "系统优化", "基础设施"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "PRD评审":
      return "bg-blue-100 text-blue-800"
    case "技术评审":
      return "bg-purple-100 text-purple-800"
    case "技术开发":
      return "bg-orange-100 text-orange-800"
    case "联调":
      return "bg-yellow-100 text-yellow-800"
    case "测试":
      return "bg-green-100 text-green-800"
    case "上线":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "高":
      return "bg-red-100 text-red-800"
    case "中":
      return "bg-yellow-100 text-yellow-800"
    case "低":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRiskColor = (level: string) => {
  switch (level) {
    case "高":
      return "text-red-600"
    case "中":
      return "text-yellow-600"
    case "低":
      return "text-green-600"
    default:
      return "text-gray-600"
  }
}

const getMilestoneIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "✅"
    case "in-progress":
      return "🔄"
    case "pending":
      return "⏳"
    default:
      return "⏳"
  }
}

export default function ProjectManagement() {
  // 使用数据管理hooks
  const {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    addProjectUpdate,
    updateProjectProgress
  } = useProjects()
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    tagFilter,
    setTagFilter,
    filteredProjects
  } = useProjectFilters(projects)

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [dailyUpdate, setDailyUpdate] = useState("")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editForm, setEditForm] = useState<Partial<Project>>({})
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)

  // 过滤逻辑现在在useProjectFilters hook中处理

  const toggleRowExpansion = (projectId: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
    } else {
      newExpanded.add(projectId)
    }
    setExpandedRows(newExpanded)
  }

  const handleDailyUpdate = (projectId: number) => {
    if (dailyUpdate.trim()) {
      addProjectUpdate(projectId, dailyUpdate.trim())
      setDailyUpdate("")
      setSelectedProject(null)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      category: project.category,
      tags: [...project.tags],
      startDate: project.startDate,
      endDate: project.endDate,
    })
  }

  const handleSaveEdit = () => {
    if (editingProject && editForm) {
      updateProject(editingProject.id, editForm)
      setEditingProject(null)
      setEditForm({})
    }
  }

  const addTag = (tag: string) => {
    if (editForm.tags && !editForm.tags.includes(tag)) {
      setEditForm({ ...editForm, tags: [...editForm.tags, tag] })
    }
  }

  const removeTag = (tag: string) => {
    if (editForm.tags) {
      setEditForm({ ...editForm, tags: editForm.tags.filter((t: string) => t !== tag) })
    }
  }

  // 新建项目函数
  const handleCreateProject = () => {
    const newProject = {
      name: "新项目",
      description: "请编辑项目描述",
      status: "PRD评审",
      priority: "中",
      category: "产品开发",
      tags: [],
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: {
        name: "当前用户",
        avatar: "/placeholder.svg?height=24&width=24",
        role: "项目经理",
        email: "user@company.com"
      },
      team: {},
      milestones: {
        prd: { status: "pending", date: null, plannedDate: new Date().toISOString().split('T')[0], owner: "当前用户" },
        techReview: { status: "pending", date: null, plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], owner: "当前用户" },
        development: { status: "pending", date: null, plannedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], owner: "当前用户" },
        integration: { status: "pending", date: null, plannedDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], owner: "当前用户" },
        testing: { status: "pending", date: null, plannedDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], owner: "当前用户" },
        launch: { status: "pending", date: null, plannedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], owner: "当前用户" },
      },
      requirements: [],
      dailyProgress: "项目刚刚创建",
      lastUpdate: new Date().toISOString().split('T')[0],
      risks: [],
      updates: []
    }
    
    const createdProject = addProject(newProject)
    setShowNewProjectDialog(false)
    handleEditProject(createdProject)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载项目数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">项目管理中心</h1>
              <p className="text-gray-600 text-sm">PMO项目进度跟踪与需求管理平台</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                新建项目
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">项目列表</TabsTrigger>
            <TabsTrigger value="dashboard">数据看板</TabsTrigger>
            <TabsTrigger value="team">团队管理</TabsTrigger>
            <TabsTrigger value="export">数据管理</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            {/* 筛选和搜索 */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="搜索项目名称或描述..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="项目分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="w-[150px] h-9">
                      <Tag className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="标签筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部标签</SelectItem>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="状态筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="PRD评审">PRD评审</SelectItem>
                      <SelectItem value="技术评审">技术评审</SelectItem>
                      <SelectItem value="技术开发">技术开发</SelectItem>
                      <SelectItem value="联调">联调</SelectItem>
                      <SelectItem value="测试">测试</SelectItem>
                      <SelectItem value="上线">上线</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="优先级筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部优先级</SelectItem>
                      <SelectItem value="高">高优先级</SelectItem>
                      <SelectItem value="中">中优先级</SelectItem>
                      <SelectItem value="低">低优先级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 多维表格 */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-8"></TableHead>
                        <TableHead className="min-w-[200px]">项目信息</TableHead>
                        <TableHead className="w-[100px]">分类</TableHead>
                        <TableHead className="min-w-[150px]">标签</TableHead>
                        <TableHead className="w-[100px]">状态</TableHead>
                        <TableHead className="min-w-[300px]">每日进展</TableHead>
                        <TableHead className="w-[80px]">优先级</TableHead>
                        <TableHead className="w-[100px]">进度</TableHead>
                        <TableHead className="w-[120px]">项目负责人</TableHead>
                        <TableHead className="min-w-[250px]">关键节点</TableHead>
                        <TableHead className="w-[120px]">时间周期</TableHead>
                        <TableHead className="w-[100px]">风险</TableHead>
                        <TableHead className="w-[120px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <>
                          <TableRow key={project.id} className="hover:bg-gray-50">
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleRowExpansion(project.id)}
                              >
                                {expandedRows.has(project.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Link
                                  href={`/project/${project.id}`}
                                  className="font-medium text-sm hover:text-blue-600"
                                >
                                  {project.name}
                                </Link>
                                <p className="text-xs text-gray-600 line-clamp-2">{project.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {project.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {project.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                                    {tag}
                                  </Badge>
                                ))}
                                {project.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                    +{project.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(project.status)} text-xs`}>{project.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-xs text-gray-700 line-clamp-2 max-w-[280px]">
                                  {project.dailyProgress}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>更新: {project.lastUpdate}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getPriorityColor(project.priority)} text-xs`}>
                                {project.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Progress value={project.progress} className="h-2" />
                                <span className="text-xs text-gray-600">{project.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" className="h-auto p-1 hover:bg-gray-100">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={project.owner.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="text-xs">{project.owner.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="text-left">
                                        <div className="text-xs font-medium">{project.owner.name}</div>
                                        <div className="text-xs text-gray-500">{project.owner.role}</div>
                                      </div>
                                      <Users className="w-3 h-3 text-gray-400" />
                                    </div>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80" align="start">
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-sm">团队分工详情</h4>
                                    <div className="space-y-2">
                                      {Object.entries(project.team).map(([role, member]) => (
                                        <div
                                          key={role}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                              <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="text-xs font-medium">{member.name}</div>
                                              <div className="text-xs text-gray-500">
                                                {role === "product"
                                                  ? "产品经理"
                                                  : role === "frontend"
                                                    ? "前端开发"
                                                    : role === "backend"
                                                      ? "后端开发"
                                                      : role === "data"
                                                        ? "数据工程师"
                                                        : "测试工程师"}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-xs font-medium">{member.progress}%</div>
                                            <div className="text-xs text-gray-500">工作量: {member.workload}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell>
                              <div className="grid grid-cols-3 gap-1 text-xs">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <span>{getMilestoneIcon(project.milestones.prd.status)}</span>
                                    <span>PRD</span>
                                  </div>
                                  <div className="text-gray-500">{project.milestones.prd.plannedDate}</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <span>{getMilestoneIcon(project.milestones.development.status)}</span>
                                    <span>开发</span>
                                  </div>
                                  <div className="text-gray-500">{project.milestones.development.plannedDate}</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <span>{getMilestoneIcon(project.milestones.launch.status)}</span>
                                    <span>上线</span>
                                  </div>
                                  <div className="text-gray-500">{project.milestones.launch.plannedDate}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>开始</span>
                                </div>
                                <div className="text-gray-600">{project.startDate}</div>
                                <div className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  <span>结束</span>
                                </div>
                                <div className="text-gray-600">{project.endDate}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {project.risks.length > 0 ? (
                                  project.risks.map((risk, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                      <AlertTriangle className={`w-3 h-3 ${getRiskColor(risk.level)}`} />
                                      <span className={`text-xs ${getRiskColor(risk.level)}`}>{risk.level}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-green-600">无风险</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 px-2 bg-transparent"
                                      onClick={() => setSelectedProject(project)}
                                    >
                                      <MessageSquare className="w-3 h-3 mr-1" />
                                      日报
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>更新每日进度</DialogTitle>
                                      <DialogDescription>项目: {project.name}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="progress">昨日进展</Label>
                                        <div className="p-2 bg-gray-50 rounded text-sm max-h-20 overflow-y-auto">
                                          {project.dailyProgress}
                                        </div>
                                        <div className="text-xs text-gray-500">最后更新: {project.lastUpdate}</div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="update">今日进展</Label>
                                        <Textarea
                                          id="update"
                                          placeholder="输入今日工作进展..."
                                          value={dailyUpdate}
                                          onChange={(e) => setDailyUpdate(e.target.value)}
                                          className="min-h-[80px]"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setDailyUpdate("")
                                            setSelectedProject(null)
                                          }}
                                        >
                                          取消
                                        </Button>
                                        <Button size="sm" onClick={() => handleDailyUpdate(project.id)}>
                                          更新
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 bg-transparent"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  编辑
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* 展开的详细信息 */}
                          {expandedRows.has(project.id) && (
                            <TableRow>
                              <TableCell colSpan={13} className="bg-gray-50 p-0">
                                <Collapsible open={expandedRows.has(project.id)}>
                                  <CollapsibleContent>
                                    <div className="p-4 space-y-4">
                                      {/* 详细里程碑 */}
                                      <div>
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                          <Target className="w-4 h-4" />
                                          详细里程碑
                                        </h4>
                                        <div className="grid grid-cols-6 gap-3">
                                          {Object.entries(project.milestones).map(([key, milestone]) => {
                                            const milestoneNames = {
                                              prd: "PRD评审",
                                              techReview: "技术评审",
                                              development: "技术开发",
                                              integration: "联调",
                                              testing: "测试",
                                              launch: "上线",
                                            }
                                            return (
                                              <div key={key} className="bg-white p-2 rounded border">
                                                <div className="flex items-center gap-1 mb-1">
                                                  <span>{getMilestoneIcon(milestone.status)}</span>
                                                  <span className="text-xs font-medium">
                                                    {milestoneNames[key as keyof typeof milestoneNames]}
                                                  </span>
                                                </div>
                                                <div className="text-xs text-gray-600 space-y-1">
                                                  <div>计划: {milestone.plannedDate}</div>
                                                  {milestone.date && <div>实际: {milestone.date}</div>}
                                                  <div>负责: {milestone.owner}</div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>

                                      {/* 需求列表 */}
                                      <div>
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                          <Users className="w-4 h-4" />
                                          需求列表
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                          {project.requirements.map((req) => (
                                            <div key={req.id} className="bg-white p-3 rounded border">
                                              <div className="flex items-start justify-between mb-2">
                                                <h5 className="text-xs font-medium">{req.title}</h5>
                                                <Badge className={`${getStatusColor(req.status)} text-xs`}>
                                                  {req.status}
                                                </Badge>
                                              </div>
                                              <div className="space-y-1 text-xs text-gray-600">
                                                <div className="flex justify-between">
                                                  <span>优先级:</span>
                                                  <Badge className={`${getPriorityColor(req.priority)} text-xs`}>
                                                    {req.priority}
                                                  </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>负责人:</span>
                                                  <span>{req.assignee}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>进度:</span>
                                                  <span>{req.progress}%</span>
                                                </div>
                                                <Progress value={req.progress} className="h-1 mt-1" />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* 风险详情 */}
                                      {project.risks.length > 0 && (
                                        <div>
                                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            风险详情
                                          </h4>
                                          <div className="space-y-2">
                                            {project.risks.map((risk, index) => (
                                              <div
                                                key={index}
                                                className="bg-white p-2 rounded border flex items-center gap-2"
                                              >
                                                <AlertTriangle className={`w-4 h-4 ${getRiskColor(risk.level)}`} />
                                                <span className={`text-xs font-medium ${getRiskColor(risk.level)}`}>
                                                  {risk.level}风险:
                                                </span>
                                                <span className="text-xs text-gray-700">{risk.description}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总项目数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">+2 较上月</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">进行中项目</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects.filter((p) => !["上线", "已完成"].includes(p.status)).length}
                  </div>
                  <p className="text-xs text-muted-foreground">活跃项目数量</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">高优先级项目</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.filter((p) => p.priority === "高").length}</div>
                  <p className="text-xs text-muted-foreground">需重点关注</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">平均进度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">整体项目进度</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <DataExport />
          </TabsContent>
        </Tabs>
      </div>

      {/* 项目编辑对话框 */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
            <DialogDescription>修改项目的基本信息和设置</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">项目名称</Label>
                  <Input
                    id="name"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">项目分类</Label>
                  <Select
                    value={editForm.category || ""}
                    onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">项目描述</Label>
                <Textarea
                  id="description"
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">项目状态</Label>
                  <Select
                    value={editForm.status || ""}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRD评审">PRD评审</SelectItem>
                      <SelectItem value="技术评审">技术评审</SelectItem>
                      <SelectItem value="技术开发">技术开发</SelectItem>
                      <SelectItem value="联调">联调</SelectItem>
                      <SelectItem value="测试">测试</SelectItem>
                      <SelectItem value="上线">上线</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">优先级</Label>
                  <Select
                    value={editForm.priority || ""}
                    onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="高">高</SelectItem>
                      <SelectItem value="中">中</SelectItem>
                      <SelectItem value="低">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>快速添加标签</Label>
                  <Select onValueChange={addTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择标签" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags
                        .filter((tag) => !editForm.tags?.includes(tag))
                        .map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>项目标签</Label>
                <div className="flex flex-wrap gap-2">
                  {editForm.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">开始时间</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editForm.startDate || ""}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">结束时间</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editForm.endDate || ""}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProject(null)}>
                  取消
                </Button>
                <Button onClick={handleSaveEdit}>保存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
