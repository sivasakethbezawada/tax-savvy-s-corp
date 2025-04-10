
import React from "react";
import TaxWizard from "@/components/wizard/TaxWizard";

const Index: React.FC = () => {
  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            S Corp Tax Calculator
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Simplify your S Corporation tax planning with our easy-to-use calculator
          </p>
        </section>

        <TaxWizard />
      </div>
    </div>
  );
};

export default Index;
