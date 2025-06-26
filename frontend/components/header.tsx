"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, User, Settings, Heart, Calendar, Shield } from "lucide-react"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">DreamBook</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link
            href="/hotels"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Hotels
          </Link>
          <Link
            href="/listings"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Listings
          </Link>
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
          <Link
            href="/deals"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Deals
          </Link>
          <Link
            href="/rewards"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Rewards
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Sign In
              </Link>
              <Button className="cursor-pointer">
                <Link href="/signup">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
