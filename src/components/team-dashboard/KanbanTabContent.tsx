import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const KanbanTabContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
      {[
        { name: 'Todo', count: 5, icon: Circle },
        { name: 'In Progress', count: 3, icon: Clock },
        { name: 'Done', count: 8, icon: CheckCircle2 },
      ].map(({ name, count, icon: Icon }) => (
        <Card key={name} className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold">{name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">{count}</span>
            </div>
            <div className="space-y-2">
              <Card className="border-border/50 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-3">
                  <p className="text-sm font-medium mb-1">Sample Task</p>
                  <p className="text-xs text-muted-foreground">Design homepage mockup</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
