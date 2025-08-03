"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Plus,
  Search,
  Edit,
  Mail,
  Phone,
  Building,
  Calendar,
  Target,
  TrendingUp,
  Award
} from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { LocalStorage } from "@/lib/storage"

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  department: string
  avatar: string
  phone?: string
  joinDate: string
  skills: string[]
  currentProjects: number[]
  workload: number
  performance: number
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@company.com",
    role: "产品经理",
    department: "产品部",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "138-0000-1111",
    joinDate: "2023-01-15",
    skills: ["产品设计", "需求分析", "用户研究"],
    currentProjects: [1, 3],
    workload: 85,
    performance: 92
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@company.com",
    role: "前端开发",
    department: "技术部",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "138-0000-2222",
    joinDate: "2023-03-10",
    skills: ["React", "TypeScript", "前端架构"],
    currentProjects: [1, 2],
    workload: 90,
    performance: 88
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@company.com",
    role: "后端开发",
    department: "技术部",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "138-0000-3333",
    joinDate: "2022-11-20",
    skills: ["Node.js", "Python", "数据库设计"],
    currentProjects: [1, 2, 5],
    workload: 95,
    performance: 95
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@company.com",
    role: "数据工程师",
    department: "数据部",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "138-0000-4444",
    joinDate: "2023-05-08",
    skills: ["数据分析", "机器学习", "数据可视化"],
    currentProjects: [3],
    workload: 70,
    performance: 89
  },
  {
    id: 5,
    name: "钱七",
    email: "qianqi@company.com",
    role: "测试工程师",
    department: "质量部",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "138-0000-5555",
    joinDate: "2023-02-14",
    skills: ["自动化测试", "性能测试", "测试用例设计"],
    currentProjects: [1, 4],
    workload: 75,
    performance: 87
  }
]

export function TeamManagement() {
  const { projects } = useProjects()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    // 从本地存储加载团队成员，如果没有则使用默认数据
    const saved = LocalStorage.getTeamMembers()
    return saved.length > 0 ? saved : defaultTeamMembers
  })
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    skills: [],
    workload: 0,
    performance: 0
  })

  // 保存团队成员到本地存储
  const saveTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members)
    LocalStorage.saveTeamMembers(members)
  }

  // 筛选团队成员
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment
    const matchesRole = selectedRole === "all" || member.role === selectedRole

    return matchesSearch && matchesDepartment && matchesRole
  })

  // 获取成员参与的项目
  const getMemberProjects = (projectIds: number[]) => {
    return projects.filter(p => projectIds.includes(p.id))
  }

  // 添加新成员
  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role && newMember.department) {
      const member: TeamMember = {
        id: Math.max(0, ...teamMembers.map(m => m.id)) + 1,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        department: newMember.department,
        avatar: "/placeholder.svg?height=40&width=40",
        phone: newMember.phone || "",
        joinDate: new Date().toISOString().split('T')[0],
        skills: newMember.skills || [],
        currentProjects: [],
        workload: newMember.workload || 0,
        performance: newMember.performance || 0
      }
      
      saveTeamMembers([...teamMembers, member])
      setNewMember({})
      setShowAddDialog(false)
    }
  }

  // 编辑成员
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setNewMember(member)
  }

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingMember && newMember.name && newMember.email) {
      const updatedMembers = teamMembers.map(m => 
        m.id === editingMember.id ? { ...m, ...newMember } : m
      )
      saveTeamMembers(updatedMembers)
      setEditingMember(null)
      setNewMember({})
    }
  }

  // 删除成员
  const handleDeleteMember = (id: number) => {
    const updatedMembers = teamMembers.filter(m => m.id !== id)
    saveTeamMembers(updatedMembers)
  }

  // 获取统计数据
  const stats = {
    totalMembers: teamMembers.length,
    avgWorkload: Math.round(teamMembers.reduce((sum, m) => sum + m.workload, 0) / teamMembers.length),
    avgPerformance: Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length),
    busyMembers: teamMembers.filter(m => m.workload > 80).length
  }

  const departments = [...new Set(teamMembers.map(m => m.department))]
  const roles = [...new Set(teamMembers.map(m => m.role))]

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">团队成员总数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">活跃成员数量</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均工作量</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWorkload}%</div>
            <p className="text-xs text-muted-foreground">团队平均工作负荷</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均绩效</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPerformance}</div>
            <p className="text-xs text-muted-foreground">团队整体表现</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高负荷成员</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.busyMembers}</div>
            <p className="text-xs text-muted-foreground">工作量 > 80%</p>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索成员姓名或邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="部门筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="角色筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              添加成员
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 团队成员表格 */}
      <Card>
        <CardHeader>
          <CardTitle>团队成员</CardTitle>
          <CardDescription>管理团队成员信息和项目分配</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>成员信息</TableHead>
                <TableHead>部门/角色</TableHead>
                <TableHead>技能</TableHead>
                <TableHead>当前项目</TableHead>
                <TableHead>工作量</TableHead>
                <TableHead>绩效</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">入职: {member.joinDate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="mb-1">{member.department}</Badge>
                      <p className="text-sm">{member.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 2).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getMemberProjects(member.currentProjects).slice(0, 2).map(project => (
                        <div key={project.id} className="text-xs">
                          <Badge variant="outline" className="text-xs">
                            {project.name}
                          </Badge>
                        </div>
                      ))}
                      {member.currentProjects.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{member.currentProjects.length - 2} 个项目
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress value={member.workload} className="h-2" />
                      <span className="text-sm">{member.workload}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{member.performance}</div>
                      <div className="text-xs text-gray-500">评分</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 添加/编辑成员对话框 */}
      <Dialog open={showAddDialog || !!editingMember} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setEditingMember(null)
          setNewMember({})
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMember ? "编辑成员" : "添加新成员"}</DialogTitle>
            <DialogDescription>
              {editingMember ? "修改成员信息" : "填写新成员的基本信息"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={newMember.name || ""}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email || ""}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Input
                  id="role"
                  value={newMember.role || ""}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="如：前端开发"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">部门</Label>
                <Input
                  id="department"
                  value={newMember.department || ""}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  placeholder="如：技术部"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">电话</Label>
              <Input
                id="phone"
                value={newMember.phone || ""}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                placeholder="138-0000-0000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workload">工作量 (%)</Label>
                <Input
                  id="workload"
                  type="number"
                  min="0"
                  max="100"
                  value={newMember.workload || ""}
                  onChange={(e) => setNewMember({ ...newMember, workload: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="performance">绩效评分</Label>
                <Input
                  id="performance"
                  type="number"
                  min="0"
                  max="100"
                  value={newMember.performance || ""}
                  onChange={(e) => setNewMember({ ...newMember, performance: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false)
                setEditingMember(null)
                setNewMember({})
              }}>
                取消
              </Button>
              <Button onClick={editingMember ? handleSaveEdit : handleAddMember}>
                {editingMember ? "保存" : "添加"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}