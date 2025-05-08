import NewAnswers from "@/components/lists/NewAnswers";
import SelectedList from "@/components/lists/SelectedList";
import Image from "next/image";

export default function Home() {
  return (
    <div>


      <div className="flex flex-col-3 gap-4 mt-4">

        <div className="w-[400px] h-[400px]">
          <NewAnswers />
        </div>
        <div>
          {/* <SelectedList /> */}

        </div>
      </div>

    </div>
  );
}
