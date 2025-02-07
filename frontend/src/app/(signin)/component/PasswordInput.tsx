import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { useState } from "react";

// Define props type
interface PasswordInputProps {
  password: string;
  placeholder: string;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showCapsLockOnMessage: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, placeholder, handlePassword, showCapsLockOnMessage }) => {
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
    <Stack alignItems="flex-start" spacing={1}>
      <TextField
        size="small"
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder={placeholder}
        onChange={handlePassword}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
        onKeyUp={handleKeyUp}
      />
      {showCapsLockOnMessage && !!capsLockOnMessage && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <FontAwesomeIcon icon={faCircleInfo} />
          <p style={{ fontSize: "0.875rem" }}>{capsLockOnMessage}</p>
        </Stack>
      )}
    </Stack>
  );
};

export default PasswordInput;
