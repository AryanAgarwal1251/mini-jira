import api from "../services/api";

export default function Login() {
  const login = async () => {
    const res = await api.post("/auth/login", {
      email: "test@test.com",
      password: "123"
    });
    localStorage.setItem("token", res.data.token);
    window.location = "/dashboard";
  };

  return <button onClick={login}>Login</button>;
}
