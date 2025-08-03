import { useState, useEffect } from 'react'
import { LocalStorage, Project, initializeStorage } from '@/lib/storage'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // 初始化数据
  useEffect(() => {
    initializeStorage()
    const storedProjects = LocalStorage.getProjects()
    setProjects(storedProjects)
    setLoading(false)
  }, [])

  // 添加项目
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = LocalStorage.addProject(project)
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  // 更新项目
  const updateProject = (id: number, updates: Partial<Project>) => {
    const success = LocalStorage.updateProject(id, updates)
    if (success) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    }
    return success
  }

  // 删除项目
  const deleteProject = (id: number) => {
    const success = LocalStorage.deleteProject(id)
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== id))
    }
    return success
  }

  // 获取单个项目
  const getProject = (id: number) => {
    return projects.find(p => p.id === id) || null
  }

  // 更新项目进度
  const updateProjectProgress = (id: number, progress: number) => {
    return updateProject(id, { progress, lastUpdate: new Date().toISOString().split('T')[0] })
  }

  // 添加项目更新
  const addProjectUpdate = (id: number, update: string, author: string = "用户") => {
    const project = getProject(id)
    if (!project) return false

    const newUpdate = {
      id: Date.now(),
      author,
      date: new Date().toISOString().split('T')[0],
      content: update,
      type: 'update'
    }

    const updates = project.updates || []
    updates.unshift(newUpdate)

    return updateProject(id, { 
      updates,
      dailyProgress: update,
      lastUpdate: new Date().toISOString().split('T')[0]
    })
  }

  // 更新里程碑状态
  const updateMilestone = (projectId: number, milestoneKey: string, status: string, date?: string) => {
    const project = getProject(projectId)
    if (!project) return false

    const milestones = { ...project.milestones }
    milestones[milestoneKey] = {
      ...milestones[milestoneKey],
      status,
      date: date || new Date().toISOString().split('T')[0]
    }

    return updateProject(projectId, { milestones })
  }

  // 添加需求
  const addRequirement = (projectId: number, requirement: Omit<Project['requirements'][0], 'id'>) => {
    const project = getProject(projectId)
    if (!project) return false

    const requirements = [...project.requirements]
    const newId = Math.max(0, ...requirements.map(r => r.id)) + 1
    requirements.push({ ...requirement, id: newId })

    return updateProject(projectId, { requirements })
  }

  // 更新需求
  const updateRequirement = (projectId: number, requirementId: number, updates: Partial<Project['requirements'][0]>) => {
    const project = getProject(projectId)
    if (!project) return false

    const requirements = project.requirements.map(r => 
      r.id === requirementId ? { ...r, ...updates } : r
    )

    return updateProject(projectId, { requirements })
  }

  // 添加风险
  const addRisk = (projectId: number, risk: { level: string; description: string }) => {
    const project = getProject(projectId)
    if (!project) return false

    const risks = [...project.risks, risk]
    return updateProject(projectId, { risks })
  }

  // 移除风险
  const removeRisk = (projectId: number, riskIndex: number) => {
    const project = getProject(projectId)
    if (!project) return false

    const risks = project.risks.filter((_, index) => index !== riskIndex)
    return updateProject(projectId, { risks })
  }

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    updateProjectProgress,
    addProjectUpdate,
    updateMilestone,
    addRequirement,
    updateRequirement,
    addRisk,
    removeRisk
  }
}

// 筛选和搜索相关的hook
export function useProjectFilters(projects: Project[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    const matchesTag = tagFilter === "all" || project.tags.includes(tagFilter)

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTag
  })

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setCategoryFilter("all")
    setTagFilter("all")
  }

  return {
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
    filteredProjects,
    resetFilters
  }
}