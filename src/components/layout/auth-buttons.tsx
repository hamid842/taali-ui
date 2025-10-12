import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

export default function AuthButtons() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <ButtonGroup>
      <Button
        variant={"secondary"}
        onClick={handleSignUpClick}
        className="w-1/2 border-r-2"
      >
        Sign up
      </Button>
      <Button
        variant={"secondary"}
        onClick={handleLoginClick}
        className="w-1/2"
      >
        Login
      </Button>
    </ButtonGroup>
  );
}
