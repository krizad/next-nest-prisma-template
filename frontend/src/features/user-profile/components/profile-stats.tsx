'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileStats as ProfileStatsType } from '../types';

interface ProfileStatsProps {
  stats: ProfileStatsType;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.postsCount}</div>
            <div className="text-muted-foreground text-sm">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.followersCount}</div>
            <div className="text-muted-foreground text-sm">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.followingCount}</div>
            <div className="text-muted-foreground text-sm">Following</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
