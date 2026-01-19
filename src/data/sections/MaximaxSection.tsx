import { useState, useEffect } from "react";
import { Section } from "@/components/templates";
import { Heading } from "@/components/molecules/Heading";
import { InteractiveParagraph } from "@/components/molecules/InteractiveParagraph";
import { Hoverable } from "@/components/annotations/Hoverable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { Button } from "@/components/atoms/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";

/**
 * Interactive Maximax Demonstration
 */
const MaximaxDemo = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [animatingRow, setAnimatingRow] = useState(-1);
  const [scanningCol, setScanningCol] = useState(-1);
  const [showMaxColumn, setShowMaxColumn] = useState(false);
  const [revealedRows, setRevealedRows] = useState<number[]>([]);

  const alternatives = ["Launch Product A", "Launch Product B", "Launch Product C"];
  const statesOfNature = ["High Demand", "Medium Demand", "Low Demand"];
  const payoffs = [
    [200, 100, -50],
    [150, 120, 30],
    [80, 80, 80],
  ];

  // Maximum payoff for each alternative
  const maxPayoffs = payoffs.map(row => Math.max(...row));
  // Index of the best maximum (Maximax choice)
  const maximaxIndex = maxPayoffs.indexOf(Math.max(...maxPayoffs));
  // Find column index of max value in each row
  const maxColIndices = payoffs.map(row => row.indexOf(Math.max(...row)));

  // Animation effect based on step
  useEffect(() => {
    if (step === 0) {
      // Step 1: Show original table only
      setShowMaxColumn(false);
      setRevealedRows([]);
      setScanningCol(-1);
      setAnimatingRow(-1);
    } else if (step === 1) {
      // Step 2: Animate finding max for each row
      setShowMaxColumn(true);
      setRevealedRows([]);
      setScanningCol(-1);

      const animateRows = async () => {
        for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
          setAnimatingRow(rowIdx);

          // Scan through each column in the row
          for (let colIdx = 0; colIdx < statesOfNature.length; colIdx++) {
            setScanningCol(colIdx);
            await new Promise(resolve => setTimeout(resolve, 300));
          }

          // Highlight the max and move to column
          setScanningCol(-1);
          await new Promise(resolve => setTimeout(resolve, 400));
          setRevealedRows(prev => [...prev, rowIdx]);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        setAnimatingRow(-1);
      };

      animateRows();
    } else if (step === 2) {
      // Step 3: Show final decision
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
    }
  }, [step, alternatives.length, statesOfNature.length]);

  const steps = [
    {
      title: "Step 1: Examine the Decision Matrix",
      description: "We start with our payoff table showing all possible outcomes for each alternative under different states of nature.",
      highlight: "none",
    },
    {
      title: "Step 2: Find the Maximum Payoff for Each Alternative",
      description: "For each row (alternative), identify the best possible outcome — the highest payoff you could achieve if the most favorable state occurs.",
      highlight: "maxInRow",
    },
    {
      title: "Step 3: Choose the Maximum of the Maximums",
      description: "Compare all the maximum payoffs and select the alternative with the highest one. This is the Maximax decision!",
      highlight: "maximax",
    },
  ];

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const value = payoffs[rowIndex][colIndex];
    const isMax = value === maxPayoffs[rowIndex];
    const isMaximax = rowIndex === maximaxIndex && isMax && step === 2;
    const isCurrentRow = animatingRow === rowIndex;
    const isScanning = isCurrentRow && scanningCol === colIndex;
    const isFoundMax = isCurrentRow && scanningCol === -1 && isMax && !revealedRows.includes(rowIndex);

    if (step === 0) {
      return "bg-background";
    }

    if (step === 1) {
      // Currently scanning this cell
      if (isScanning) {
        return "bg-amber-100";
      }
      // Found the max, highlighting it before moving
      if (isFoundMax) {
        return "bg-green-200";
      }
      // Already revealed max
      if (isMax && revealedRows.includes(rowIndex)) {
        return "bg-green-100";
      }
    }

    if (step === 2) {
      if (isMaximax) {
        return "bg-primary/20";
      }
      if (isMax) {
        return "bg-green-100";
      }
    }

    return "bg-background";
  };

  const getRowStyle = (rowIndex: number) => {
    if (step === 2 && rowIndex === maximaxIndex) {
      return "bg-primary/5";
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
              i <= step || (completed && i === steps.length - 1) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                i < step || (completed && i <= step) ? "bg-primary text-primary-foreground border-primary" :
                i === step ? "border-primary text-primary" :
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
          {step === 2 && <Sparkles className="w-5 h-5 text-primary" />}
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
              {showMaxColumn && (
                <TableHead
                  className="text-center font-bold border-l-2 border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-right-4 duration-300"
                >
                  Max Payoff
                </TableHead>
              )}
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
                      "text-center transition-colors duration-300",
                      getCellStyle(rowIndex, colIndex)
                    )}
                  >
                    <span className="text-lg font-medium">
                      ${payoff}k
                    </span>
                  </TableCell>
                ))}
                {showMaxColumn && (
                  <TableCell
                    className={cn(
                      "text-center border-l-2 border-primary/50 font-bold transition-colors duration-300",
                      step === 2 && rowIndex === maximaxIndex && "bg-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span
                        className={cn(
                          "text-green-600 transition-opacity duration-500",
                          revealedRows.includes(rowIndex)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      >
                        ${maxPayoffs[rowIndex]}k
                      </span>
                      {step === 2 && rowIndex === maximaxIndex && (
                        <span className="text-xs text-primary">← Best!</span>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Result box */}
      {step === 2 && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-semibold text-primary">
            Maximax Decision: {alternatives[maximaxIndex]}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            An optimist would choose {alternatives[maximaxIndex]} because it offers the highest
            possible payoff of ${maxPayoffs[maximaxIndex]}k if {statesOfNature[0]} occurs.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setStep(0);
            setCompleted(false);
          }}
          disabled={step === 0 && !completed}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button
          onClick={() => {
            if (step === steps.length - 1) {
              setCompleted(true);
            } else {
              setStep(step + 1);
            }
          }}
          disabled={completed}
          className="gap-2"
        >
          {step === steps.length - 1 ? "Complete" : "Next Step"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Maximax Section Component
 */
export const MaximaxSection = () => {
  return (
    <>
      <Section id="maximax-header" padding="lg">
        <Heading level={1}>Maximax Criterion: The Optimist's Choice</Heading>
        <InteractiveParagraph className="text-lg text-muted-foreground mt-2">
          When you believe the best will happen, aim for the highest possible reward.
        </InteractiveParagraph>
      </Section>

      <Section id="maximax-concept" padding="md">
        <Heading level={2}>What is Maximax?</Heading>
        <InteractiveParagraph>
          The Maximax criterion is the choice of an{" "}
          <Hoverable tooltip="Someone who expects the most favorable outcome to occur and makes decisions accordingly.">
            optimist
          </Hoverable>
          . The name comes from "MAXimum of the MAXimums" — you look at the best possible outcome
          for each alternative and then pick the one with the highest best-case scenario.
        </InteractiveParagraph>
        <InteractiveParagraph>
          This approach makes sense when you believe that luck is on your side, or when the
          potential upside is so attractive that you're willing to accept higher risk.
        </InteractiveParagraph>
      </Section>

      <Section id="maximax-algorithm" padding="md">
        <Heading level={2}>How Maximax Works</Heading>
        <InteractiveParagraph>
          The algorithm is straightforward:
        </InteractiveParagraph>
        <ol className="list-decimal list-inside space-y-2 mt-4 ml-4">
          <li className="text-muted-foreground">
            <span className="text-foreground">For each alternative, find the maximum payoff</span> — the best outcome if everything goes perfectly.
          </li>
          <li className="text-muted-foreground">
            <span className="text-foreground">Compare these maximum payoffs across all alternatives</span>.
          </li>
          <li className="text-muted-foreground">
            <span className="text-foreground">Select the alternative with the highest maximum</span> — this is your Maximax choice.
          </li>
        </ol>
      </Section>

      <Section id="maximax-demo" padding="md">
        <Heading level={2}>Interactive Example</Heading>
        <InteractiveParagraph>
          Walk through each step to see how Maximax works with our product launch example.
          Click "Next Step" to progress through the decision process.
        </InteractiveParagraph>
        <div className="mt-6">
          <MaximaxDemo />
        </div>
      </Section>

      <Section id="maximax-pros-cons" padding="md">
        <Heading level={2}>When to Use Maximax</Heading>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Simple and easy to understand</li>
              <li>• Focuses on opportunity and growth</li>
              <li>• Good when upside potential is critical</li>
              <li>• Appropriate for risk-tolerant decision-makers</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-700 mb-2">Limitations</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Ignores possible losses and risks</li>
              <li>• May lead to overly risky decisions</li>
              <li>• Doesn't consider probability of outcomes</li>
              <li>• Not suitable for risk-averse situations</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
};

export default MaximaxSection;
