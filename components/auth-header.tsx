import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function AuthHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/Logo.png" alt="Logo" width={32} height={32} className="rounded" />
            <span className="text-xl font-bold text-foreground">SEO Boost</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
