import NewAnswers from "@/components/lists/NewAnswers";
import SelectedList from "@/components/lists/SelectedList";


export default function Home() {
  return (
    <div className="flex flex-col items-center mb-10 pb-10 min-h-screen bg-gray-100 dark:bg-[#111928]">
      <div className="flex flex-col items-center justify-center w-full mt-10 mb-10 max-w-4xl p-4 bg-white dark:bg-[#1a1d2e] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome to Al-Farooq IRC</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Your one-stop solution for Islamic research.</p>
      </div>
        <div className="flex  font-urdutype justify-center">
          <NewAnswers />
        </div>


    </div>
  );
}
