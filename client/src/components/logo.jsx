import logo from "@/assets/Chess Knight.png"

export default function Logo() {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
                <img 
                    src={logo} 
                    alt="Logo"  
                    className="w-auto h-12"
                />
                <h1 className="text-4xl font-bold">PuzzleClash</h1>
            </div>
            <p className="text-center text-m text-gray-500 italic">Solve chess puzzles live against others!</p>
        </div>
    )
}
