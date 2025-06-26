"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronDown, Search, User } from "lucide-react"
import { fetchUsers, updateUserRole, updateUserStatus, updateUser } from "@/lib/admin-api"
import { useToast } from "@/components/ui/use-toast"
import { RoleSelector } from "@/components/admin/role-selector"
import type { UserData } from "@/lib/types"

export default function UserManagement() {
    const [users, setUsers] = useState<UserData[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers()
                setUsers(data)
                setFilteredUsers(data)
            } catch (error) {
                console.error("Failed to fetch users:", error)
                toast({
                    title: "Error",
                    description: "Failed to load users. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        loadUsers()
    }, [])

    useEffect(() => {
        let result = users

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.id.toLowerCase().includes(query),
            )
        }

        // Apply role filter
        if (roleFilter) {
            result = result.filter((user) => user.role === roleFilter)
        }

        setFilteredUsers(result)
    }, [searchQuery, roleFilter, users])

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole)
            setUsers(
                users.map((user) => (user.id === userId ? { ...user, role: newRole as "guest" | "landlord" | "admin" } : user)),
            )
            toast({
                title: "Role updated",
                description: `User role has been updated to ${newRole}`,
            })
        } catch (error) {
            console.error("Failed to update user role:", error)
            toast({
                title: "Error",
                description: "Failed to update user role. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleStatusChange = async (userId: string, isActive: boolean) => {
        try {
            await updateUserStatus(userId, isActive)
            setUsers(users.map((user) => (user.id === userId ? { ...user, isActive } : user)))
            toast({
                title: "Status updated",
                description: `User has been ${isActive ? "activated" : "deactivated"}`,
            })
        } catch (error) {
            console.error("Failed to update user status:", error)
            toast({
                title: "Error",
                description: "Failed to update user status. Please try again.",
                variant: "destructive",
            })
        }
    }

    const clearFilters = () => {
        setSearchQuery("")
        setRoleFilter(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-64 md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                                {roleFilter ? `Role: ${roleFilter}` : "Filter by role"}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setRoleFilter("guest")}>Guest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("landlord")}>Landlord</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter(null)}>Show all</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {(searchQuery || roleFilter) && (
                        <Button variant="ghost" onClick={clearFilters}>
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                                                <AvatarFallback>
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <RoleSelector
                                            currentRole={user.role}
                                            onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
                                            disabled={user.role === "admin" && user.id === "admin1"} // Prevent changing the main admin
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id={`status-${user.id}`}
                                                checked={user.isActive}
                                                onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                                                disabled={user.role === "admin" && user.id === "admin1"} // Prevent deactivating the main admin
                                            />
                                            <Label htmlFor={`status-${user.id}`} className="sr-only">
                                                User status
                                            </Label>
                                            <Badge variant={user.isActive ? "outline" : "secondary"}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
