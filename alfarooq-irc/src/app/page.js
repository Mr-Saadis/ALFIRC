import NewAnswers from "@/components/lists/NewAnswers";
import Image from "next/image";

export default function Home() {
  return (
    <div>


      <div className="flex flex-col-2 gap-4 mt-4">

        <div>
          <NewAnswers />
        </div>
        <div>
          {/* <NewAnswers /> */}

        </div>
      </div>

    </div>
  );
}
