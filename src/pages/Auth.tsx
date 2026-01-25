import { useState } from 'react';
import { useLoginAuth, useRegisterAuth } from '../api/hook/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Users, Kanban, CheckCircle2, ListTodo, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { mapFirebaseAuthError } from '@/utils/firebaseError';
import ConfirmModal from '@/components/ConfirmModal';
import { useUserStore } from '@/store/userStore';

/* ---------------- LOGIN ---------------- */

const LoginForm = () => {
  const { login } = useLoginAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const [modalContent, setModalContent] = useState<{
    title: string;
    description?: string;
  }>({
    title: '',
    description: '',
  });

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.status === 201 && res.data.success) {
        navigate('/home', { replace: true });
        console.log(res.data?.data);
        setUser(res.data.data);
        toast.success('User Logged in successfully');
      }
    } catch (error: unknown) {
      const mapped = mapFirebaseAuthError(error);
      setModalContent({
        title: mapped.message,
        description: mapped.description,
      });
      setConfirmModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className="space-y-4" onKeyPress={handleKeyPress}>
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
          />
        </div>

        <Button onClick={handleLogin} className="w-full h-11 mt-6" disabled={loading || !email || !password}>
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </div>

      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title={modalContent.title}
        description={modalContent.description}
        confirmText="Okay"
        showCancel={false}
        onConfirm={() => setConfirmModal(false)}
      />
    </>
  );
};

/* ---------------- REGISTER ---------------- */

const RegisterForm = () => {
  const { register } = useRegisterAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [modalContent, setModalContent] = useState<{
    title: string;
    description?: string;
  }>({
    title: '',
    description: '',
  });

  const resetState = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleRegister = async () => {
    if (!name || !email || !password || password.length < 6) return;

    setLoading(true);
    try {
      const res = await register(name, email, password);
      resetState();
      toast(res.message, {
        description: res.description,
      });
    } catch (error: unknown) {
      const mapped = mapFirebaseAuthError(error);
      setModalContent({
        title: mapped.message,
        description: mapped.description,
      });
      setConfirmModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <>
      <div className="space-y-4" onKeyPress={handleKeyPress}>
        <div className="space-y-2">
          <Label htmlFor="register-name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="register-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
          />
          {password && password.length < 6 && <p className="text-xs text-destructive">Password must be at least 6 characters</p>}
        </div>

        <Button
          onClick={handleRegister}
          className="w-full h-11 mt-6"
          disabled={loading || !name || !email || !password || password.length < 6}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>

      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title={modalContent.title}
        description={modalContent.description}
        confirmText="Okay"
        showCancel={false}
        onConfirm={() => setConfirmModal(false)}
      />
    </>
  );
};

/* ---------------- FEATURE CARDS ---------------- */

const FeatureCard = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
    <div className="mt-0.5 p-2 rounded-md bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1 space-y-1">
      <h4 className="text-sm font-medium leading-none">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

/* ---------------- PAGE ---------------- */

const Auth = () => {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Branding & Features */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Team Collaboration Platform</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Manage Projects
                <span className="block text-primary mt-2">Together</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md">
                Join teams, track progress, and deliver projects with our intuitive kanban-based project management system.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FeatureCard icon={Users} title="Team Collaboration" description="Join and manage multiple teams seamlessly" />
              <FeatureCard icon={Kanban} title="Kanban Boards" description="Visualize workflow with intuitive boards" />
              <FeatureCard icon={ListTodo} title="Task Management" description="Organize tasks from todo to done" />
              <FeatureCard icon={CheckCircle2} title="Track Progress" description="Monitor project status in real-time" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">2,500+</span> teams already collaborating
              </div>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="order-1 lg:order-2">
            <Card className="w-full shadow-2xl border-border/50">
              <CardHeader className="space-y-3 pb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mx-auto">
                  <Kanban className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                  <CardDescription className="text-base">Sign in to access your teams and projects</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pb-8">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-11 mb-6">
                    <TabsTrigger value="login" className="text-sm font-medium">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="text-sm font-medium">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-0">
                    <LoginForm />
                  </TabsContent>

                  <TabsContent value="register" className="mt-0">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-xs text-center text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
