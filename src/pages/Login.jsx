import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.get("http://localhost:3001/users");
      const users = response.data;

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
        window.location.reload();
      } else {
        setErrorMessage("Invalid email or password!");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      setErrorMessage("There was an error logging in. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-pink-300 hover:text-pink-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            {/* <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button> */}
            <Button type={'submit'} value="Sign in" paddingX={"px-6"} paddingY={"py-3"} width={'w-full'}></Button>


          </div>
        </form>

        {errorMessage && (
          <p className="mt-2 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?
          <Link
            to={"/register"}
            className="font-semibold leading-6 text-pink-300 hover:text-pink-500"
          >
            {" "}
            Register here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
