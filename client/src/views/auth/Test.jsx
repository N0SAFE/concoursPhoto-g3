import React from "react";
import { useAuth } from "../../context/AuthContext";

function Test() {
  const { token, setToken } = useAuth();
  return (
    <div>
      <h1>Test</h1>
      <p>{token}</p>
      <button onClick={function(){setToken('test')}}></button>
    </div>
  );
}

export default Test;