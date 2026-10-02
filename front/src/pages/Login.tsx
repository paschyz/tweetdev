import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.tsx";
import { login } from "../api/auth.ts";
import toast from "react-hot-toast";
import { useAuth } from "../provider/AuthProvider";
import { setUserInfoToLocalStorage } from "../services/sessionService.ts";
function Login() {
  const navigate = useNavigate();
  const { loginAndSetToken } = useAuth();

  const handleLoginSubmit = async (formData: any) => {
    try {
      const token = await login(formData);
      if (token) {
        loginAndSetToken(token);
        setUserInfoToLocalStorage(token);
        navigate("/");
      }
      toast.success("Logged in !", { duration: 4000 });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error("Bad credentials.", { duration: 4000 });
    }
  };
  return (
    <div>
      <AuthForm
        title="Sign in"
        buttonText="Submit"
        onSubmit={(formData: any) => handleLoginSubmit(formData)}
        isSignup={false}
      />
    </div>
  );
}

export default Login;
