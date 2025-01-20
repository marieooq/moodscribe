import { login, signInWithGoogle, signup } from "@/app/login/actions";

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <form>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
          <button formAction={login}>Log in</button>
          <button formAction={signup}>Sign up</button>
        </form>
      </div>

      <form>
        <button formAction={signInWithGoogle} type="submit">
          Sign in with Google
        </button>
      </form>
    </>
  );
}
