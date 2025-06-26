"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, User, Home } from "lucide-react"

interface RoleSelectorProps {
    currentRole: string
    onRoleChange: (role: string) => void
    disabled?: boolean
}

export function RoleSelector({ currentRole, onRoleChange, disabled = false }: RoleSelectorProps) {
    const [role, setRole] = useState(currentRole)

    const handleChange = (value: string) => {
        setRole(value)
        onRoleChange(value)
    }

    const getRoleIcon = (roleType: string) => {
        switch (roleType) {
            case "admin":
                return <Shield className="h-4 w-4 mr-2" />
            case "landlord":
                return <Home className="h-4 w-4 mr-2" />
            case "guest":
                return <User className="h-4 w-4 mr-2" />
            default:
                return <User className="h-4 w-4 mr-2" />
        }
    }

    return (
        <Select value={role} onValueChange={handleChange} disabled={disabled}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="guest" className="flex items-center">
                    <div className="flex items-center">
                        {getRoleIcon("guest")}
                        Guest
                    </div>
                </SelectItem>
                <SelectItem value="landlord" className="flex items-center">
                    <div className="flex items-center">
                        {getRoleIcon("landlord")}
                        Landlord
                    </div>
                </SelectItem>
                <SelectItem value="admin" className="flex items-center">
                    <div className="flex items-center">
                        {getRoleIcon("admin")}
                        Admin
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
