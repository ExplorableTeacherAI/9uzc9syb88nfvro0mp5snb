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
  const [scanningMaxCol, setScanningMaxCol] = useState(-1);
  const [showMaxColumn, setShowMaxColumn] = useState(false);
  const [revealedRows, setRevealedRows] = useState<number[]>([]);
  const [showFinalChoice, setShowFinalChoice] = useState(false);

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

  // Animation effect based on step
  useEffect(() => {
    if (step === 0) {
      // Step 1 instruction: Show original table
      setShowMaxColumn(false);
      setRevealedRows([]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMaxCol(-1);
      setShowFinalChoice(false);
    } else if (step === 1) {
      // Step 1 reveal: Animate finding max for each row
      setShowMaxColumn(true);
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

          // Highlight the max and move to column
          setScanningCol(-1);
          await new Promise(resolve => setTimeout(resolve, 600));
          setRevealedRows(prev => [...prev, rowIdx]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setAnimatingRow(-1);
      };

      animateRows();
    } else if (step === 2) {
      // Step 2 instruction: Show instruction for selecting max of max
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMaxCol(-1);
      setShowFinalChoice(false);
    } else if (step === 3) {
      // Step 2 reveal: Animate scanning through max column and highlight the max
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setShowFinalChoice(false);

      const animateMaxColumn = async () => {
        for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
          setScanningMaxCol(rowIdx);
          await new Promise(resolve => setTimeout(resolve, 700));
        }
        // Keep the max highlighted after scanning
        setScanningMaxCol(-1);
      };

      animateMaxColumn();
    } else if (step === 4) {
      // Step 3 instruction: Show instruction for final decision
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMaxCol(-1);
      setShowFinalChoice(false);
    } else if (step === 5) {
      // Step 3 reveal: Animate showing the final decision and auto-complete
      setRevealedRows([0, 1, 2]);
      setScanningCol(-1);
      setAnimatingRow(-1);
      setScanningMaxCol(-1);

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
    const isMax = value === maxPayoffs[rowIndex];
    const isMaximax = rowIndex === maximaxIndex && isMax && showFinalChoice;
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

    if (step >= 2) {
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
    if (showFinalChoice && rowIndex === maximaxIndex) {
      return "bg-primary/5";
    }
    return "";
  };

  const getMaxCellStyle = (rowIndex: number) => {
    // Scanning animation in step 3
    if (step === 3 && scanningMaxCol === rowIndex) {
      return "bg-amber-100";
    }
    // Highlight the max after scanning completes (step >= 3 and scanning done) or in step 4+
    if (step === 3 && scanningMaxCol === -1 && rowIndex === maximaxIndex) {
      return "bg-primary/20";
    }
    if (step >= 4 && rowIndex === maximaxIndex) {
      return "bg-primary/20";
    }
    return "";
  };

  // Visual step mapping: steps 0,1 = "Step 1", steps 2,3 = "Step 2", step 4 = "Step 3"
  const visualStep = step <= 1 ? 0 : step <= 3 ? 1 : 2;
  const visualSteps = [
    {
      title: "Step 1: Find the Maximum Payoff for Each Alternative",
      description: "For each row (alternative), identify the best possible outcome — the highest payoff you could achieve if the most favorable state occurs.",
    },
    {
      title: "Step 2: Select the Maximum of the Max Payoffs",
      description: "Look at the Max Payoff column and find the highest value among all the maximum payoffs.",
    },
    {
      title: "Step 3: Make the Maximax Decision",
      description: "The alternative with the highest maximum payoff is the Maximax choice. This is the optimist's decision!",
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
              i <= visualStep || completed ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                i < visualStep || (completed && i <= visualStep) ? "bg-primary text-primary-foreground border-primary" :
                i === visualStep ? "border-primary text-primary" :
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
          {showFinalChoice && <Sparkles className="w-5 h-5 text-primary" />}
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
                      getMaxCellStyle(rowIndex)
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
                      {showFinalChoice && rowIndex === maximaxIndex && (
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
      {showFinalChoice && (
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
          . The name comes from "<strong>MAXI</strong>mum of the <strong>MAX</strong>imums" — you look at the best possible outcome for each alternative and then pick the one with the highest best-case scenario. In other words, you're asking yourself: "What's the absolute best that could happen with each choice?" and then going for the one with the biggest upside. This approach makes sense when you believe that luck is on your side, or when the potential upside is so attractive that you're willing to accept higher risk. It's the mindset of entrepreneurs and risk-takers who focus on opportunities rather than threats.
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

    </>
  );
};

export default MaximaxSection;
