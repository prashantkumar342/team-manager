import { CheckCircle2, Circle, Clock } from 'lucide-react';

export const KanbanTabContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
      {[
        { name: 'Todo', count: 5, color: 'slate', icon: Circle },
        { name: 'In Progress', count: 3, color: 'blue', icon: Clock },
        { name: 'Done', count: 8, color: 'emerald', icon: CheckCircle2 },
      ].map(({ name, count, color, icon: Icon }) => (
        <div key={name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
              <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-400 text-xs font-medium`}
            >
              {count}
            </span>
          </div>
          <div className="space-y-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:shadow-md transition-all cursor-pointer">
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Sample Task</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Design homepage mockup</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
