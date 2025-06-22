import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/google-icon";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};
const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back to ShopEase
        </h1>
        <p className="mt-2 text-gray-800">
          New to ShopEase?{" "}
          <Link
            to="/auth/register"
            className="font-medium ml-2 text-primary hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-border" />
        <span className="mx-2 text-xs text-muted-foreground">or</span>
        <div className="flex-grow border-t border-border" />
      </div>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
        asChild
      >
        <a href="http://localhost:8000/auth/google">
          <GoogleIcon className="w-5 h-5" />
          Login with Google
        </a>
      </Button>
    </div>
  );
};

export default AuthLogin;