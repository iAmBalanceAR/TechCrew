import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Welcome to <span className="text-primary">TechCrew</span>
        </h1>
        <p className="text-2xl mb-8">
          Manage your gigs, schedules, and events with ease
        </p>
        <LoginForm />
      </main>
    </div>
  )
}

