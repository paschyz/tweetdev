import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthForm from "../components/AuthForm.tsx";
import { subscribe } from "../api/auth.ts";

function Signup() {
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData: any) => {
    const seed = encodeURIComponent(formData.username);
    try {
      await subscribe({
        login: formData.login,
        password: formData.password,
        username: formData.username,
        profileImageUrl: `https://i.pravatar.cc/150?u=${seed}`,
        backgroundImageUrl: `https://picsum.photos/seed/${seed}/1200/400`,
        description: "",
        joinDate: new Date(),
      });
      toast.success("Account created. Log in to get started.");
      navigate("/login");
    } catch (error) {
      toast.error("Couldn't create the account. That email or username may already be taken.");
    }
  };

  return (
    <AuthForm
      title="Create your account"
      buttonText="Create account"
      onSubmit={handleSignupSubmit}
      isSignup={true}
    />
  );
}

export default Signup;
