import { useState } from "react";
import { Section } from "@/components/templates";
import { Heading } from "@/components/molecules/Heading";
import { InteractiveParagraph } from "@/components/molecules/InteractiveParagraph";
import { Hoverable } from "@/components/annotations/Hoverable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { Button } from "@/components/atoms/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, RotateCcw, Scale, ArrowRight } from "lucide-react";

/**
 * Interactive Minimax Regret Demonstration
 */
const MinimaxRegretDemo = () => {
  const [step, setStep] = useState(0);

  const alternatives = ["Product A", "Product B", "Product C"];
  const statesOfNature = ["High Demand", "Medium Demand", "Low Demand"];
  const payoffs = [
    [200, 100, -50],
    [150, 120, 30],
    [80, 80, 80],
  ];

  // Best payoff for each state of nature (column max)
  const bestInColumn = statesOfNature.map((_, colIndex) =>
    Math.max(...payoffs.map(row => row[colIndex]))
  );

  // Regret matrix: best possible - actual payoff for each cell
  const regretMatrix = payoffs.map(row =>
    row.map((payoff, colIndex) => bestInColumn[colIndex] - payoff)
  );

  // Maximum regret for each alternative
  const maxRegrets = regretMatrix.map(row => Math.max(...row));

  // Index of the minimum maximum regret (Minimax Regret choice)
  const minimaxIndex = maxRegrets.indexOf(Math.min(...maxRegrets));

  const steps = [
    {
      title: "Step 1: Start with the Payoff Matrix",
      description: "We begin with our original payoff table showing profits for each combination.",
    },
    {
      title: "Step 2: Find the Best Payoff in Each Column",
      description: "For each state of nature (column), identify the highest payoff — the best you could do if you knew that state would occur.",
    },
    {
      title: "Step 3: Calculate the Regret Matrix",
      description: "For each cell, calculate regret = (best in column) - (cell value). Regret represents the 'opportunity cost' of not choosing the best option for that state.",
    },
    {
      title: "Step 4: Find Maximum Regret for Each Alternative",
      description: "For each alternative (row), find the maximum regret — the worst 'missed opportunity' you could experience.",
    },
    {
      title: "Step 5: Choose the Minimum of Maximum Regrets",
      description: "Select the alternative with the smallest maximum regret. This minimizes your worst-case 'what if' feeling!",
    },
  ];

  const getPayoffCellStyle = (rowIndex: number, colIndex: number) => {
    const isBestInColumn = payoffs[rowIndex][colIndex] === bestInColumn[colIndex];

    if (step === 1 && isBestInColumn) {
      return "bg-green-100 ring-2 ring-green-500";
    }
    return "bg-background";
  };

  const getRegretCellStyle = (rowIndex: number, colIndex: number) => {
    const regret = regretMatrix[rowIndex][colIndex];
    const isMaxRegret = regret === maxRegrets[rowIndex];
    const isMinimaxRegret = rowIndex === minimaxIndex && isMaxRegret;

    if (step === 3) {
      return regret === 0 ? "bg-green-100" : "bg-orange-50";
    }

    if (step === 4 && isMaxRegret) {
      return "bg-orange-200 ring-2 ring-orange-500";
    }

    if (step === 4) {
      return regret === 0 ? "bg-green-100" : "bg-orange-50";
    }

    if (step === 4 && isMinimaxRegret) {
      return "bg-emerald-200 ring-2 ring-emerald-600 animate-pulse";
    }

    return regret === 0 ? "bg-green-100" : "bg-orange-50";
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1",
              i <= step ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                i < step ? "bg-emerald-600 text-white border-emerald-600" :
                i === step ? "border-emerald-600 text-emerald-600" :
                "border-muted-foreground/30"
              )}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Current step info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {step === 4 && <Scale className="w-5 h-5 text-emerald-600" />}
          {steps[step].title}
        </h3>
        <p className="text-muted-foreground mt-1">{steps[step].description}</p>
      </div>

      {/* Matrices container */}
      <div className="space-y-6">
        {/* Payoff Matrix */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">Payoff Matrix</h4>
          <div className="overflow-x-auto">
            <Table className="border border-border rounded-lg">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold border-r border-border">Alternatives</TableHead>
                  {statesOfNature.map((state, colIndex) => (
                    <TableHead key={state} className="text-center">
                      <span className="text-xs block text-muted-foreground">State {colIndex + 1}</span>
                      {state}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alternatives.map((alt, rowIndex) => (
                  <TableRow key={alt}>
                    <TableCell className="font-medium border-r border-border">{alt}</TableCell>
                    {payoffs[rowIndex].map((payoff, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={cn(
                          "text-center transition-all duration-300",
                          getPayoffCellStyle(rowIndex, colIndex)
                        )}
                      >
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
                {/* Best in column row */}
                {step >= 1 && (
                  <TableRow className="bg-green-50 border-t-2 border-green-300">
                    <TableCell className="font-bold text-green-700 border-r border-border">
                      Best in Column
                    </TableCell>
                    {bestInColumn.map((best, colIndex) => (
                      <TableCell key={colIndex} className="text-center font-bold text-green-700">
                        ${best}k
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Arrow transition */}
        {step >= 2 && (
          <div className="flex justify-center">
            <ArrowRight className="w-8 h-8 text-muted-foreground rotate-90" />
          </div>
        )}

        {/* Regret Matrix */}
        {step >= 2 && (
          <div className="animate-in fade-in slide-in-from-top-4">
            <h4 className="font-medium mb-2 text-sm text-muted-foreground">
              Regret Matrix <span className="text-xs">(Best - Actual = Opportunity Cost)</span>
            </h4>
            <div className="overflow-x-auto">
              <Table className="border border-border rounded-lg">
                <TableHeader>
                  <TableRow className="bg-orange-50/50">
                    <TableHead className="font-bold border-r border-border">Alternatives</TableHead>
                    {statesOfNature.map((state) => (
                      <TableHead key={state} className="text-center">{state}</TableHead>
                    ))}
                    <TableHead
                      className={cn(
                        "text-center font-bold border-l-2 border-orange-300 bg-orange-100",
                        step >= 3 ? "opacity-100" : "opacity-30"
                      )}
                    >
                      Max Regret
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatives.map((alt, rowIndex) => (
                    <TableRow
                      key={alt}
                      className={step === 4 && rowIndex === minimaxIndex ? "bg-emerald-50" : ""}
                    >
                      <TableCell className="font-medium border-r border-border">{alt}</TableCell>
                      {regretMatrix[rowIndex].map((regret, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className={cn(
                            "text-center transition-all duration-300",
                            getRegretCellStyle(rowIndex, colIndex)
                          )}
                        >
                          <span className={cn(
                            "font-medium",
                            regret === 0 ? "text-green-600" : "text-orange-600"
                          )}>
                            {regret === 0 ? "0" : `${regret}`}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell
                        className={cn(
                          "text-center border-l-2 border-orange-300 font-bold transition-all duration-300",
                          step >= 3 ? "opacity-100" : "opacity-30",
                          step === 4 && rowIndex === minimaxIndex && "bg-emerald-200 text-emerald-700"
                        )}
                      >
                        {maxRegrets[rowIndex]}
                        {step === 4 && rowIndex === minimaxIndex && (
                          <span className="ml-1 text-xs">← Min!</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Result box */}
      {step === 4 && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-semibold text-emerald-700">
            Minimax Regret Decision: {alternatives[minimaxIndex]}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            By choosing {alternatives[minimaxIndex]}, your maximum regret is only {maxRegrets[minimaxIndex]}.
            This means no matter what happens, you won't look back and think "I could have done {maxRegrets[minimaxIndex]} better
            if only I'd chosen differently."
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button
          onClick={() => setStep(Math.min(step + 1, steps.length - 1))}
          disabled={step === steps.length - 1}
          className="gap-2"
        >
          Next Step
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Minimax Regret Section Component
 */
export const MinimaxRegretSection = () => {
  return (
    <>
      <Section id="minimax-regret-header" padding="lg">
        <Heading level={1}>Minimax Regret: Minimizing "What If" Feelings</Heading>
        <InteractiveParagraph className="text-lg text-muted-foreground mt-2">
          Avoid the pain of looking back and wishing you'd chosen differently.
        </InteractiveParagraph>
      </Section>

      <Section id="minimax-regret-concept" padding="md">
        <Heading level={2}>What is Regret?</Heading>
        <InteractiveParagraph>
          <Hoverable tooltip="The difference between what you actually got and what you could have gotten if you had made the best choice for that particular outcome.">
            Regret
          </Hoverable>{" "}
          (also called opportunity cost) measures the "what if" feeling — how much better off you
          could have been if you had made a different choice, given what actually happened.
        </InteractiveParagraph>
        <InteractiveParagraph>
          For example, if you chose Product B and the market had high demand, you'd earn $150k.
          But if you had chosen Product A, you would have earned $200k. Your regret is
          $200k - $150k = $50k.
        </InteractiveParagraph>
      </Section>

      <Section id="minimax-regret-philosophy" padding="md">
        <Heading level={2}>The Minimax Regret Philosophy</Heading>
        <InteractiveParagraph>
          The Minimax Regret criterion says: "I want to minimize the maximum regret I could
          experience." It's a balanced approach — neither purely optimistic nor purely pessimistic.
          Instead, it focuses on avoiding the worst "hindsight" feeling.
        </InteractiveParagraph>
        <div className="bg-muted/30 rounded-lg p-4 mt-4 border border-border">
          <p className="italic text-muted-foreground">
            "I can accept not getting the absolute best outcome, but I don't want to look back
            and feel terrible about my choice."
          </p>
        </div>
      </Section>

      <Section id="minimax-regret-demo" padding="md">
        <Heading level={2}>Interactive Example</Heading>
        <InteractiveParagraph>
          This criterion requires building a regret matrix first. Walk through each step to see
          how regret is calculated and how the final decision is made.
        </InteractiveParagraph>
        <div className="mt-6">
          <MinimaxRegretDemo />
        </div>
      </Section>

      <Section id="minimax-regret-pros-cons" padding="md">
        <Heading level={2}>When to Use Minimax Regret</Heading>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Balanced between optimism and pessimism</li>
              <li>• Considers opportunity cost explicitly</li>
              <li>• Reduces "hindsight regret"</li>
              <li>• Good when all outcomes are somewhat likely</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-700 mb-2">Limitations</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• More complex to calculate</li>
              <li>• Still ignores actual probabilities</li>
              <li>• May lead to "compromise" solutions</li>
              <li>• Sensitive to irrelevant alternatives</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
};

export default MinimaxRegretSection;
