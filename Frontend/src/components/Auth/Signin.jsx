import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "../../services/operations/authServices";
import { clearError } from "../../slices/authSlice";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token && user) {
      // Redirect based on user role
      if (user.role === 'Admin') {
        navigate('/admin-dashboard'); // Redirect to Admin Dashboard
      } else if (user.role === 'Representative') {
        navigate('/dashboard/home'); // Redirect to Salesperson Dashboard
      } else {
        navigate('/signin'); // Default redirect
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, user, navigate, dispatch]);

const onSubmit = async (data) => {
  try {
    const result = await dispatch(signIn(data));
    if (result?.user) {
      console.log("Login successful");
    }
  } catch (error) {
    console.error("SignIn component error:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
              className={`mt-1 block w-full h-12 px-4 rounded-lg border shadow-sm
                ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
              className={`mt-1 block w-full h-12 px-4 rounded-lg border shadow-sm
                ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
