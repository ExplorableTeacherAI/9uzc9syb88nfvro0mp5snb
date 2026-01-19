import { useState } from "react";
import { Section } from "@/components/templates";
import { Heading } from "@/components/molecules/Heading";
import { InteractiveParagraph } from "@/components/molecules/InteractiveParagraph";
import { Hoverable } from "@/components/annotations/Hoverable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { Button } from "@/components/atoms/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, RotateCcw, Shield } from "lucide-react";

/**
 * Interactive Maximin Demonstration
 */
const MaximinDemo = () => {
  const [step, setStep] = useState(0);

  const alternatives = ["Launch Product A", "Launch Product B", "Launch Product C"];
  const statesOfNature = ["High Demand", "Medium Demand", "Low Demand"];
  const payoffs = [
    [200, 100, -50],
    [150, 120, 30],
    [80, 80, 80],
  ];

  // Minimum payoff for each alternative (worst case)
  const minPayoffs = payoffs.map(row => Math.min(...row));
  // Index of the best minimum (Maximin choice)
  const maximinIndex = minPayoffs.indexOf(Math.max(...minPayoffs));

  const steps = [
    {
      title: "Step 1: Examine the Decision Matrix",
      description: "We start with our payoff table. A pessimist assumes the worst will happen.",
      highlight: "none",
    },
    {
      title: "Step 2: Find the Minimum Payoff for Each Alternative",
      description: "For each row (alternative), identify the worst possible outcome — the lowest payoff that could happen if things go badly.",
      highlight: "minInRow",
    },
    {
      title: "Step 3: Choose the Maximum of the Minimums",
      description: "Compare all the minimum payoffs and select the alternative with the highest worst-case outcome. This guarantees the best 'floor' for your decision.",
      highlight: "maximin",
    },
  ];

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const value = payoffs[rowIndex][colIndex];
    const isMin = value === minPayoffs[rowIndex];
    const isMaximin = rowIndex === maximinIndex && isMin && step >= 2;

    if (step === 0) {
      return "bg-background";
    }

    if (step === 1 && isMin) {
      return "bg-amber-100 ring-2 ring-amber-500";
    }

    if (step === 2) {
      if (isMaximin) {
        return "bg-secondary/20 ring-2 ring-secondary animate-pulse";
      }
      if (isMin) {
        return "bg-amber-100 ring-1 ring-amber-400";
      }
    }

    return "bg-background";
  };

  const getRowStyle = (rowIndex: number) => {
    if (step === 2 && rowIndex === maximinIndex) {
      return "bg-secondary/5";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2",
              i <= step ? "text-secondary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                i < step ? "bg-secondary text-secondary-foreground border-secondary" :
                i === step ? "border-secondary text-secondary" :
                "border-muted-foreground/30"
              )}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Current step info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {step === 2 && <Shield className="w-5 h-5 text-secondary" />}
          {steps[step].title}
        </h3>
        <p className="text-muted-foreground mt-1">{steps[step].description}</p>
      </div>

      {/* Decision Matrix with highlighting */}
      <div className="overflow-x-auto">
        <Table className="border border-border rounded-lg">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-foreground border-r border-border">
                Alternatives
              </TableHead>
              {statesOfNature.map((state) => (
                <TableHead key={state} className="text-center font-semibold">
                  {state}
                </TableHead>
              ))}
              <TableHead
                className={cn(
                  "text-center font-bold border-l-2 border-secondary/50 bg-secondary/5",
                  step >= 1 ? "opacity-100" : "opacity-30"
                )}
              >
                Min Payoff
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alt, rowIndex) => (
              <TableRow key={alt} className={getRowStyle(rowIndex)}>
                <TableCell className="font-medium border-r border-border">
                  {alt}
                </TableCell>
                {payoffs[rowIndex].map((payoff, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(
                      "text-center transition-all duration-300",
                      getCellStyle(rowIndex, colIndex)
                    )}
                  >
                    <span className={cn(
                      "text-lg font-medium",
                      payoff >= 100 ? "text-green-600" : payoff >= 0 ? "text-foreground" : "text-red-500"
                    )}>
                      ${payoff}k
                    </span>
                  </TableCell>
                ))}
                <TableCell
                  className={cn(
                    "text-center border-l-2 border-secondary/50 font-bold transition-all duration-300",
                    step >= 1 ? "opacity-100" : "opacity-30",
                    step === 2 && rowIndex === maximinIndex && "bg-secondary/20 text-secondary"
                  )}
                >
                  ${minPayoffs[rowIndex]}k
                  {step === 2 && rowIndex === maximinIndex && (
                    <span className="ml-2 text-xs">← Best!</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Result box */}
      {step === 2 && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-semibold text-secondary">
            Maximin Decision: {alternatives[maximinIndex]}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            A pessimist would choose {alternatives[maximinIndex]} because even in the worst case,
            you're guaranteed at least ${minPayoffs[maximinIndex]}k. This is the safest choice with the
            highest "floor."
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
 * Maximin Section Component
 */
export const MaximinSection = () => {
  return (
    <>
      <Section id="maximin-header" padding="lg">
        <Heading level={1}>Maximin Criterion: The Pessimist's Choice</Heading>
        <InteractiveParagraph className="text-lg text-muted-foreground mt-2">
          Protect yourself from the worst — guarantee the best possible floor.
        </InteractiveParagraph>
      </Section>

      <Section id="maximin-concept" padding="md">
        <Heading level={2}>What is Maximin?</Heading>
        <InteractiveParagraph>
          The Maximin criterion is the choice of a{" "}
          <Hoverable tooltip="Someone who expects unfavorable outcomes and makes decisions to minimize potential losses.">
            pessimist
          </Hoverable>
          . The name comes from "MAXimum of the MINimums" — you look at the worst possible outcome
          for each alternative and then pick the one with the best worst-case scenario.
        </InteractiveParagraph>
        <InteractiveParagraph>
          This approach is about{" "}
          <Hoverable tooltip="A strategy that focuses on limiting downside risk rather than maximizing upside potential.">
            risk aversion
          </Hoverable>
          . You're asking: "If everything goes wrong, which choice leaves me in the best position?"
        </InteractiveParagraph>
      </Section>

      <Section id="maximin-algorithm" padding="md">
        <Heading level={2}>How Maximin Works</Heading>
        <InteractiveParagraph>
          The algorithm protects against the worst:
        </InteractiveParagraph>
        <ol className="list-decimal list-inside space-y-2 mt-4 ml-4">
          <li className="text-muted-foreground">
            <span className="text-foreground">For each alternative, find the minimum payoff</span> — the worst outcome if things go badly.
          </li>
          <li className="text-muted-foreground">
            <span className="text-foreground">Compare these minimum payoffs across all alternatives</span>.
          </li>
          <li className="text-muted-foreground">
            <span className="text-foreground">Select the alternative with the highest minimum</span> — this is your Maximin choice.
          </li>
        </ol>
      </Section>

      <Section id="maximin-demo" padding="md">
        <Heading level={2}>Interactive Example</Heading>
        <InteractiveParagraph>
          Walk through each step to see how Maximin protects you from the worst outcomes.
          Notice how this leads to a different choice than Maximax!
        </InteractiveParagraph>
        <div className="mt-6">
          <MaximinDemo />
        </div>
      </Section>

      <Section id="maximin-comparison" padding="md">
        <Heading level={2}>Maximax vs. Maximin: A Quick Comparison</Heading>
        <div className="bg-muted/30 rounded-lg p-4 border border-border mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <p className="font-semibold text-primary">Maximax chose:</p>
              <p className="text-lg">Product A</p>
              <p className="text-sm text-muted-foreground">Best case: $200k</p>
              <p className="text-sm text-red-500">Worst case: -$50k</p>
            </div>
            <div className="text-center p-3 bg-secondary/10 rounded-lg">
              <p className="font-semibold text-secondary">Maximin chose:</p>
              <p className="text-lg">Product C</p>
              <p className="text-sm text-muted-foreground">Best case: $80k</p>
              <p className="text-sm text-green-600">Worst case: $80k</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Same data, different philosophies, different decisions!
          </p>
        </div>
      </Section>

      <Section id="maximin-pros-cons" padding="md">
        <Heading level={2}>When to Use Maximin</Heading>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Provides a safety net against worst outcomes</li>
              <li>• Good for high-stakes decisions where losses hurt</li>
              <li>• Appropriate when you can't afford to fail</li>
              <li>• Simple and conservative approach</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-700 mb-2">Limitations</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• May miss excellent opportunities</li>
              <li>• Overly pessimistic in many situations</li>
              <li>• Ignores favorable outcomes entirely</li>
              <li>• Can lead to overly cautious decisions</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
};

export default MaximinSection;
