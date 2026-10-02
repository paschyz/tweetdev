import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.tsx";
import { subscribe } from "../api/auth.ts";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData: any) => {
    try {
      await subscribe({
        login: formData.login,
        password: formData.password,
        username: formData.username,
        profileImageUrl:
          "https://cdn.hero.page/0afb509c-1859-4ed9-a529-6c8ea2711b51-aesthetic-anime-and-manga-pfp-from-jujutsu-kaisen-chapter-233-page-3-pfp-3",
        backgroundImageUrl:
          "https://preview.redd.it/why-did-gojo-fire-his-hollow-purple-the-wrong-way-and-curve-v0-7lff23n81lhb1.png?auto=webp&s=304248697abd05b315bcbaa187ca4d8aa009b49a",
        description:
          "Welcome to the crème de la crème! You've stumbled upon the profile of the one and only, the magnificent, the best-of-the-best",
        joinDate: new Date(),
      });
      toast.success("Account created !", { duration: 4000 });
      navigate("/login");
    } catch (error) {
      toast.error("Bad credentials.", { duration: 4000 });
    }
  };

  return (
    <AuthForm
      title="Sign up"
      buttonText="Submit"
      onSubmit={handleSignupSubmit}
      isSignup={true}
    />
  );
}

export default Signup;
