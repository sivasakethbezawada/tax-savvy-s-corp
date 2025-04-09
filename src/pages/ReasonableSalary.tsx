
import React from "react";
import { toast } from "@/hooks/use-toast";
import ReasonableSalaryForm, { ReasonableSalaryFormData } from "@/components/forms/ReasonableSalaryForm";

const ReasonableSalary = () => {
  const handleSubmit = (data: ReasonableSalaryFormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Reasonable Salary Updated",
      description: `Your selected salary of $${parseInt(data.selectedSalary).toLocaleString()} has been saved.`,
    });
  };

  const handleChange = (data: Partial<ReasonableSalaryFormData>, isValid: boolean) => {
    console.log("Form changed:", data, "Is valid:", isValid);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Reasonable S Corporation Salary</h1>
      <p className="text-muted-foreground mb-8">
        Use this calculator to determine a reasonable salary for your S Corporation based on industry standards,
        your experience, location, and responsibilities.
      </p>
      
      <ReasonableSalaryForm 
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
      
      <div className="mt-8 p-4 bg-muted/20 rounded-lg border text-sm">
        <h2 className="font-semibold mb-2">Why Reasonable Salary Is Important</h2>
        <p className="mb-2">
          The IRS requires S Corporation owner-employees to take a "reasonable salary" before taking distributions.
          This is because:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Employment taxes (Social Security and Medicare) are paid on salaries but not on distributions</li>
          <li>Setting your salary too low can trigger an IRS audit</li>
          <li>The IRS can reclassify distributions as wages and assess back taxes, penalties, and interest</li>
        </ul>
        <p className="mt-2">
          Document your salary research and rationale to support your reasonable compensation determination.
        </p>
      </div>
    </div>
  );
};

export default ReasonableSalary;
