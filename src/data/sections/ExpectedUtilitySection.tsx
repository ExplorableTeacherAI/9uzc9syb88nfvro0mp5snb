import { useState, useMemo } from "react";
import { Section } from "@/components/templates";
import { Heading } from "@/components/molecules/Heading";
import { InteractiveParagraph } from "@/components/molecules/InteractiveParagraph";
import { Hoverable } from "@/components/annotations/Hoverable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { InlineStepper } from "@/components/atoms/InlineStepper";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface SectionContentProps {
  isPreview?: boolean;
  onEditSection?: (instruction: string) => void;
}

/**
 * Interactive Expected Utility Calculator with inline probability controls
 */
interface ExpectedUtilityCalculatorProps {
  probabilities: number[];
}

const ExpectedUtilityCalculator = ({ probabilities }: ExpectedUtilityCalculatorProps) => {
  const alternatives = ["Product A", "Product B", "Product C"];
  const statesOfNature = ["High Demand", "Medium Demand", "Low Demand"];
  const payoffs = [
    [200, 100, -50],
    [150, 120, 30],
    [80, 80, 80],
  ];

  // Calculate expected utility for each alternative
  const expectedUtilities = useMemo(() => {
    return payoffs.map(row =>
      row.reduce((sum, payoff, colIndex) => sum + payoff * probabilities[colIndex], 0)
    );
  }, [probabilities]);

  // Find the best alternative
  const bestIndex = useMemo(() => {
    return expectedUtilities.indexOf(Math.max(...expectedUtilities));
  }, [expectedUtilities]);

  return (
    <div className="space-y-6">

      {/* Expected Utility Table */}
      <div className="overflow-x-auto">
        <Table className="border border-border rounded-lg">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-foreground border-r border-border">
                Alternatives
              </TableHead>
              {statesOfNature.map((state, colIndex) => (
                <TableHead key={state} className="text-center">
                  <div className="flex flex-col">
                    <span className="font-semibold">{state}</span>
                    <span className="text-xs text-primary font-bold">
                      P = {(probabilities[colIndex] * 100).toFixed(0)}%
                    </span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-center font-bold border-l-2 border-primary/50 bg-primary/5">
                <div className="flex flex-col">
                  <span>Expected</span>
                  <span>Utility</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alt, rowIndex) => (
              <TableRow
                key={alt}
                className={cn(
                  "transition-colors duration-300",
                  rowIndex === bestIndex && "bg-primary/5"
                )}
              >
                <TableCell className="font-medium border-r border-border">
                  {alt}
                  {rowIndex === bestIndex && (
                    <span className="ml-2 text-xs text-primary font-bold">★ Best</span>
                  )}
                </TableCell>
                {payoffs[rowIndex].map((payoff, colIndex) => (
                  <TableCell key={colIndex} className="text-center">
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">${payoff}k</span>
                      <span className="text-xs text-muted-foreground">
                        × {(probabilities[colIndex] * 100).toFixed(0)}% = {(payoff * probabilities[colIndex]).toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  className={cn(
                    "text-center border-l-2 border-primary/50 font-bold text-lg transition-all duration-300",
                    rowIndex === bestIndex ? "bg-primary/20 text-primary" : "text-foreground"
                  )}
                >
                  ${expectedUtilities[rowIndex].toFixed(1)}k
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Result Explanation */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <p className="font-semibold text-primary flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Optimal Decision: {alternatives[bestIndex]}
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          With your current probability beliefs, <strong>{alternatives[bestIndex]}</strong> has the highest
          expected utility of <strong>${expectedUtilities[bestIndex].toFixed(1)}k</strong>.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          <em>Try adjusting the probabilities in the paragraph to see how your optimal choice changes!</em>
        </p>
      </div>

      {/* Formula Display */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <h4 className="font-semibold mb-2">Calculation for {alternatives[bestIndex]}:</h4>
        <p className="font-mono text-sm">
          EU = {payoffs[bestIndex].map((payoff, i) =>
            `(${payoff} × ${(probabilities[i] * 100).toFixed(0)}%)`
          ).join(" + ")}
        </p>
        <p className="font-mono text-sm mt-1">
          EU = {payoffs[bestIndex].map((payoff, i) =>
            (payoff * probabilities[i]).toFixed(1)
          ).join(" + ")} = <strong>${expectedUtilities[bestIndex].toFixed(1)}k</strong>
        </p>
      </div>
    </div>
  );
};

/**
 * Expected Utility Section Component
 */
export const ExpectedUtilitySection = ({ isPreview, onEditSection }: SectionContentProps) => {
  // State for probabilities (stored as percentages 0-100)
  const [highDemand, setHighDemand] = useState(33);
  const [mediumDemand, setMediumDemand] = useState(34);
  const [lowDemand, setLowDemand] = useState(33);

  // Convert to decimal probabilities for calculations
  const total = highDemand + mediumDemand + lowDemand;
  const probabilities = total > 0
    ? [highDemand / total, mediumDemand / total, lowDemand / total]
    : [0.33, 0.34, 0.33];

  return (
    <>
      <Section id="expected-utility-header" padding="lg" isPreview={isPreview} onEditSection={onEditSection}>
        <Heading level={1}>Maximizing Expected Utility</Heading>
        <InteractiveParagraph className="text-lg text-muted-foreground mt-2">
          When you have probability information, make decisions that maximize your expected outcome.
        </InteractiveParagraph>
      </Section>

      <Section id="expected-utility-intro" padding="md" isPreview={isPreview} onEditSection={onEditSection}>
        <Heading level={2}>From Uncertainty to Risk</Heading>
        <InteractiveParagraph>
          So far, we've explored decision criteria that assume we have <strong>no information</strong> about
          which state of nature is more likely. But what if you <em>do</em> have some probability estimates?
          Perhaps market research suggests there's a 50% chance of high demand, 30% chance of medium demand,
          and 20% chance of low demand. This is called decision-making under{" "}
          <Hoverable tooltip="A situation where the probabilities of different outcomes are known or can be estimated, unlike pure uncertainty where probabilities are unknown.">
            risk
          </Hoverable>{" "}(as opposed to uncertainty), and it allows us to use a powerful tool: <strong>Expected Utility</strong>.
        </InteractiveParagraph>
      </Section>

      <Section id="expected-utility-formula" padding="md" isPreview={isPreview} onEditSection={onEditSection}>
        <Heading level={2}>The Expected Utility Formula</Heading>
        <InteractiveParagraph>
          <Hoverable tooltip="The weighted average of all possible payoffs, where each payoff is weighted by its probability of occurring.">
            Expected Utility (EU)
          </Hoverable>{" "}
          is calculated by multiplying each possible payoff by its probability and summing up the results:
        </InteractiveParagraph>

        <div className="bg-card border border-border rounded-lg p-6 my-6 text-center">
          <p className="text-xl font-semibold mb-2">
            EU(Alternative) = Σ (Probability × Payoff)
          </p>
          <p className="text-muted-foreground text-sm">
            For each state of nature, multiply the payoff by its probability, then add them all together.
          </p>
        </div>

        <InteractiveParagraph>
          The alternative with the <strong>highest expected utility</strong> is considered the rational choice
          when you have probability information. This approach balances both the magnitude of payoffs and
          how likely each outcome is to occur.
        </InteractiveParagraph>
      </Section>

      <Section id="expected-utility-example" padding="md" isPreview={isPreview} onEditSection={onEditSection}>
        <Heading level={2}>A Quick Example</Heading>
        <InteractiveParagraph>
          Let's say you believe there's a <strong>50%</strong> chance of High Demand, <strong>30%</strong> chance
          of Medium Demand, and <strong>20%</strong> chance of Low Demand. For Product A:
        </InteractiveParagraph>

        <div className="bg-muted/30 rounded-lg p-4 my-4 border border-border font-mono text-sm">
          <p>EU(Product A) = (0.50 × $200k) + (0.30 × $100k) + (0.20 × −$50k)</p>
          <p className="mt-2">EU(Product A) = $100k + $30k − $10k = <strong>$120k</strong></p>
        </div>

        <InteractiveParagraph>
          This means that <em>on average</em>, if you made this decision many times under similar conditions,
          Product A would yield about $120k. Now let's calculate for all alternatives and find the best one!
        </InteractiveParagraph>
      </Section>

      <Section id="expected-utility-calculator" padding="md" isPreview={isPreview} onEditSection={onEditSection}>
        <Heading level={2}>Interactive Calculator</Heading>
        <InteractiveParagraph>
          Set your probability beliefs: there's a{" "}
          <InlineStepper
            value={highDemand}
            onChange={setHighDemand}
            min={0}
            max={100}
            step={1}
            color="#22c55e"
            bgColor="rgba(34, 197, 94, 0.9)"
            formatValue={(v) => `${v}%`}
          />{" "}
          chance of <strong>High Demand</strong>,{" "}
          <InlineStepper
            value={mediumDemand}
            onChange={setMediumDemand}
            min={0}
            max={100}
            step={1}
            color="#f59e0b"
            bgColor="rgba(245, 158, 11, 0.9)"
            formatValue={(v) => `${v}%`}
          />{" "}
          chance of <strong>Medium Demand</strong>, and{" "}
          <InlineStepper
            value={lowDemand}
            onChange={setLowDemand}
            min={0}
            max={100}
            step={1}
            color="#ef4444"
            bgColor="rgba(239, 68, 68, 0.9)"
            formatValue={(v) => `${v}%`}
          />{" "}
          chance of <strong>Low Demand</strong>. Watch the expected utilities update in real-time!
        </InteractiveParagraph>

        {total !== 100 && (
          <p className="text-sm text-amber-600 mt-2">
            Note: Your probabilities sum to {total}%. They will be normalized to 100% for calculations.
          </p>
        )}

        <div className="mt-6">
          <ExpectedUtilityCalculator probabilities={probabilities} />
        </div>
      </Section>

      <Section id="expected-utility-insight" padding="md" isPreview={isPreview} onEditSection={onEditSection}>
        <Heading level={2}>Key Insights</Heading>
        <InteractiveParagraph>
          Notice something interesting: the optimal choice depends heavily on your probability beliefs!
        </InteractiveParagraph>

        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-primary mb-2">When High Demand is Very Likely</h3>
            <p className="text-sm text-muted-foreground">
              If you're confident the market will be strong (high probability of High Demand),
              Product A becomes attractive despite its downside risk — similar to the Maximax mindset.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-primary mb-2">When Low Demand is Very Likely</h3>
            <p className="text-sm text-muted-foreground">
              If you fear the market will be weak (high probability of Low Demand),
              Product C's guaranteed $80k looks better — similar to the Maximin mindset.
            </p>
          </div>
        </div>

        <InteractiveParagraph className="mt-4">
          In fact, Maximax and Maximin can be seen as <strong>special cases</strong> of Expected Utility:
          Maximax assumes 100% probability on the best state, while Maximin assumes 100% on the worst state.
          Expected Utility gives you a more nuanced approach when you have real probability estimates.
        </InteractiveParagraph>
      </Section>
    </>
  );
};

export default ExpectedUtilitySection;
