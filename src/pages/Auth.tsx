import { useState } from 'react';
import { useLoginAuth, useRegisterAuth } from '../api/hook/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
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

  const [modalContent, setModalContent] = useState<{
    title: string;
    description?: string;
  }>({
    title: '',
    description: '',
  });
  const navigate = useNavigate();

  // const resetState = () => {
  //   setEmail("");
  //   setPassword("");
  //   setConfirmModal(false);
  //   setLoading(false);
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.status === 201 && res.data.success) {
        navigate('/home', { replace: true });
        console.log(res.data);
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

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-1">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <Button type="submit" className="w-full" disabled={(loading && email === '') || password === ''}>
        {loading ? 'Signing in...' : 'Login'}
      </Button>
      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title={modalContent.title}
        description={modalContent.description}
        confirmText="Okay"
        showCancel={false}
        onConfirm={() => setConfirmModal(false)}
      />
    </form>
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-1">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </Button>
      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title={modalContent.title}
        description={modalContent.description}
        confirmText="Okay"
        showCancel={false}
        onConfirm={() => setConfirmModal(false)}
      />
    </form>
  );
};

/* ---------------- PAGE ---------------- */

const Auth = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Team Manager</CardTitle>
          <CardDescription>Sign in or create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
