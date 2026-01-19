import { useState, useEffect } from "react";
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
  const [completed, setCompleted] = useState(false);
  const [animatingRow, setAnimatingRow] = useState(-1);
  const [scanningCol, setScanningCol] = useState(-1);
  const [scanningMinCol, setScanningMinCol] = useState(-1);
  const [showMinColumn, setShowMinColumn] = useState(false);
  const [revealedRows, setRevealedRows] = useState<number[]>([]);
  const [showFinalChoice, setShowFinalChoice] = useState(false);

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

  // Animation effect based on step
  useEffect(() => {
    if (step === 0) {
      // Step 1 instruction: Show original table
      setShowMinColumn(false);
      setRevealedRows([]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMinCol(-1);
      setShowFinalChoice(false);
    } else if (step === 1) {
      // Step 1 reveal: Animate finding min for each row
      setShowMinColumn(true);
      setRevealedRows([]);
      setScanningCol(-1);
      setShowFinalChoice(false);

      const animateRows = async () => {
        for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
          setAnimatingRow(rowIdx);

          // Scan through each column in the row
          for (let colIdx = 0; colIdx < statesOfNature.length; colIdx++) {
            setScanningCol(colIdx);
            await new Promise(resolve => setTimeout(resolve, 500));
          }

          // Highlight the min and move to column
          setScanningCol(-1);
          await new Promise(resolve => setTimeout(resolve, 600));
          setRevealedRows(prev => [...prev, rowIdx]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setAnimatingRow(-1);
      };

      animateRows();
    } else if (step === 2) {
      // Step 2 instruction: Show instruction for selecting max of min
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMinCol(-1);
      setShowFinalChoice(false);
    } else if (step === 3) {
      // Step 2 reveal: Animate scanning through min column and highlight the max
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setShowFinalChoice(false);

      const animateMinColumn = async () => {
        for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
          setScanningMinCol(rowIdx);
          await new Promise(resolve => setTimeout(resolve, 700));
        }
        // Keep the max highlighted after scanning
        setScanningMinCol(-1);
      };

      animateMinColumn();
    } else if (step === 4) {
      // Step 3 instruction: Show instruction for final decision
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMinCol(-1);
      setShowFinalChoice(false);
    } else if (step === 5) {
      // Step 3 reveal: Animate showing the final decision and auto-complete
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMinCol(-1);

      const showDecision = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowFinalChoice(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCompleted(true);
      };

      showDecision();
    }
  }, [step, alternatives.length, statesOfNature.length]);

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const value = payoffs[rowIndex][colIndex];
    const isMin = value === minPayoffs[rowIndex];
    const isMaximin = rowIndex === maximinIndex && isMin && showFinalChoice;
    const isCurrentRow = animatingRow === rowIndex;
    const isScanning = isCurrentRow && scanningCol === colIndex;
    const isFoundMin = isCurrentRow && scanningCol === -1 && isMin && !revealedRows.includes(rowIndex);

    if (step === 0) {
      return "bg-background";
    }

    if (step === 1) {
      // Currently scanning this cell
      if (isScanning) {
        return "bg-amber-100";
      }
      // Found the min, highlighting it before moving
      if (isFoundMin) {
        return "bg-green-200";
      }
      // Already revealed min
      if (isMin && revealedRows.includes(rowIndex)) {
        return "bg-green-100";
      }
    }

    if (step >= 2) {
      if (isMaximin) {
        return "bg-secondary/20";
      }
      if (isMin) {
        return "bg-green-100";
      }
    }

    return "bg-background";
  };

  const getRowStyle = (rowIndex: number) => {
    if (showFinalChoice && rowIndex === maximinIndex) {
      return "bg-secondary/5";
    }
    return "";
  };

  const getMinCellStyle = (rowIndex: number) => {
    // Scanning animation in step 3
    if (step === 3 && scanningMinCol === rowIndex) {
      return "bg-amber-100";
    }
    // Highlight the max after scanning completes (step >= 3 and scanning done) or in step 4+
    if (step === 3 && scanningMinCol === -1 && rowIndex === maximinIndex) {
      return "bg-secondary/20";
    }
    if (step >= 4 && rowIndex === maximinIndex) {
      return "bg-secondary/20";
    }
    return "";
  };

  // Visual step mapping: steps 0,1 = "Step 1", steps 2,3 = "Step 2", step 4,5 = "Step 3"
  const visualStep = step <= 1 ? 0 : step <= 3 ? 1 : 2;
  const visualSteps = [
    {
      title: "Step 1: Find the Minimum Payoff for Each Alternative",
      description: "For each row (alternative), identify the worst possible outcome — the lowest payoff that could happen if things go badly.",
    },
    {
      title: "Step 2: Select the Maximum of the Min Payoffs",
      description: "Look at the Min Payoff column and find the highest value among all the minimum payoffs.",
    },
    {
      title: "Step 3: Make the Maximin Decision",
      description: "The alternative with the highest minimum payoff is the Maximin choice. This is the pessimist's decision!",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {visualSteps.map((s, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2",
              i <= visualStep || completed ? "text-secondary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                i < visualStep || (completed && i <= visualStep) ? "bg-secondary text-secondary-foreground border-secondary" :
                i === visualStep ? "border-secondary text-secondary" :
                "border-muted-foreground/30"
              )}
            >
              {i + 1}
            </div>
            {i < visualSteps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Current step info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {showFinalChoice && <Shield className="w-5 h-5 text-secondary" />}
          {visualSteps[visualStep].title}
        </h3>
        <p className="text-muted-foreground mt-1">{visualSteps[visualStep].description}</p>
      </div>

      {/* Decision Matrix with highlighting */}
      <div className="overflow-hidden">
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
              {showMinColumn && (
                <TableHead
                  className="text-center font-bold border-l-2 border-secondary/50 bg-secondary/5 animate-in fade-in slide-in-from-right-4 duration-300"
                >
                  Min Payoff
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
                {showMinColumn && (
                  <TableCell
                    className={cn(
                      "text-center border-l-2 border-secondary/50 font-bold transition-colors duration-300",
                      getMinCellStyle(rowIndex)
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
                        ${minPayoffs[rowIndex]}k
                      </span>
                      {showFinalChoice && rowIndex === maximinIndex && (
                        <span className="text-xs text-secondary">← Best!</span>
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
      {showFinalChoice && (
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
          onClick={() => setStep(step + 1)}
          disabled={completed || step === 5}
          className="gap-2"
        >
          {completed ? "Completed" : step === 0 || step === 2 || step === 4 ? "Reveal" : "Next Step"}
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
