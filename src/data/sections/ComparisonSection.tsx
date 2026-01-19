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
      <Section id="comparison-header" padding="lg">
        <Heading level={1}>Comparing Decision Criteria</Heading>
        <InteractiveParagraph className="text-lg text-muted-foreground mt-2">
          Same data, different philosophies, potentially different decisions.
        </InteractiveParagraph>
      </Section>

      <Section id="comparison-summary" padding="md">
        <Heading level={2}>Summary of All Three Approaches</Heading>
        <InteractiveParagraph>
          Let's recap what we've learned about each decision criterion:
        </InteractiveParagraph>

        {/* Summary Grid */}
        <div className="grid gap-4 mt-6 md:grid-cols-3">
          {/* Maximax Card */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Maximax</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              The <strong>optimist's</strong> choice
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus:</span>
                <span className="font-medium">Best possible outcome</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk level:</span>
                <span className="font-medium text-red-500">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Motto:</span>
                <span className="font-medium italic">"Shoot for the stars"</span>
              </div>
            </div>
          </div>

          {/* Maximin Card */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-secondary/10">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-bold text-lg">Maximin</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              The <strong>pessimist's</strong> choice
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus:</span>
                <span className="font-medium">Worst possible outcome</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk level:</span>
                <span className="font-medium text-green-600">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Motto:</span>
                <span className="font-medium italic">"Better safe than sorry"</span>
              </div>
            </div>
          </div>

          {/* Minimax Regret Card */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-emerald-100">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg">Minimax Regret</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              The <strong>pragmatist's</strong> choice
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus:</span>
                <span className="font-medium">Opportunity cost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk level:</span>
                <span className="font-medium text-amber-500">Medium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Motto:</span>
                <span className="font-medium italic">"No major regrets"</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="comparison-table" padding="md">
        <Heading level={2}>Quick Reference Table</Heading>
        <div className="overflow-x-auto mt-4">
          <Table className="border border-border rounded-lg">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-bold">Criterion</TableHead>
                <TableHead className="text-center">Step 1</TableHead>
                <TableHead className="text-center">Step 2</TableHead>
                <TableHead className="text-center">Decision Rule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Maximax</TableCell>
                <TableCell className="text-center text-sm">Find MAX in each row</TableCell>
                <TableCell className="text-center text-sm">Compare row maximums</TableCell>
                <TableCell className="text-center text-sm font-medium text-primary">Choose highest MAX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Maximin</TableCell>
                <TableCell className="text-center text-sm">Find MIN in each row</TableCell>
                <TableCell className="text-center text-sm">Compare row minimums</TableCell>
                <TableCell className="text-center text-sm font-medium text-secondary">Choose highest MIN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Minimax Regret</TableCell>
                <TableCell className="text-center text-sm">Build regret matrix</TableCell>
                <TableCell className="text-center text-sm">Find MAX regret per row</TableCell>
                <TableCell className="text-center text-sm font-medium text-emerald-600">Choose lowest MAX regret</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section id="comparison-explorer" padding="md">
        <Heading level={2}>Try Different Scenarios</Heading>
        <InteractiveParagraph>
          Explore how different decision problems lead to different recommendations.
          Click on each scenario to see how the three criteria compare.
        </InteractiveParagraph>
        <div className="mt-6">
          <ScenarioExplorer />
        </div>
      </Section>

      <Section id="comparison-choosing" padding="md">
        <Heading level={2}>Which Criterion Should You Use?</Heading>
        <InteractiveParagraph>
          There's no universally "correct" criterion — the right choice depends on your situation:
        </InteractiveParagraph>

        <div className="space-y-4 mt-4">
          <div className="flex gap-4 items-start p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Use Maximax when...</p>
              <p className="text-sm text-muted-foreground">
                You can afford to take risks, the upside is critically important, or you're naturally optimistic
                about outcomes. Good for entrepreneurs and growth-focused decisions.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-secondary/5 rounded-lg border border-secondary/20">
            <Shield className="w-6 h-6 text-secondary mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Use Maximin when...</p>
              <p className="text-sm text-muted-foreground">
                Failure is not an option, you're risk-averse, or the stakes are very high.
                Good for safety-critical decisions and conservative investors.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <Scale className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Use Minimax Regret when...</p>
              <p className="text-sm text-muted-foreground">
                You want a balanced approach, can't stand the thought of "what if," or when all
                states of nature seem reasonably likely. Good for most everyday decisions.
              </p>
            </div>
          </div>
        </div>
      </Section>

    </>
  );
};

export default ComparisonSection;
