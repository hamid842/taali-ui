import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useTranslation } from "react-i18next";

export default function AuthButtons() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignUpClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <ButtonGroup dir="ltr">
      <Button
        variant={"secondary"}
        onClick={handleSignUpClick}
        className="w-1/2 border-r-2"
      >
        {t("nav.signUp")}
      </Button>
      <Button
        variant={"secondary"}
        onClick={handleLoginClick}
        className="w-1/2"
      >
        {t("nav.login")}
      </Button>
    </ButtonGroup>
  );
}
