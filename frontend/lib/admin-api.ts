// Admin API functions for Django backend integration
// Endpoints: 
// - GET /api/admin/users/ - Fetch all users
// - PATCH /api/admin/users/{id}/ - Update user (role, is_active)
// - POST /api/admin/users/{id}/activate/ - Activate user
// - POST /api/admin/users/{id}/deactivate/ - Deactivate user
// This module handles user management operations for the admin panel
// with automatic token refresh and fallback to mock data

import { mockUsers } from "./mock-data"
import type { UserData } from "./types"
import { adminAPI } from "./api-client"

// Transform Django user data to frontend UserData interface
function transformUserData(djangoUser: any): UserData {
    return {
        id: djangoUser.id?.toString() || djangoUser.uuid || '',
        name: djangoUser.first_name && djangoUser.last_name 
            ? `${djangoUser.first_name} ${djangoUser.last_name}`.trim()
            : djangoUser.username || djangoUser.email?.split('@')[0] || 'Unknown User',
        email: djangoUser.email || '',
        role: djangoUser.role || (djangoUser.is_staff ? 'admin' : 'guest'),
        isActive: djangoUser.is_active !== undefined ? djangoUser.is_active : true,
        joinedAt: djangoUser.date_joined || djangoUser.created_at || new Date().toISOString(),
        avatarUrl: djangoUser.avatar_url || djangoUser.profile_picture || "/placeholder.svg?height=100&width=100",
        properties: djangoUser.properties_count || 0,
        bookings: djangoUser.bookings_count || 0,
    }
}

export async function fetchUsers(): Promise<UserData[]> {
    try {
        // Use the enhanced API client with automatic token refresh
        const data = await adminAPI.getUsers()
        
        // Transform Django response to frontend UserData format
        if (Array.isArray(data)) {
            return data.map(transformUserData)
        } else if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as any).results)) {
            // Handle paginated response format
            return (data as any).results.map(transformUserData)
        } else {
            // If data format is unexpected, return as is and let TypeScript handle it
            return data as UserData[]
        }
    } catch (error) {
        console.error("Error fetching users:", error)
        // Fallback to mock data if API fails
        console.log("Falling back to mock data")
        return mockUsers
    }
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
    try {
        // Use the PATCH endpoint to update user role
        await adminAPI.updateUserRole(userId, role)
    } catch (error) {
        console.error("Error updating user role:", error)
        // Fallback to updating mock data
        const userIndex = mockUsers.findIndex((user) => user.id === userId)
        if (userIndex !== -1) {
            mockUsers[userIndex].role = role as "guest" | "landlord" | "admin"
        }
        throw error
    }
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
        // Use the activate/deactivate endpoints
        if (isActive) {
            await adminAPI.activateUser(userId)
        } else {
            await adminAPI.deactivateUser(userId)
        }
    } catch (error) {
        console.error("Error updating user status:", error)
        // Fallback to updating mock data
        const userIndex = mockUsers.findIndex((user) => user.id === userId)
        if (userIndex !== -1) {
            mockUsers[userIndex].isActive = isActive
        }
        throw error
    }
}

// New function to update both role and status at once
export async function updateUser(userId: string, updates: { role?: string; isActive?: boolean }): Promise<void> {
    try {
        const data: { role?: string; is_active?: boolean } = {}
        
        if (updates.role !== undefined) {
            data.role = updates.role
        }
        
        if (updates.isActive !== undefined) {
            data.is_active = updates.isActive
        }
        
        // Use the general update endpoint
        await adminAPI.updateUser(userId, data)
    } catch (error) {
        console.error("Error updating user:", error)
        // Fallback to updating mock data
        const userIndex = mockUsers.findIndex((user) => user.id === userId)
        if (userIndex !== -1) {
            if (updates.role !== undefined) {
                mockUsers[userIndex].role = updates.role as "guest" | "landlord" | "admin"
            }
            if (updates.isActive !== undefined) {
                mockUsers[userIndex].isActive = updates.isActive
            }
        }
        throw error
    }
}
