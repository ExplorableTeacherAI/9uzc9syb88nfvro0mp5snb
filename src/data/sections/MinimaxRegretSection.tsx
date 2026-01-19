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
 * Interactive Minimax Regret Demonstration
 */
const MinimaxRegretDemo = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [scanningCol, setScanningCol] = useState(-1);
  const [scanningRow, setScanningRow] = useState(-1);
  const [showBestRow, setShowBestRow] = useState(false);
  const [revealedBestCols, setRevealedBestCols] = useState<number[]>([]);
  const [showRegretMatrix, setShowRegretMatrix] = useState(false);
  const [animatingRegretRow, setAnimatingRegretRow] = useState(-1);
  const [scanningRegretCol, setScanningRegretCol] = useState(-1);
  const [showMaxRegretColumn, setShowMaxRegretColumn] = useState(false);
  const [revealedMaxRegretRows, setRevealedMaxRegretRows] = useState<number[]>([]);
  const [scanningMaxRegretRow, setScanningMaxRegretRow] = useState(-1);
  const [showFinalChoice, setShowFinalChoice] = useState(false);
  // New state for regret calculation animation
  const [calculatingRegretCell, setCalculatingRegretCell] = useState<{row: number, col: number} | null>(null);
  const [calculationPhase, setCalculationPhase] = useState<'none' | 'best' | 'minus' | 'payoff' | 'equals' | 'result'>('none');
  const [revealedRegretCells, setRevealedRegretCells] = useState<string[]>([]);

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

  // Animation effect based on step
  useEffect(() => {
    if (step === 0) {
      // Step 1 instruction: Show original payoff table
      setShowBestRow(false);
      setRevealedBestCols([]);
      setScanningCol(-1);
      setScanningRow(-1);
      setShowRegretMatrix(false);
      setShowMaxRegretColumn(false);
      setRevealedMaxRegretRows([]);
      setAnimatingRegretRow(-1);
      setScanningRegretCol(-1);
      setScanningMaxRegretRow(-1);
      setShowFinalChoice(false);
      setCalculatingRegretCell(null);
      setCalculationPhase('none');
      setRevealedRegretCells([]);
    } else if (step === 1) {
      // Step 1 reveal: Animate finding best in each column
      setShowBestRow(true);
      setRevealedBestCols([]);
      setShowFinalChoice(false);

      const animateCols = async () => {
        for (let colIdx = 0; colIdx < statesOfNature.length; colIdx++) {
          // Scan through each row in the column
          for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
            setScanningCol(colIdx);
            setScanningRow(rowIdx);
            await new Promise(resolve => setTimeout(resolve, 500));
          }

          // Highlight the best and reveal
          setScanningRow(-1);
          await new Promise(resolve => setTimeout(resolve, 600));
          setRevealedBestCols(prev => [...prev, colIdx]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setScanningCol(-1);
      };

      animateCols();
    } else if (step === 2) {
      // Step 2 instruction: Show instruction for regret calculation
      setRevealedBestCols([0, 1, 2]);
      setScanningCol(-1);
      setScanningRow(-1);
      setShowRegretMatrix(false);
      setShowFinalChoice(false);
      setRevealedRegretCells([]);
    } else if (step === 3) {
      // Step 2 reveal: Animate regret calculation column by column
      setRevealedBestCols([0, 1, 2]);
      setShowRegretMatrix(false);
      setShowMaxRegretColumn(false);
      setRevealedMaxRegretRows([]);
      setShowFinalChoice(false);
      setRevealedRegretCells([]);

      const animateRegretCalculation = async () => {
        // Go column by column
        for (let colIdx = 0; colIdx < statesOfNature.length; colIdx++) {
          for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
            // Highlight current cell
            setCalculatingRegretCell({ row: rowIdx, col: colIdx });
            setCalculationPhase('none');
            await new Promise(resolve => setTimeout(resolve, 300));

            // Typing effect: show best value
            setCalculationPhase('best');
            await new Promise(resolve => setTimeout(resolve, 400));

            // Typing effect: show minus
            setCalculationPhase('minus');
            await new Promise(resolve => setTimeout(resolve, 300));

            // Typing effect: show payoff
            setCalculationPhase('payoff');
            await new Promise(resolve => setTimeout(resolve, 400));

            // Typing effect: show equals
            setCalculationPhase('equals');
            await new Promise(resolve => setTimeout(resolve, 300));

            // Typing effect: show result
            setCalculationPhase('result');
            await new Promise(resolve => setTimeout(resolve, 600));

            // Reveal the regret value
            setRevealedRegretCells(prev => [...prev, `${rowIdx}-${colIdx}`]);
            setCalculationPhase('none');
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        setCalculatingRegretCell(null);
      };

      animateRegretCalculation();
    } else if (step === 4) {
      // Step 3 instruction: Show instruction for finding max regret
      setShowRegretMatrix(true);
      setShowMaxRegretColumn(false);
      setRevealedMaxRegretRows([]);
      setShowFinalChoice(false);
    } else if (step === 5) {
      // Step 3 reveal: Animate finding max regret for each row
      setShowMaxRegretColumn(true);
      setRevealedMaxRegretRows([]);
      setShowFinalChoice(false);

      const animateRows = async () => {
        for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
          setAnimatingRegretRow(rowIdx);

          // Scan through each column in the row
          for (let colIdx = 0; colIdx < statesOfNature.length; colIdx++) {
            setScanningRegretCol(colIdx);
            await new Promise(resolve => setTimeout(resolve, 500));
          }

          // Highlight the max and move to column
          setScanningRegretCol(-1);
          await new Promise(resolve => setTimeout(resolve, 600));
          setRevealedMaxRegretRows(prev => [...prev, rowIdx]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setAnimatingRegretRow(-1);
      };

      animateRows();
    } else if (step === 6) {
      // Step 4 instruction: Show instruction for selecting min of max regrets
      setRevealedMaxRegretRows([0, 1, 2]);
      setScanningRegretCol(-1);
      setAnimatingRegretRow(-1);
      setScanningMaxRegretRow(-1);
      setShowFinalChoice(false);
    } else if (step === 7) {
      // Step 4 reveal: Animate scanning through max regret column
      setRevealedMaxRegretRows([0, 1, 2]);
      setShowFinalChoice(false);

      const animateMaxRegretColumn = async () => {
        for (let rowIdx = 0; rowIdx < alternatives.length; rowIdx++) {
          setScanningMaxRegretRow(rowIdx);
          await new Promise(resolve => setTimeout(resolve, 700));
        }
        setScanningMaxRegretRow(-1);
      };

      animateMaxRegretColumn();
    } else if (step === 8) {
      // Step 5 instruction: Show instruction for final decision
      setRevealedMaxRegretRows([0, 1, 2]);
      setScanningMaxRegretRow(-1);
      setShowFinalChoice(false);
    } else if (step === 9) {
      // Step 5 reveal: Show final decision and auto-complete
      setRevealedMaxRegretRows([0, 1, 2]);
      setScanningMaxRegretRow(-1);

      const showDecision = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowFinalChoice(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCompleted(true);
      };

      showDecision();
    }
  }, [step, alternatives.length, statesOfNature.length]);

  const getPayoffCellStyle = (rowIndex: number, colIndex: number) => {
    const isBestInColumn = payoffs[rowIndex][colIndex] === bestInColumn[colIndex];
    const isScanning = scanningCol === colIndex && scanningRow === rowIndex;
    const isFoundBest = scanningCol === colIndex && scanningRow === -1 && isBestInColumn && !revealedBestCols.includes(colIndex);

    if (step === 0) {
      return "bg-background";
    }

    if (step === 1) {
      if (isScanning) {
        return "bg-amber-100";
      }
      if (isFoundBest) {
        return "bg-green-200";
      }
      if (isBestInColumn && revealedBestCols.includes(colIndex)) {
        return "bg-green-100";
      }
    }

    // Step 2 and 3: Keep best in column highlighted
    if (step >= 2 && isBestInColumn) {
      return "bg-green-100";
    }

    return "bg-background";
  };

  // Get cell content for payoff matrix (shows calculation during step 3)
  const getPayoffCellContent = (rowIndex: number, colIndex: number) => {
    const payoff = payoffs[rowIndex][colIndex];
    const best = bestInColumn[colIndex];
    const regret = regretMatrix[rowIndex][colIndex];
    const isCalculating = calculatingRegretCell?.row === rowIndex && calculatingRegretCell?.col === colIndex;
    const isRegretRevealed = revealedRegretCells.includes(`${rowIndex}-${colIndex}`);

    // During step 3 animation
    if (step === 3) {
      if (isCalculating && calculationPhase !== 'none') {
        // Show the typing calculation formula
        return (
          <div className="flex flex-col items-center min-h-[48px] justify-center">
            <span className="text-sm text-muted-foreground font-mono">
              {calculationPhase === 'best' && <>{best}<span className="animate-pulse">|</span></>}
              {calculationPhase === 'minus' && <>{best} -<span className="animate-pulse">|</span></>}
              {calculationPhase === 'payoff' && <>{best} - {payoff}<span className="animate-pulse">|</span></>}
              {calculationPhase === 'equals' && <>{best} - {payoff} =<span className="animate-pulse">|</span></>}
              {calculationPhase === 'result' && <>{best} - {payoff} =</>}
            </span>
            {calculationPhase === 'result' && (
              <span className="text-lg font-bold text-green-600 animate-in fade-in">{regret}</span>
            )}
          </div>
        );
      }
      if (isRegretRevealed) {
        // Show regret value
        return <span className="text-lg font-medium">{regret}</span>;
      }
    }

    // After step 3: show regret values
    if (step >= 4) {
      return <span className="text-lg font-medium">{regret}</span>;
    }

    // Default: show payoff
    return <span className="text-lg font-medium">${payoff}k</span>;
  };

  const getRegretCellStyle = (rowIndex: number, colIndex: number) => {
    const regret = regretMatrix[rowIndex][colIndex];
    const isMaxRegret = regret === maxRegrets[rowIndex];
    const isCurrentRow = animatingRegretRow === rowIndex;
    const isScanning = isCurrentRow && scanningRegretCol === colIndex;
    const isFoundMax = isCurrentRow && scanningRegretCol === -1 && isMaxRegret && !revealedMaxRegretRows.includes(rowIndex);

    if (step === 5) {
      if (isScanning) {
        return "bg-amber-100";
      }
      if (isFoundMax) {
        return "bg-green-200";
      }
      if (isMaxRegret && revealedMaxRegretRows.includes(rowIndex)) {
        return "bg-green-100";
      }
    }

    if (step >= 6) {
      if (showFinalChoice && rowIndex === minimaxIndex && isMaxRegret) {
        return "bg-primary/20";
      }
      if (isMaxRegret) {
        return "bg-green-100";
      }
    }

    return "bg-background";
  };

  const getRowStyle = (rowIndex: number) => {
    if (showFinalChoice && rowIndex === minimaxIndex) {
      return "bg-primary/5";
    }
    return "";
  };

  const getMaxRegretCellStyle = (rowIndex: number) => {
    // Scanning animation in step 7
    if (step === 7 && scanningMaxRegretRow === rowIndex) {
      return "bg-amber-100";
    }
    // Highlight the min after scanning completes (step >= 7 and scanning done) or in step 8+
    if (step === 7 && scanningMaxRegretRow === -1 && rowIndex === minimaxIndex) {
      return "bg-primary/20";
    }
    if (step >= 8 && rowIndex === minimaxIndex) {
      return "bg-primary/20";
    }
    return "";
  };

  // Visual step mapping: steps 0,1 = "Step 1", steps 2,3 = "Step 2", steps 4,5 = "Step 3", steps 6,7 = "Step 4", steps 8,9 = "Step 5"
  const visualStep = step <= 1 ? 0 : step <= 3 ? 1 : step <= 5 ? 2 : step <= 7 ? 3 : 4;
  const visualSteps = [
    {
      title: "Step 1: Find the Best Payoff in Each Column",
      description: "For each state of nature (column), identify the highest payoff — the best you could do if you knew that state would occur.",
    },
    {
      title: "Step 2: Calculate the Regret Matrix",
      description: "For each cell, calculate regret = (best in column) - (cell value). Regret represents the 'opportunity cost' of not choosing the best option for that state.",
    },
    {
      title: "Step 3: Find Maximum Regret for Each Alternative",
      description: "For each alternative (row), find the maximum regret — the worst 'missed opportunity' you could experience.",
    },
    {
      title: "Step 4: Select the Minimum of Maximum Regrets",
      description: "Look at the Max Regret column and find the smallest value among all the maximum regrets.",
    },
    {
      title: "Step 5: Make the Minimax Regret Decision",
      description: "The alternative with the smallest maximum regret is the Minimax Regret choice. This minimizes your worst-case 'what if' feeling!",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
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

      {/* Matrices container */}
      <div className="space-y-6">
        {/* Payoff Matrix */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">
            {step === 3 && revealedRegretCells.length > 0
              ? "Calculating Regret Values..."
              : step >= 4
              ? "Regret Matrix"
              : "Payoff Matrix"}
          </h4>
          <div className="overflow-hidden">
            <Table className="border border-border rounded-lg">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold text-foreground border-r border-border">Alternatives</TableHead>
                  {statesOfNature.map((state) => (
                    <TableHead key={state} className="text-center font-semibold">{state}</TableHead>
                  ))}
                  {showMaxRegretColumn && (
                    <TableHead
                      className="text-center font-bold border-l-2 border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                      Max Regret
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alternatives.map((alt, rowIndex) => (
                  <TableRow key={alt} className={getRowStyle(rowIndex)}>
                    <TableCell className="font-medium border-r border-border">{alt}</TableCell>
                    {payoffs[rowIndex].map((payoff, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={cn(
                          "text-center transition-colors duration-300",
                          getPayoffCellStyle(rowIndex, colIndex),
                          step >= 5 && getRegretCellStyle(rowIndex, colIndex)
                        )}
                      >
                        {getPayoffCellContent(rowIndex, colIndex)}
                      </TableCell>
                    ))}
                    {showMaxRegretColumn && (
                      <TableCell
                        className={cn(
                          "text-center border-l-2 border-primary/50 font-bold transition-colors duration-300",
                          getMaxRegretCellStyle(rowIndex)
                        )}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={cn(
                              "text-green-600 transition-opacity duration-500",
                              revealedMaxRegretRows.includes(rowIndex) ? "opacity-100" : "opacity-0"
                            )}
                          >
                            {maxRegrets[rowIndex]}
                          </span>
                          {showFinalChoice && rowIndex === minimaxIndex && (
                            <span className="text-xs text-primary">← Min!</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {/* Best in column row */}
                {showBestRow && step < 4 && (
                  <TableRow className="bg-primary/5 border-t-2 border-primary/50">
                    <TableCell className="font-bold text-primary border-r border-border">
                      Best in Column
                    </TableCell>
                    {bestInColumn.map((best, colIndex) => (
                      <TableCell key={colIndex} className="text-center">
                        <span
                          className={cn(
                            "font-bold text-green-600 transition-opacity duration-500",
                            revealedBestCols.includes(colIndex) ? "opacity-100" : "opacity-0"
                          )}
                        >
                          ${best}k
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>

      {/* Result box */}
      {showFinalChoice && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-semibold text-primary">
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
          disabled={completed || step === 9}
          className="gap-2"
        >
          {completed ? "Completed" : step === 0 || step === 2 || step === 4 || step === 6 || step === 8 ? "Reveal" : "Next Step"}
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
          Before we dive into Minimax Regret, let's understand what{" "}
          <Hoverable tooltip="The difference between what you actually got and what you could have gotten if you had made the best choice for that particular outcome.">
            regret
          </Hoverable>{" "}
          means in decision theory. Regret (also called opportunity cost) measures the "what if" feeling — it's the gap between what you actually got and what you could have gotten if you had made the best choice for that particular outcome. Here's a concrete example: suppose you chose Product B and the market turned out to have high demand. You'd earn <strong>$150k</strong>. But looking back, if you had chosen Product A instead, you would have earned <strong>$200k</strong>. That difference — <strong>$200k − $150k = $50k</strong> — is your regret. It's not a loss in the traditional sense, but it represents the missed opportunity you'll think about every time you wonder "what if?"
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

    </>
  );
};

export default MinimaxRegretSection;
