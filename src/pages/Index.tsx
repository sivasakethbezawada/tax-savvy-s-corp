
import React from "react";

const Index: React.FC = () => {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Welcome to S Corp Tax Calculator
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Simplify your S Corporation tax planning with our easy-to-use calculator
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md shadow hover:bg-secondary/90 transition-colors">
              Learn More
            </button>
          </div>
        </section>

        <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-md">
          <div className="flex justify-center items-center h-40">
            <h2 className="text-2xl font-medium">Hello World!</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
