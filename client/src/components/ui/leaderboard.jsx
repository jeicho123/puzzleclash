import { Bar, BarChart, XAxis, YAxis, LabelList, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

export function LeaderboardChart({ data, username }) {

  const CustomTooltipContent = ({ active, payload, username }) => {
    if (!active || !payload?.length) return null;
  
    const isCurrentUser = payload[0].payload.username === username;
    const color = isCurrentUser ? "#efbf04" : "hsl(var(--primary))";
  
    return (
      <div 
        className="rounded-lg bg-white p-2 shadow-md border"
        style={{ 
          borderColor: color,
          backgroundColor: isCurrentUser ? "##efbf04" : "white"
        }}
      >
        <p className="text-sm font-medium" style={{ color }}>
          {payload[0].payload.username}: {payload[0].value}
        </p>
      </div>
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Live Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: {
              label: "Score",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[200px]"
        >
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }} >
            <XAxis type="number" hide />
            <YAxis dataKey="username" type="category" scale="band" axisLine={false} tickLine={false} hide />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.username === username ? "#efbf04" : "hsl(var(--primary))"}
                  />
                ))}
              <LabelList
                dataKey="username"
                position="insideRight"
                fill="white"
                fontSize={12}
              />
              <LabelList
                dataKey="score"
                position="right"
                fontSize={12}
              />
            </Bar>
            <ChartTooltip cursor={false} content={<CustomTooltipContent username={username}/>} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default LeaderboardChart;
