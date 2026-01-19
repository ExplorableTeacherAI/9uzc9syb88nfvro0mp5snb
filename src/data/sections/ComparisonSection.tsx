import { useState } from "react";
import { Section } from "@/components/templates";
import { Heading } from "@/components/molecules/Heading";
import { InteractiveParagraph } from "@/components/molecules/InteractiveParagraph";
import { Hoverable } from "@/components/annotations/Hoverable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { Button } from "@/components/atoms/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Shield, Scale, RefreshCw } from "lucide-react";

/**
 * Interactive Scenario Explorer - Try different payoff matrices
 */
const ScenarioExplorer = () => {
  const [scenario, setScenario] = useState(0);

  const scenarios = [
    {
      name: "Product Launch (Original)",
      alternatives: ["Product A", "Product B", "Product C"],
      states: ["High Demand", "Medium Demand", "Low Demand"],
      payoffs: [
        [200, 100, -50],
        [150, 120, 30],
        [80, 80, 80],
      ],
    },
    {
      name: "Investment Portfolio",
      alternatives: ["Aggressive", "Balanced", "Conservative"],
      states: ["Bull Market", "Stable Market", "Bear Market"],
      payoffs: [
        [300, 50, -100],
        [150, 100, 20],
        [60, 60, 60],
      ],
    },
    {
      name: "Restaurant Location",
      alternatives: ["Downtown", "Suburbs", "Online Only"],
      states: ["Economy Boom", "Normal", "Recession"],
      payoffs: [
        [500, 200, -150],
        [250, 180, 80],
        [120, 120, 120],
      ],
    },
  ];

  const current = scenarios[scenario];

  // Calculate all criteria
  const maxPayoffs = current.payoffs.map(row => Math.max(...row));
  const minPayoffs = current.payoffs.map(row => Math.min(...row));
  const bestInColumn = current.states.map((_, colIndex) =>
    Math.max(...current.payoffs.map(row => row[colIndex]))
  );
  const regretMatrix = current.payoffs.map(row =>
    row.map((payoff, colIndex) => bestInColumn[colIndex] - payoff)
  );
  const maxRegrets = regretMatrix.map(row => Math.max(...row));

  const maximaxChoice = maxPayoffs.indexOf(Math.max(...maxPayoffs));
  const maximinChoice = minPayoffs.indexOf(Math.max(...minPayoffs));
  const minimaxRegretChoice = maxRegrets.indexOf(Math.min(...maxRegrets));

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s, i) => (
          <Button
            key={i}
            variant={scenario === i ? "default" : "outline"}
            onClick={() => setScenario(i)}
            size="sm"
          >
            {s.name}
          </Button>
        ))}
      </div>

      {/* Decision Matrix */}
      <div className="overflow-x-auto">
        <Table className="border border-border rounded-lg">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold border-r border-border">Alternatives</TableHead>
              {current.states.map((state) => (
                <TableHead key={state} className="text-center">{state}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.alternatives.map((alt, rowIndex) => (
              <TableRow key={alt}>
                <TableCell className="font-medium border-r border-border">{alt}</TableCell>
                {current.payoffs[rowIndex].map((payoff, colIndex) => (
                  <TableCell key={colIndex} className="text-center">
                    <span className={cn(
                      "font-medium",
                      payoff >= 100 ? "text-green-600" : payoff >= 0 ? "text-foreground" : "text-red-500"
                    )}>
                      ${payoff}k
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className={cn(
          "rounded-lg p-4 border-2 transition-all",
          "bg-primary/5 border-primary/30"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-primary">Maximax</h4>
          </div>
          <p className="text-lg font-bold">{current.alternatives[maximaxChoice]}</p>
          <p className="text-sm text-muted-foreground">
            Best case: ${maxPayoffs[maximaxChoice]}k
          </p>
        </div>

        <div className={cn(
          "rounded-lg p-4 border-2 transition-all",
          "bg-secondary/5 border-secondary/30"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-secondary" />
            <h4 className="font-semibold text-secondary">Maximin</h4>
          </div>
          <p className="text-lg font-bold">{current.alternatives[maximinChoice]}</p>
          <p className="text-sm text-muted-foreground">
            Worst case: ${minPayoffs[maximinChoice]}k
          </p>
        </div>

        <div className={cn(
          "rounded-lg p-4 border-2 transition-all",
          "bg-emerald-50 border-emerald-300"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-emerald-600">Minimax Regret</h4>
          </div>
          <p className="text-lg font-bold">{current.alternatives[minimaxRegretChoice]}</p>
          <p className="text-sm text-muted-foreground">
            Max regret: {maxRegrets[minimaxRegretChoice]}
          </p>
        </div>
      </div>

      {/* Agreement indicator */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        {maximaxChoice === maximinChoice && maximinChoice === minimaxRegretChoice ? (
          <p className="text-green-600 font-medium">
            All three criteria agree! {current.alternatives[maximaxChoice]} is the clear choice.
          </p>
        ) : maximaxChoice === maximinChoice || maximinChoice === minimaxRegretChoice || maximaxChoice === minimaxRegretChoice ? (
          <p className="text-amber-600 font-medium">
            Two criteria agree, but one differs. Your choice depends on your risk preference.
          </p>
        ) : (
          <p className="text-blue-600 font-medium">
            All three criteria give different answers! Your personal risk tolerance will determine the best choice.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Comparison Section Component
 */
export const ComparisonSection = () => {
  return (
    <>
    </>
  );
};

export default ComparisonSection;
