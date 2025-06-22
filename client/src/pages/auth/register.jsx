import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



const initialState = {
  userName: "",
  email: "",
  password: "",
};


const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast}=useToast();

  console.log(formData);
  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast({
          title:"Sucess",
        });
        navigate('/auth/login');
      }else{
        toast({
          title:data?.payload?.message,
          variant:"destructive",
        });
      }
    })

  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new Account</h1>
        <p className="mt-2">Already have an Account?
          <Link to='/auth/login' className="font-medium ml-2 text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
      <CommonForm formControls={registerFormControls} buttonText={"Sign Up"} formData={formData} setFormData={setFormData} onSubmit={onSubmit} />
    </div>
  )
}

export default AuthRegister;