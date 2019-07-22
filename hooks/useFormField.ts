import { useState } from "react";

export const useFormField = () => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  return { value, onChange: handleChange };
};
