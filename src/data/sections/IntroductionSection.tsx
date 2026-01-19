import { useState } from "react";
import { Section } from "@/components/templates";
import { Heading } from "@/components/molecules/Heading";
import { InteractiveParagraph } from "@/components/molecules/InteractiveParagraph";
import { Hoverable } from "@/components/annotations/Hoverable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { cn } from "@/lib/utils";

interface CellHighlight {
  row: number | null;
  col: number | null;
  type: "row" | "col" | "cell" | null;
}

/**
 * Interactive Decision Matrix component for the Introduction section
 */
const InteractiveDecisionMatrix = () => {
  const [highlight, setHighlight] = useState<CellHighlight>({ row: null, col: null, type: null });
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const alternatives = ["Launch Product A", "Launch Product B", "Launch Product C"];
  const statesOfNature = ["High Demand", "Medium Demand", "Low Demand"];
  const payoffs = [
    [200, 100, -50],
    [150, 120, 30],
    [80, 80, 80],
  ];

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const getCellStyle = (row: number, col: number) => {
    const isHighlightedRow = highlight.type === "row" && highlight.row === row;
    const isHighlightedCol = highlight.type === "col" && highlight.col === col;
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    return cn(
      "transition-all duration-200 cursor-pointer text-center font-medium",
      isHighlightedRow && "bg-primary/20",
      isHighlightedCol && "bg-secondary/30",
      isSelected && "ring-2 ring-primary bg-primary/30",
      !isHighlightedRow && !isHighlightedCol && !isSelected && "hover:bg-muted/50"
    );
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table className="border border-border rounded-lg">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-foreground border-r border-border">
                Alternatives / States
              </TableHead>
              {statesOfNature.map((state, colIndex) => (
                <TableHead
                  key={state}
                  className={cn(
                    "text-center font-semibold cursor-pointer transition-colors",
                    highlight.type === "col" && highlight.col === colIndex
                      ? "bg-secondary/30 text-secondary-foreground"
                      : "hover:bg-muted/50"
                  )}
                  onMouseEnter={() => setHighlight({ row: null, col: colIndex, type: "col" })}
                  onMouseLeave={() => setHighlight({ row: null, col: null, type: null })}
                >
                  <span className="text-muted-foreground text-xs block mb-1">State {colIndex + 1}</span>
                  {state}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alt, rowIndex) => (
              <TableRow key={alt}>
                <TableCell
                  className={cn(
                    "font-medium border-r border-border cursor-pointer transition-colors",
                    highlight.type === "row" && highlight.row === rowIndex
                      ? "bg-primary/20"
                      : "hover:bg-muted/50"
                  )}
                  onMouseEnter={() => setHighlight({ row: rowIndex, col: null, type: "row" })}
                  onMouseLeave={() => setHighlight({ row: null, col: null, type: null })}
                >
                  <span className="text-muted-foreground text-xs block mb-1">Alternative {rowIndex + 1}</span>
                  {alt}
                </TableCell>
                {payoffs[rowIndex].map((payoff, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={getCellStyle(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <span className={cn(
                      "text-lg",
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

      {/* Explanation panel */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        {selectedCell ? (
          <div className="space-y-2">
            <p className="font-semibold text-primary">
              Selected: {alternatives[selectedCell.row]} under {statesOfNature[selectedCell.col]}
            </p>
            <p className="text-muted-foreground">
              If you choose <strong>{alternatives[selectedCell.row]}</strong> and the market turns out to have{" "}
              <strong>{statesOfNature[selectedCell.col].toLowerCase()}</strong>, your expected profit would be{" "}
              <strong className={payoffs[selectedCell.row][selectedCell.col] >= 0 ? "text-green-600" : "text-red-500"}>
                ${payoffs[selectedCell.row][selectedCell.col]}k
              </strong>.
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            Click on any cell in the matrix to see what that payoff means in context.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Introduction to Decision Theory Section
 */
export const IntroductionSection = () => {
  return (
    <>
      <Section id="intro-header" padding="lg">
        <Heading level={1}>Decision Theory: Making Choices Under Uncertainty</Heading>
        <InteractiveParagraph className="text-lg text-muted-foreground mt-2">
          Learn how to make rational decisions when the future is uncertain.
        </InteractiveParagraph>
      </Section>

      <Section id="intro-what-is-decision-theory" padding="md">
        <Heading level={2}>What is Decision-Making Under Uncertainty?</Heading>
        <InteractiveParagraph>
          Imagine you're a business owner deciding which product to launch. You don't know for certain
          whether the market will be favorable or not. This is a classic example of{" "}
          <Hoverable tooltip="A situation where you must choose an action without knowing which outcome will actually occur.">
            decision-making under uncertainty
          </Hoverable>. Unlike decisions where outcomes are certain, here we must consider multiple
          possible futures.
        </InteractiveParagraph>
      </Section>

      <Section id="intro-key-concepts" padding="md">
        <Heading level={2}>The Three Key Concepts</Heading>
        <InteractiveParagraph>
          Every decision problem under uncertainty has three essential components:
        </InteractiveParagraph>

        <div className="grid gap-4 mt-4 md:grid-cols-3">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-primary mb-2">1. Alternatives</h3>
            <p className="text-sm text-muted-foreground">
              The different choices or actions available to the decision-maker. These are the options
              you can choose from.
            </p>
            <p className="text-xs mt-2 italic text-muted-foreground">
              Example: Launch Product A, B, or C
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-secondary mb-2">2. States of Nature</h3>
            <p className="text-sm text-muted-foreground">
              The possible future scenarios that could occur. These are outside your control and
              uncertain.
            </p>
            <p className="text-xs mt-2 italic text-muted-foreground">
              Example: High, Medium, or Low market demand
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">3. Payoffs</h3>
            <p className="text-sm text-muted-foreground">
              The outcomes (usually profits or losses) that result from each combination of
              alternative and state of nature.
            </p>
            <p className="text-xs mt-2 italic text-muted-foreground">
              Example: $200k profit if Product A meets high demand
            </p>
          </div>
        </div>
      </Section>

      <Section id="intro-decision-matrix" padding="md">
        <Heading level={2}>The Decision Matrix (Payoff Table)</Heading>
        <InteractiveParagraph>
          We organize all this information in a{" "}
          <Hoverable tooltip="A table that shows the payoff for each combination of alternative and state of nature. Rows represent alternatives, columns represent states of nature.">
            decision matrix
          </Hoverable>{" "}
          (also called a payoff table). Each row represents an alternative, each column represents a
          state of nature, and each cell contains the payoff for that combination.
        </InteractiveParagraph>

        <div className="mt-6">
          <InteractiveDecisionMatrix />
        </div>

        <InteractiveParagraph className="mt-4">
          <strong>Try it:</strong> Hover over the row headers to highlight all payoffs for an
          alternative. Hover over column headers to see outcomes under a specific state of nature.
          Click any cell to learn more about that specific scenario.
        </InteractiveParagraph>
      </Section>

      <Section id="intro-challenge" padding="md">
        <Heading level={2}>The Challenge: Which Alternative Should You Choose?</Heading>
        <InteractiveParagraph enableMath={false}>
          Looking at the matrix above, which product would you launch? Product A could give you the highest profit ($200k), but it could also result in a loss (−$50k). Product C guarantees $80k regardless of what happens, but you might be leaving money on the table.
        </InteractiveParagraph>
        <InteractiveParagraph>
          Different decision criteria lead to different choices. In the following sections, we'll
          explore three popular approaches:{" "}
          <Hoverable tooltip="Choose the alternative with the best possible outcome (optimistic approach).">
            Maximax
          </Hoverable>
          ,{" "}
          <Hoverable tooltip="Choose the alternative with the best worst-case outcome (pessimistic approach).">
            Maximin
          </Hoverable>
          , and{" "}
          <Hoverable tooltip="Minimize the maximum regret you could experience (opportunity cost approach).">
            Minimax Regret
          </Hoverable>
          .
        </InteractiveParagraph>
      </Section>
    </>
  );
};

export default IntroductionSection;
