import { useState } from "react";
import "../styles/AuthForm.css";
import toast from "react-hot-toast";

function AuthForm({
  title,
  buttonText,
  onSubmit,
  isSignup,
}: {
  title: string;
  buttonText: string;
  onSubmit: (formData: any) => void;
  isSignup: boolean;
}) {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    username: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNoSpaces = /^\S+$/;
    const hasValidChars = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]+$/;

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }

    if (!hasNoSpaces.test(password)) {
      return "Password cannot contain spaces.";
    }

    if (!hasValidChars.test(password)) {
      return "Password contains invalid characters.";
    }

    return "";
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMessage(passwordError);
      toast.error(passwordError);
    } else {
      setErrorMessage("");
      onSubmit(formData);
    }
  };

  const displayUsernameField = () => {
    if (isSignup) {
      return (
        <div>
          <label className="auth-label">Username</label>
          <input
            className="auth-input px-3 py-2 bg-componentBg border-2 border-componentBorder rounded-md"
            type="text"
            autoComplete=""
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <br />
          <br />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-row justify-center items-center  mt-32">
      <div className="auth-form">
        <h1 className="text-center text-4xl font-bold mb-16">{title}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="auth-label">Email Address</label>
            <input
              className="auth-input px-3 py-2 bg-componentBg border-2 border-componentBorder rounded-md"
              type="text"
              autoComplete="username"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
            <br />
            <br />
          </div>
          {displayUsernameField()}
          <div>
            <label className="auth-label">Password</label>
            <input
              className="auth-input px-3 py-2 bg-componentBg border-2 border-componentBorder rounded-md"
              type="password"
              autoComplete="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <br />
          </div>

          <div>
            <button type="submit" className="auth-button">
              <p className="font-semibold">{buttonText}</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
