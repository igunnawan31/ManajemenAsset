import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

interface PasswordInputProps {
  password: string;
  placeholder: string;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showCapsLockOnMessage: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  placeholder,
  handlePassword,
  showCapsLockOnMessage
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOnMessage, setCapsLockOnMessage] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLockOn = e.getModifierState("CapsLock");
    setCapsLockOnMessage(capsLockOn ? "Caps Lock is on" : "");
  };

  return (
    <div className="w-full flex flex-col">
      {/* Input Wrapper */}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder={placeholder}
          onChange={handlePassword}
          onKeyUp={handleKeyUp}
          className="mt-2 w-full h-12 px-4 border-b-[#202B51] border-b-2 bg-[#F5F9FF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1C2C5B]"
        />
        {/* Eye Icon Button */}
        <button
          type="button"
          onClick={handleClickShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </button>
      </div>

      {/* Caps Lock Warning */}
      {showCapsLockOnMessage && capsLockOnMessage && (
        <div className="flex items-center space-x-2 mt-2 text-gray-700">
          <FontAwesomeIcon icon={faCircleInfo} className="text-gray-600" />
          <p className="text-sm">{capsLockOnMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
