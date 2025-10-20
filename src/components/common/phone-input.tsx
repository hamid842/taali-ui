import {
  usePhoneInput,
  defaultCountries,
  FlagImage,
  parseCountry,
} from "react-international-phone";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import "react-international-phone/style.css";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (e: unknown) {
    console.log("Phone no not valid!", e);
    return false;
  }
};

interface InternationalPhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function InternationalPhoneInput({
  label,
  value,
  onChange,
  error,
  required,
  className,
}: InternationalPhoneInputProps) {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  const isValid = isPhoneValid(inputValue);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="phone-input" className="px-1">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <InputGroup dir="ltr">
        <InputGroupInput
          value={inputValue}
          ref={inputRef}
          onChange={handlePhoneValueChange}
        />
        <InputGroupAddon align="inline-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="flex items-center">
                <ChevronDown />
                <FlagImage iso2={country.iso2} style={{ display: "flex" }} />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="[--radius:0.95rem]"
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <DropdownMenuItem
                    key={country.iso2}
                    onClick={() => setCountry(country.iso2)}
                  >
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: "8px" }}
                    />
                    <div>{country.name}</div>
                    <div>+{country.dialCode}</div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
        <InputGroupAddon align="inline-start">{}</InputGroupAddon>
      </InputGroup>

      {error ||
        (!!isValid && <p className="text-xs text-destructive px-1">{error}</p>)}
    </div>
  );
}
