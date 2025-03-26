import React from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:7000/api/auth/login",
        formData
      );
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/dashboard-admin/");
      } else if (role === "caller") {
        navigate("/dashboard-caller");
      } else if (role === "developer") {
        navigate("/dashboard-developer");
      } else if (role === "manager") {
        navigate("/dashboard-team-manager");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <section className="bg-gradient-to-br  from-white via-gray-900 to-gray-700">
      {" "}
      <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-gray-50 rounded-lg shadow  sm:max-w-lg  ">
          <div className="  mb-5 space-y-4 md:space-y-1 sm:p-10">
            <a
              href="/"
              className="flex items-center mx-30 mb-15  text-2xl font-semibold text-gray-900 "
            >
              <img className="w-50 h-20 mr-2" src={assets.logo} alt="logo" />
            </a>
            <h1 className="text-2xl mb-3 font-medium leading-tight tracking-tight text-gray-900 md:text-3xl ">
              Welcome Back !
            </h1>
            <p className="text-sm font-medium pl-1 text-gray-500">
              Sign in to your account
            </p>
            <form
              onSubmit={onSubmit}
              className="space-y-4 mt-4 md:space-y-6"
              action="#"
            >
              <div className="mt-10">
                <label
                  htmlFor="email"
                  className="block mb-2 text-lg font-medium text-gray-900 "
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-400 text-gray-900 rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@starway.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="Password"
                  className="bg-gray-50 border border-gray-400 text-gray-900 rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  required=""
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full text-white bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-700 
    hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-800 
    transition-all duration-[2000ms] ease-in-out 
    focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg mt-3 px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
