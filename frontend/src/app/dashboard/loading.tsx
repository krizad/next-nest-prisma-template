import { Card, CardContent } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted mt-2 h-5 w-80 animate-pulse rounded" />
      </div>

      {/* Stats skeleton */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['stat-1', 'stat-2', 'stat-3', 'stat-4'].map((key) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="bg-muted mb-2 h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted mb-1 h-7 w-20 animate-pulse rounded" />
              <div className="bg-muted h-3 w-32 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {['content-1', 'content-2'].map((key) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="bg-muted mb-4 h-5 w-40 animate-pulse rounded" />
              <div className="space-y-3">
                {['item-1', 'item-2', 'item-3', 'item-4'].map((itemKey) => (
                  <div key={itemKey} className="flex items-start gap-3">
                    <div className="bg-muted mt-1 h-2 w-2 animate-pulse rounded-full" />
                    <div className="flex-1">
                      <div className="bg-muted mb-1 h-4 w-full animate-pulse rounded" />
                      <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-muted mb-4 h-5 w-32 animate-pulse rounded" />
          <div className="space-y-3">
            {['row-1', 'row-2', 'row-3'].map((key) => (
              <div key={key} className="flex items-center gap-4">
                <div className="bg-muted h-4 flex-1 animate-pulse rounded" />
                <div className="bg-muted h-4 w-40 animate-pulse rounded" />
                <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                <div className="bg-muted h-8 w-20 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
