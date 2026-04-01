import Navbar from "../components/Navbar";
import FeedbackForm from "../components/FeedbackForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <FeedbackForm />
      </main>
    </div>
  );
}