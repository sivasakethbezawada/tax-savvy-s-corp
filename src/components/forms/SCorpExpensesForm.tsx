
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NumericFormat } from "react-number-format";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Define the schema for form validation
const expensesSchema = z.object({
  // Operating Expenses
  rent: z.string().optional(),
  utilities: z.string().optional(),
  insurance: z.string().optional(),
  supplies: z.string().optional(),
  advertising: z.string().optional(),
  maintenance: z.string().optional(),
  
  // Owner Withdrawals
  ownerSalary: z.string().optional(),
  ownerBenefits: z.string().optional(),
  
  // Distributions
  distributions: z.string().optional(),
  
  // Employee Expenses
  employeeSalaries: z.string().optional(),
  employeeBenefits: z.string().optional(),
  payrollTaxes: z.string().optional(),
  
  // Travel Expenses
  travel: z.string().optional(),
  meals: z.string().optional(),
  lodging: z.string().optional(),
  
  // Professional Services
  accounting: z.string().optional(),
  legal: z.string().optional(),
  consulting: z.string().optional(),
  
  // Additional Notes
  notes: z.string().optional(),
});

export type SCorpExpensesFormData = z.infer<typeof expensesSchema>;

export interface SCorpExpensesFormProps {
  onSubmit: (data: SCorpExpensesFormData) => void;
  onChange?: (data: Partial<SCorpExpensesFormData>, isValid: boolean) => void;
  defaultValues?: Partial<SCorpExpensesFormData>;
  className?: string;
}

const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name?: string;
  }
>(({ value, onChange, placeholder, name }, ref) => {
  return (
    <NumericFormat
      name={name}
      getInputRef={ref}
      value={value}
      thousandSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="$"
      placeholder={placeholder || "$0.00"}
      onValueChange={(values) => {
        onChange(values.value);
      }}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
});
CurrencyInput.displayName = "CurrencyInput";

const SCorpExpensesForm: React.FC<SCorpExpensesFormProps> = ({
  onSubmit,
  onChange,
  defaultValues,
  className,
}) => {
  const form = useForm<SCorpExpensesFormData>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      rent: "",
      utilities: "",
      insurance: "",
      supplies: "",
      advertising: "",
      maintenance: "",
      ownerSalary: "",
      ownerBenefits: "",
      distributions: "",
      employeeSalaries: "",
      employeeBenefits: "",
      payrollTaxes: "",
      travel: "",
      meals: "",
      lodging: "",
      accounting: "",
      legal: "",
      consulting: "",
      notes: "",
      ...defaultValues,
    },
  });

  // Call onChange whenever form values change
  React.useEffect(() => {
    if (onChange) {
      const subscription = form.watch((value) => {
        onChange(value, form.formState.isValid);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  return (
    <Card className={`w-full shadow-sm ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">S Corporation Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Operating Expenses Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Operating Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent/Mortgage</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="utilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utilities</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Supplies</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="advertising"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advertising/Marketing</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repairs & Maintenance</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Owner Compensation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Owner Compensation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ownerSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Salary</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Benefits</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Shareholder Distributions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shareholder Distributions</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="distributions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distributions to Shareholders</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Employee Expenses */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Employee Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="employeeSalaries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Salaries</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Benefits</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payrollTaxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payroll Taxes</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Travel Expenses */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Travel Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="travel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transportation</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meals & Entertainment</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lodging"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lodging</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="accounting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accounting</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consulting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consulting</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="$0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Notes</h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about expenses..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SCorpExpensesForm;
