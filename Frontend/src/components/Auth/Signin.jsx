// src/pages/SignIn.jsx
import { useEffect, useState } from 'react'; // Added useState
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setLoading, setError, setUser, clearError } from '../../slices/authSlice';
import { signIn } from '../../services/operations/authServices';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Import eye icons

export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth);
  
  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await signIn(data);
      dispatch(setUser(response));
      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-1 block w-full h-12 px-4 rounded-lg border border-gray-300 shadow-sm"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="mt-1 block w-full h-12 px-4 rounded-lg border border-gray-300 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} 
              className="absolute right-3 top-2.5 text-gray-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />} 
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-purple-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
