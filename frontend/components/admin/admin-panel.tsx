"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserManagement from "@/components/admin/user-management"
import HotelManagement from "@/components/admin/hotel-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Home, Users } from "lucide-react"

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState("users")

    return (
        <div className="w-full max-w-6xl mx-auto">
            <Tabs defaultValue="users" onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                    </TabsTrigger>
                    <TabsTrigger value="properties" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Hotels</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage user accounts and roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserManagement />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="properties" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hotel Management</CardTitle>
                            <CardDescription>Manage hotel listings and properties</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HotelManagement />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics Dashboard</CardTitle>
                            <CardDescription>View platform analytics and metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="py-8 text-center text-muted-foreground">Analytics dashboard coming soon</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
