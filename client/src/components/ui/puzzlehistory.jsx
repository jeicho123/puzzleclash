import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, addDays, isBefore, isEqual } from "date-fns"
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

  const sortedHistory = [...puzzleHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const oldestDate = new Date(sortedHistory[0].date)
  const newestDate = new Date(sortedHistory[sortedHistory.length - 1].date)

  const completeHistory = []
  let currentDate = oldestDate
  const historyMap = new Map(sortedHistory.map((entry) => [new Date(entry.date).toDateString(), entry]))

  while (isBefore(currentDate, newestDate) || isEqual(currentDate, newestDate)) {
    const dateString = currentDate.toDateString()
    if (historyMap.has(dateString)) {
      completeHistory.push(historyMap.get(dateString))
    } else {
      completeHistory.push({ date: new Date(currentDate), puzzlesSolved: 0 })
    }
    currentDate = addDays(currentDate, 1)
  }

  const chartData = completeHistory.map((entry) => ({
    date: format(new Date(entry.date), "MMM d"),
    count: entry.puzzlesSolved,
  }))

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
      <BarChart data={chartData} maxBarSize={20}>
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