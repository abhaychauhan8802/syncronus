import { useState } from "react";
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const validateLogin = () => {
    if (!email) {
      toast.error("Email is required.");
      return false;
    }

    if (!password) {
      toast.error("Password is required.");
      return false;
    }

    return true;
  };

  const validateSignup = () => {
    if (!email) {
      toast.error("Email is required.");
      return false;
    }

    if (!password) {
      toast.error("Password is required.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords and confirm password should be same.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      console.log(response);
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log(response);
    }
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
              <img src={Victory} alt="victory" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs
              className="w-3/4"
              defaultValue="Login"
              onValueChange={resetFields}
            >
              <TabsList className="bg-transparent rounded-none w-full">
                {["Login", "Signup"].map((tab, idx) => (
                  <TabsTrigger
                    value={tab}
                    key={idx}
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {["Login", "Signup"].map((tab, idx) => (
                <TabsContent
                  key={idx}
                  value={tab}
                  className={`flex flex-col gap-5 ${
                    tab === "Login" && "mt-10"
                  }`}
                >
                  <Input
                    placeholder="Email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full p-6"
                  />
                  <Input
                    placeholder="Password"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-full p-6"
                  />
                  {tab === "Signup" && (
                    <Input
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-full p-6"
                    />
                  )}
                  <Button
                    className="rounded-full p-6"
                    onClick={tab === "Login" ? handleLogin : handleSignup}
                  >
                    {tab}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
