import { useNavigate } from "react-router-dom";

export default function GameHeader({resetGame, title}) {

  const navigate = useNavigate();

  return (
    <header className="flex flex-row justify-center items-center gap-6 px-4 py-6">
        <button 
          onClick={() => navigate("/")} className="font-semibold rounded-lg bg-[#D3D3D3] px-3 py-2 cursor-pointer hover:scale-[1.05] hover:bg-[#BEBEBE] hover:shadow-lg text-xs sm:text-base">
          ← Home
        </button>

        <h2 className="font-bold sm:text-3xl text-xl">{title}</h2>

        <button 
          onClick={resetGame} className="font-semibold rounded-lg bg-[#D3D3D3] px-3 py-2 cursor-pointer hover:scale-[1.05] hover:bg-[#BEBEBE] hover:shadow-lg text-xs sm:text-base">
          Restart
        </button>
    </header>
  );
}