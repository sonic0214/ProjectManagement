"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Circle,
  AlertCircle,
  MessageSquare,
  FileText,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"
import { Project } from "@/lib/storage"
import { useParams } from "next/navigation"

// 模拟项目详情数据
const projectDetail = {
  id: 1,
  name: "电商平台升级",
  description: "升级现有电商平台，增加新的支付方式和用户体验优化，提升整体系统性能和用户满意度",
  status: "技术开发",
  priority: "高",
  progress: 65,
  startDate: "2024-01-15",
  endDate: "2024-03-30",
  owner: {
    name: "张三",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "产品经理",
    email: "zhangsan@company.com",
  },
  team: [
    { name: "李四", role: "前端开发", avatar: "/placeholder.svg?height=32&width=32", email: "lisi@company.com" },
    { name: "王五", role: "后端开发", avatar: "/placeholder.svg?height=32&width=32", email: "wangwu@company.com" },
    { name: "赵六", role: "测试工程师", avatar: "/placeholder.svg?height=32&width=32", email: "zhaoliu@company.com" },
    { name: "钱七", role: "UI设计师", avatar: "/placeholder.svg?height=32&width=32", email: "qianqi@company.com" },
  ],
  milestones: [
    {
      id: 1,
      name: "PRD评审",
      status: "completed",
      date: "2024-01-20",
      description: "产品需求文档评审完成",
      owner: "张三",
    },
    {
      id: 2,
      name: "技术评审",
      status: "completed",
      date: "2024-01-25",
      description: "技术方案评审通过",
      owner: "王五",
    },
    {
      id: 3,
      name: "技术开发",
      status: "in-progress",
      date: "2024-02-01",
      description: "前后端开发进行中",
      owner: "李四",
    },
    {
      id: 4,
      name: "联调",
      status: "pending",
      date: "2024-03-01",
      description: "前后端联调测试",
      owner: "李四",
    },
    {
      id: 5,
      name: "测试",
      status: "pending",
      date: "2024-03-15",
      description: "功能测试和性能测试",
      owner: "赵六",
    },
    {
      id: 6,
      name: "上线",
      status: "pending",
      date: "2024-03-30",
      description: "生产环境部署上线",
      owner: "王五",
    },
  ],
  requirements: [
    {
      id: 1,
      title: "新增微信支付功能",
      description: "集成微信支付SDK，支持扫码支付和H5支付",
      status: "开发中",
      priority: "高",
      assignee: "王五",
    },
    {
      id: 2,
      title: "优化商品搜索功能",
      description: "提升搜索响应速度，增加智能推荐",
      status: "已完成",
      priority: "中",
      assignee: "李四",
    },
    {
      id: 3,
      title: "用户界面重构",
      description: "重新设计用户界面，提升用户体验",
      status: "设计中",
      priority: "中",
      assignee: "钱七",
    },
  ],
  updates: [
    {
      id: 1,
      author: "张三",
      date: "2024-02-15",
      content: "本周完成了支付模块的需求梳理，下周开始技术开发。",
      type: "progress",
    },
    {
      id: 2,
      author: "李四",
      date: "2024-02-14",
      content: "前端页面开发进度良好，预计本周完成主要页面开发。",
      type: "update",
    },
    {
      id: 3,
      author: "王五",
      date: "2024-02-13",
      content: "后端API开发遇到性能问题，正在优化数据库查询。",
      type: "issue",
    },
  ],
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case "in-progress":
      return <Clock className="w-5 h-5 text-blue-500" />
    case "pending":
      return <Circle className="w-5 h-5 text-gray-400" />
    default:
      return <Circle className="w-5 h-5 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "已完成":
      return "bg-green-100 text-green-800"
    case "开发中":
      return "bg-blue-100 text-blue-800"
    case "设计中":
      return "bg-purple-100 text-purple-800"
    case "测试中":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProjectDetail() {
  const params = useParams()
  const projectId = parseInt(params.id as string)
  const { getProject, addProjectUpdate } = useProjects()
  const [project, setProject] = useState<Project | null>(null)
  const [newUpdate, setNewUpdate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const projectData = getProject(projectId)
    setProject(projectData)
    setLoading(false)
  }, [projectId, getProject])

  const handleAddUpdate = () => {
    if (newUpdate.trim() && project) {
      addProjectUpdate(project.id, newUpdate.trim())
      setNewUpdate("")
      // 重新获取项目数据以更新UI
      const updatedProject = getProject(projectId)
      setProject(updatedProject)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载项目详情中...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">项目不存在</h1>
          <p className="text-gray-600 mb-4">您访问的项目可能已被删除或不存在。</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回项目列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回项目列表
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                项目设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="milestones" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="milestones">项目里程碑</TabsTrigger>
                <TabsTrigger value="requirements">需求管理</TabsTrigger>
                <TabsTrigger value="updates">项目动态</TabsTrigger>
                <TabsTrigger value="files">项目文档</TabsTrigger>
              </TabsList>

              <TabsContent value="milestones" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>项目里程碑</CardTitle>
                    <CardDescription>跟踪项目各个关键节点的完成情况</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(project.milestones).map(([key, milestone], index) => (
                      <div key={key} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(milestone.status)}
                          {index < Object.entries(project.milestones).length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{key === 'prd' ? 'PRD评审' : key === 'techReview' ? '技术评审' : key === 'development' ? '技术开发' : key === 'integration' ? '联调' : key === 'testing' ? '测试' : '上线'}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {milestone.plannedDate}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{milestone.status === 'completed' ? '已完成' : milestone.status === 'in-progress' ? '进行中' : '待开始'}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">负责人:</span>
                            <span className="font-medium">{milestone.owner}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>需求管理</CardTitle>
                        <CardDescription>管理项目相关的功能需求和任务</CardDescription>
                      </div>
                      <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        新增需求
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.requirements.map((req) => (
                      <div key={req.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{req.title}</h4>
                            <p className="text-sm text-gray-600">{req.description || '暂无描述'}</p>
                          </div>
                          <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500">优先级:</span>
                            <Badge variant={req.priority === "高" ? "destructive" : "secondary"}>{req.priority}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">负责人:</span>
                            <span className="font-medium">{req.assignee}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>项目动态</CardTitle>
                    <CardDescription>项目进展更新和重要通知</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 添加新动态 */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <Label htmlFor="update" className="text-sm font-medium">
                        添加项目更新
                      </Label>
                      <Textarea
                        id="update"
                        placeholder="输入项目进展更新..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        className="mt-2"
                      />
                      <div className="flex justify-end mt-3">
                        <Button size="sm" onClick={handleAddUpdate}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          发布更新
                        </Button>
                      </div>
                    </div>

                    {/* 历史动态 */}
                    {(project.updates || []).map((update) => (
                      <div key={update.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {update.type === "issue" && <AlertCircle className="w-5 h-5 text-red-500" />}
                            {update.type === "progress" && <Clock className="w-5 h-5 text-blue-500" />}
                            {update.type === "update" && <MessageSquare className="w-5 h-5 text-green-500" />}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{update.author}</span>
                              <span className="text-sm text-gray-500">{update.date}</span>
                            </div>
                            <p className="text-sm text-gray-700">{update.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>项目文档</CardTitle>
                    <CardDescription>项目相关的文档和资料</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>暂无项目文档</p>
                      <Button variant="outline" className="mt-4 bg-transparent">
                        上传文档
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧信息面板 */}
          <div className="space-y-6">
            {/* 项目概览 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">项目概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>整体进度</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">开始时间:</span>
                    <span>{project.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">预计完成:</span>
                    <span>{project.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">优先级:</span>
                    <Badge variant={project.priority === "高" ? "destructive" : "secondary"}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 项目负责人 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">项目负责人</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={project.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{project.owner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.owner.name}</p>
                    <p className="text-sm text-gray-500">{project.owner.role}</p>
                    <p className="text-sm text-gray-500">{project.owner.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 团队成员 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  团队成员
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(project.team).map(([role, member], index) => (
                  <div key={role} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{role === 'product' ? '产品经理' : role === 'frontend' ? '前端开发' : role === 'backend' ? '后端开发' : role === 'data' ? '数据工程师' : '测试工程师'}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
