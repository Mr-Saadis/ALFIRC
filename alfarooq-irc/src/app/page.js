import NewAnswers from "@/components/lists/NewAnswers";
import SelectedList from "@/components/lists/SelectedList";
import Category from "@/components/lists/Category";


export default function Home() {
  return (
    
    <div className="flex font-arabic items-center">

      <div className="w-4/5">
        <div className="flex justify-center items-center ">
          <button className="text-white justify-between items-center p-2 pr-4 pl-4 bg-primary rounded-[40px] ">
            Ask New Question
          </button>
        </div>


        <div className="w-full flex">
          <div className="w-5/16  p-4 pr-2">
            <Category />
          </div>
          <div className="flex flex-1  flex-col p-4 pr-6 pl-6  gap-10">
            <SelectedList />
            <NewAnswers/>
          </div>
        </div>
<div className="bg-yellow-100">saad</div>

      </div>
      <div className="w-1/5">
        saa
      </div>

    </div>

  );
}
