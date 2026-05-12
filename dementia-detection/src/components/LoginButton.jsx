import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../firebase";

const LoginButton = () => {

  const handleGoogleLogin = async () => {

    try {

      const result = await signInWithPopup(auth, provider);

      alert(`Welcome ${result.user.displayName}`);

      console.log(result.user);

    } catch (error) {

      console.error(error);

      alert("Google Login Failed");

    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300"
    >
      Sign in with Google
    </button>
  );
};

export default LoginButton;
