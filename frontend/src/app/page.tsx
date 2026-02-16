import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">Next.js 16 Template</h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
          A scalable, feature-based architecture template for Next.js applications. Built with
          TypeScript, Tailwind CSS, and modern best practices.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/profile">View Profile</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-border bg-muted border-t py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Feature-Based</CardTitle>
                <CardDescription>Organized by business logic, not file type</CardDescription>
              </CardHeader>
              <CardContent>
                Each feature has its own components, hooks, services, and types for better
                maintainability.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Modern Stack</CardTitle>
                <CardDescription>Built with the latest technologies</CardDescription>
              </CardHeader>
              <CardContent>Next.js 16, React 19, TypeScript, Tailwind CSS, and more.</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 UI Components</CardTitle>
                <CardDescription>Reusable atomic components</CardDescription>
              </CardHeader>
              <CardContent>
                Pre-built components like Button, Input, Card with consistent styling.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 Auth Pages</CardTitle>
                <CardDescription>Ready-to-use authentication</CardDescription>
              </CardHeader>
              <CardContent>
                Login and register pages with route groups for clean organization.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Dashboard</CardTitle>
                <CardDescription>Complete dashboard example</CardDescription>
              </CardHeader>
              <CardContent>
                Stats, activity feed, and quick actions in a professional layout.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🛠️ Developer Tools</CardTitle>
                <CardDescription>Utilities and helpers included</CardDescription>
              </CardHeader>
              <CardContent>API client, hooks, format functions, and TypeScript types.</CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold">Ready to get started?</h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
          Explore the example pages to see the architecture in action.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Try Login Page</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">Try Register Page</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
