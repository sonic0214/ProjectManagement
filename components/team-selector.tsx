"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, Plus, X, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟团队成员数据
const mockTeamMembers = [
  { id: "1", name: "张三", role: "产品经理", avatar: "/placeholder.svg?height=24&width=24", email: "zhangsan@company.com" },
  { id: "2", name: "李四", role: "前端开发", avatar: "/placeholder.svg?height=24&width=24", email: "lisi@company.com" },
  { id: "3", name: "王五", role: "后端开发", avatar: "/placeholder.svg?height=24&width=24", email: "wangwu@company.com" },
  { id: "4", name: "赵六", role: "数据工程师", avatar: "/placeholder.svg?height=24&width=24", email: "zhaoliu@company.com" },
  { id: "5", name: "钱七", role: "测试工程师", avatar: "/placeholder.svg?height=24&width=24", email: "qianqi@company.com" },
  { id: "6", name: "陈七", role: "技术经理", avatar: "/placeholder.svg?height=24&width=24", email: "chenqi@company.com" },
  { id: "7", name: "刘十一", role: "产品总监", avatar: "/placeholder.svg?height=24&width=24", email: "liushiyi@company.com" },
  { id: "8", name: "王小明", role: "架构师", avatar: "/placeholder.svg?height=24&width=24", email: "wangxiaoming@company.com" },
]

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
}

interface TeamSelectorProps {
  selectedMembers: TeamMember[]
  onMembersChange: (members: TeamMember[]) => void
  maxMembers?: number
  placeholder?: string
  className?: string
}

export function TeamSelector({
  selectedMembers,
  onMembersChange,
  maxMembers = 10,
  placeholder = "选择团队成员",
  className = ""
}: TeamSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const toggleMember = (member: TeamMember) => {
    const isSelected = selectedMembers.some(m => m.id === member.id)
    
    if (isSelected) {
      onMembersChange(selectedMembers.filter(m => m.id !== member.id))
    } else if (selectedMembers.length < maxMembers) {
      onMembersChange([...selectedMembers, member])
    }
  }

  const removeMember = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onMembersChange(selectedMembers.filter(m => m.id !== memberId))
  }

  const filteredMembers = mockTeamMembers.filter(member =>
    member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    member.role.toLowerCase().includes(searchValue.toLowerCase()) ||
    member.email.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start text-left font-normal"
          >
            {selectedMembers.length > 0 ? (
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedMembers.slice(0, 3).map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    {member.name}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={(e) => removeMember(member.id, e)}
                    />
                  </Badge>
                ))}
                {selectedMembers.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedMembers.length - 3}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
            <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput
              placeholder="搜索团队成员..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandEmpty>没有找到相关成员</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredMembers.map((member) => {
                const isSelected = selectedMembers.some(m => m.id === member.id)
                const canSelect = selectedMembers.length < maxMembers || isSelected
                
                return (
                  <CommandItem
                    key={member.id}
                    disabled={!canSelect}
                    onSelect={() => canSelect && toggleMember(member)}
                    className="flex items-center gap-2 p-2"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-sm">{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </Command>
          {selectedMembers.length > 0 && (
            <div className="border-t p-2">
              <div className="text-xs text-gray-500 mb-2">
                已选择 {selectedMembers.length}/{maxMembers} 人
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onMembersChange([])}
              >
                清空选择
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}