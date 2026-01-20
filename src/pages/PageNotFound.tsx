import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-8 md:p-12 text-center shadow-sm transition-all duration-300">
          {/* Icon Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Primary Icon Container */}
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <FileQuestion className="h-12 w-12 md:h-16 md:w-16 text-primary-foreground" />
              </div>

              {/* 404 Badge */}
              <div className="absolute -top-2 -right-2 h-8 w-8 md:h-10 md:w-10 rounded-xl bg-destructive flex items-center justify-center text-destructive-foreground font-bold text-sm md:text-base shadow-lg shadow-destructive/20">
                404
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Page Not Found</h1>
          <div className="space-y-1 mb-8">
            <p className="text-muted-foreground text-sm md:text-base">Oops! The page you're looking for doesn't exist.</p>
            <p className="text-muted-foreground text-sm md:text-base">It might have been moved or deleted.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button onClick={() => navigate('/home')} className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
