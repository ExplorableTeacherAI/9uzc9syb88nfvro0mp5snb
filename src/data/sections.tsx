import { type ReactElement } from "react";
import { FullWidthLayout } from "@/components/layouts";
import { IntroductionSection } from "./sections/IntroductionSection";
import { MaximaxSection } from "./sections/MaximaxSection";
import { MaximinSection } from "./sections/MaximinSection";
import { MinimaxRegretSection } from "./sections/MinimaxRegretSection";
import { ComparisonSection } from "./sections/ComparisonSection";

/**
 * ------------------------------------------------------------------
 * SECTION CONFIGURATION
 * ------------------------------------------------------------------
 * Decision Theory: Making Choices Under Uncertainty
 *
 * This lesson covers:
 * 1. Introduction to Decision Theory
 * 2. Maximax Criterion (Optimistic Approach)
 * 3. Maximin Criterion (Pessimistic Approach)
 * 4. Minimax Regret Criterion
 * 5. Comparing the Criteria
 */

export const sections: ReactElement[] = [
    // Section 1: Introduction to Decision Theory
    <FullWidthLayout key="introduction" maxWidth="xl">
        <IntroductionSection />
    </FullWidthLayout>,

    // Section 2: Maximax Criterion
    <FullWidthLayout key="maximax" maxWidth="xl">
        <MaximaxSection />
    </FullWidthLayout>,

    // Section 3: Maximin Criterion
    <FullWidthLayout key="maximin" maxWidth="xl">
        <MaximinSection />
    </FullWidthLayout>,

    // Section 4: Minimax Regret Criterion
    <FullWidthLayout key="minimax-regret" maxWidth="xl">
        <MinimaxRegretSection />
    </FullWidthLayout>,

    // Section 5: Comparing the Criteria
    <FullWidthLayout key="comparison" maxWidth="xl">
        <ComparisonSection />
    </FullWidthLayout>,
];
