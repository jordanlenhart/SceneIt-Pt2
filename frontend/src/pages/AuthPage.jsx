import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../client';
import { useForm } from 'react-hook-form';


import { Mail, Lock, Eye, EyeClosed, UserRound } from "lucide-react";

export default function AuthPage() {
  const { user, setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, showAlert] = useState({ message: "", show: false });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startMode = queryParams.get("mode") || "login";

  const [mode, setMode] = useState(startMode);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const toggleFormMode = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  /// Login with supabase
const loginUser = async (values) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })

    if (error) {
      throw new Error(error.message);
    }
    
    /// get session and user
    const session = data.session;
    const user = data.user;

    /// Immediately update context after login
    setUser({
      ...user,
      username: user.user_metadata?.username || null,
    });

    // Store token & user in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showAlert({ show: true, message: "Login successful!" });
    navigate("/");
  } catch (error) {
    showAlert({ show: true, message: error.message });
  }
};

/// signup handler function (supabase) that saves username
const signupUser = async (values) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
        },
      },
    })

    if (error) {
      throw new Error(error.message);
    }

    const session = data.session;
    const user = data.user;

    /// Immediately update context after signup
    setUser({
      ...user,
      username: user.user_metadata?.username || null,
    });

    if(session) {
      localStorage.setItem('token', session.access_token);
    }

    /// saves user in local storage
    localStorage.setItem('user', JSON.stringify(user));

    showAlert({ show: true, message: "Signup successful! Welcome to SceneIt!" });
    reset();
    navigate("/");
  } catch (error) {
    showAlert({ show: true, message: error.message });
  }
};


  return (
    <section id="auth" className="w-full mt-20 text-gray-300 flex min-h-screen">
      {/* Left Column */}
      <div className="w-[55%] min-w-[400px] px-8 py-20">
        <h2 className="text-4xl mt-2 mb-10 font-semibold">
          Welcome to <br />
          <span className="text-green-600">SceneIt</span>
        </h2>
      </div>

      {/* Right Column */}
      <div className="w-[45%] min-w-[300px] px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-10 border-2 border-gray-800/30 rounded-sm text-center">
          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="flex justify-center items-center p-5 w-20 h-20 rounded-xl shadow-md shadow-green-600 bg-green-600 border-4 border-gray-200">
              <img src='/sceneit.png' className="text-gray-900/50 text-3xl" />
            </div>

            <h3 className="font-semibold text-2xl">
              {isLogin ? "Welcome Back!" : "Join SceneIt!"}
            </h3>

            <Alert alert={alert} showAlert={showAlert} />
          </div>

          {/* Form */}
          {isLogin ? (
            <LoginForm
              handleSubmit={handleSubmit}
              loginUser={loginUser}
              register={register}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          ) : (
            <SignupForm
              handleSubmit={handleSubmit}
              signupUser={signupUser}
              register={register}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          )}

          <span>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a
              href="#"
              onClick={toggleFormMode}
              className="text-green-600 hover:underline cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}


function LoginForm({
  handleSubmit,
  loginUser,
  register,
  showPassword,
  togglePasswordVisibility,
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(loginUser)}
      autoComplete="on"
    >
      {/* Email Input */}
      <div className="relative">
      <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-300" />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full pl-10 pr-3 py-3 rounded  bg-transparent border-b border-gray-300 focus:outline-none  /50"
          {...register("email")}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-300" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full pl-10 pr-10 py-3 rounded bg-transparent border-b border-gray-300 focus:outline-none /50"
          {...register("password")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeClosed /> : <Eye />}
        </button>
      </div>

      {/* Remember Me Checkbox and Forgot Password */}
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            autoComplete="remember-me"
            className="w-4 h-4"
          />
          Remember me
        </label>
        <a
          href="/forgot-password"
          className="text-green-600 hover:underline cursor-pointer"
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-3 my-4 rounded border-2 border-gray-300/50 hover:border-gray-300 hover:scale-[.97] hover:text-gray-100 hover:font-medium hover:bg-green-600 transition-all duration-400 ease-in-out cursor-pointer"
      >
        Login
      </button>
    </form>
  );
}

function SignupForm({
  handleSubmit,
  signupUser,
  register,
  showPassword,
  togglePasswordVisibility,
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(signupUser)}
      autoComplete="on"
    >
      {/* Username Input */}
      <div className="relative">
        <UserRound className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          className="w-full pl-10 pr-3 py-3 rounded bg-transparent border-b border-gray-300 focus:outline-none"
          {...register("username")}
        />
      </div>

      {/* Email Input */}
      <div className="relative bg-transparent">
        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent border-b border-gray-300 focus:outline-none"
          {...register("email")}
        />
      </div>

      {/* Password Input */}
      <div className="relative bg-transparent">
        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          className="w-full pl-10 pr-3 py-3 rounded bg-transparent border-b border-gray-300 focus:outline-none"
          {...register("password")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeClosed /> : <Eye />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 mb-4 bg-green-500 text-black rounded hover:bg-green-600 hover:scale-[1.05] transition cursor-pointer"
      >
        Sign Up
      </button>
    </form>
  );
}

function Alert({ alert, showAlert }) {
  return (
    <>
      {alert.show && (
        <div className="bg-transparent border border-red-400 text-red-700 px-6 py-3 rounded relative mb-4">
          <span className="block sm:inline">{alert.message}</span>
          <button
            onClick={() => showAlert({ message: "", show: false })}
            className="absolute top-0 bottom-0 right-0 py-3"
          >
            <span className="sr-only">Close</span>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

function SignupAlert({ alert, showAlert }) {
    return (
        <>
            {alert.show && (
                <div className="bg-transparent text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{alert.message}</span>
                    <button
                        onClick={() => showAlert({ message: "", show: false })}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
