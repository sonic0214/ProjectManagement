// 项目数据类型定义
export interface Project {
  id: number
  name: string
  description: string
  status: string
  priority: string
  category: string
  tags: string[]
  progress: number
  startDate: string
  endDate: string
  owner: {
    name: string
    avatar: string
    role: string
    email?: string
  }
  assignees?: Array<{
    id: string
    name: string
    avatar: string
    role: string
    email?: string
  }>
  team: {
    [key: string]: {
      name: string
      avatar: string
      progress: number
      workload: string
    }
  }
  milestones: {
    [key: string]: {
      status: string
      date: string | null
      plannedDate: string
      owner: string
    }
  }
  requirements: Array<{
    id: number
    title: string
    status: string
    priority: string
    assignee: string
    progress: number
    description?: string
  }>
  dailyProgress: string
  lastUpdate: string
  risks: Array<{
    level: string
    description: string
  }>
  updates?: Array<{
    id: number
    author: string
    date: string
    content: string
    type: string
  }>
}

// 本地存储键名
const STORAGE_KEYS = {
  PROJECTS: 'project_management_projects',
  SETTINGS: 'project_management_settings',
  TEAM_MEMBERS: 'project_management_team_members'
}

// 本地存储操作类
export class LocalStorage {
  // 获取所有项目
  static getProjects(): Project[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取项目数据失败:', error)
      return []
    }
  }

  // 保存所有项目
  static saveProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    } catch (error) {
      console.error('保存项目数据失败:', error)
    }
  }

  // 获取单个项目
  static getProject(id: number): Project | null {
    const projects = this.getProjects()
    return projects.find(p => p.id === id) || null
  }

  // 添加项目
  static addProject(project: Omit<Project, 'id'>): Project {
    const projects = this.getProjects()
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1
    const newProject = { ...project, id: newId }
    projects.push(newProject)
    this.saveProjects(projects)
    return newProject
  }

  // 更新项目
  static updateProject(id: number, updates: Partial<Project>): boolean {
    const projects = this.getProjects()
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) return false
    
    projects[index] = { ...projects[index], ...updates }
    this.saveProjects(projects)
    return true
  }

  // 删除项目
  static deleteProject(id: number): boolean {
    const projects = this.getProjects()
    const filteredProjects = projects.filter(p => p.id !== id)
    if (filteredProjects.length === projects.length) return false
    
    this.saveProjects(filteredProjects)
    return true
  }

  // 获取设置
  static getSettings(): any {
    if (typeof window === 'undefined') return {}
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('获取设置数据失败:', error)
      return {}
    }
  }

  // 保存设置
  static saveSettings(settings: any): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('保存设置数据失败:', error)
    }
  }

  // 获取团队成员
  static getTeamMembers(): any[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取团队成员数据失败:', error)
      return []
    }
  }

  // 保存团队成员
  static saveTeamMembers(members: any[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members))
    } catch (error) {
      console.error('保存团队成员数据失败:', error)
    }
  }

  // 清空所有数据
  static clearAll(): void {
    if (typeof window === 'undefined') return
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('清空数据失败:', error)
    }
  }

  // 导出数据
  static exportData(): string {
    const data = {
      projects: this.getProjects(),
      settings: this.getSettings(),
      teamMembers: this.getTeamMembers(),
      exportDate: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  // 导入数据
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.projects) this.saveProjects(data.projects)
      if (data.settings) this.saveSettings(data.settings)
      if (data.teamMembers) this.saveTeamMembers(data.teamMembers)
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }
}

// 默认项目数据
export const defaultProjects: Project[] = [
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
      email: "zhangsan@company.com"
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
  }
]

// 初始化本地存储数据
export function initializeStorage(): void {
  if (typeof window === 'undefined') return
  
  // 如果没有项目数据，则使用默认数据
  const existingProjects = LocalStorage.getProjects()
  if (existingProjects.length === 0) {
    LocalStorage.saveProjects(defaultProjects)
  }
}