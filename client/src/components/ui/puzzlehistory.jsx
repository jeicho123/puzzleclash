import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, addDays, isAfter, startOfDay } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DailyPuzzleStats({ puzzleHistory = [] }) {
  if (puzzleHistory.length === 0) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground">
        No puzzle history yet
      </div>
    )
  }

  const sortedHistory = [...puzzleHistory].sort((a, b) => new Date(a.date) - new Date(b.date))

  const oldestDate = new Date(sortedHistory[0].date)
  const newestDate = new Date(sortedHistory[sortedHistory.length - 1].date)
  
  const historyMap = new Map(sortedHistory.map(({ date, puzzlesSolved }) => [new Date(date).toDateString(), puzzlesSolved]))

  const completeHistory = []
  let currentDate = oldestDate

  while (!isAfter(startOfDay(currentDate), startOfDay(newestDate))) {
    const dateString = currentDate.toDateString()
    completeHistory.push({
      date: format(currentDate, "MMM d"),
      count: historyMap.get(dateString) ?? 0,
    })
    currentDate = addDays(currentDate, 1)
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Puzzle History</CardTitle>
      </CardHeader>
      <CardContent>
    <ChartContainer
      config={{
        count: {
          label: "Puzzles Solved",
          color: "hsl(var(--primary))",
        },
      }}
      className="w-full h-[200px] mt-4"
    >
      <BarChart data={completeHistory} maxBarSize={20}>
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} hide/>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
    </CardContent>
    </Card>
  )
}
