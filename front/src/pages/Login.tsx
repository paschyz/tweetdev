import { toast } from "sonner";
import AuthForm from "../components/AuthForm.tsx";
import { login } from "../api/auth.ts";
import { useAuth } from "../provider/AuthProvider";
import { setUserInfoToLocalStorage } from "../services/sessionService.ts";

function Login() {
  const { loginAndSetToken } = useAuth();

  const handleLoginSubmit = async (formData: any) => {
    try {
      const token = await login(formData);
      // the app shell reads the username as soon as we are logged in: store it first
      await setUserInfoToLocalStorage(token);
      loginAndSetToken(token);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error("Wrong email or password.");
    }
  };

  return (
    <AuthForm
      title="Log in"
      buttonText="Log in"
      onSubmit={handleLoginSubmit}
      isSignup={false}
    />
  );
}

export default Login;
