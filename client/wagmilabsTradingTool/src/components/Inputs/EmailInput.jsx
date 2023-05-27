import { Button } from "@chakra-ui/react";
import React, { useState } from "react";

export const EmailInput = ({ handleSubmit }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handleSubmitInput = e => {
    e.preventDefault();
    handleSubmit(email);
  };

  return (
    <form onSubmit={handleSubmitInput} style={styles.form}>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        required
        style={styles.input}
      />
      <Button type="submit" colorScheme="white">
        Submit
      </Button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
  },
  input: {
    padding: "8px",
    width: "100%",
    borderRadius: "4px",
    border: "2px solid #ccc",
  },
};
