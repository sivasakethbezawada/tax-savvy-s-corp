import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DollarSign } from "lucide-react";

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

// Form schema definition with validation rules
const incomeSchema = z.object({
  // Personal Income Fields
  w2Wages: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),
  interestIncome: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),
  dividendIncome: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),
  otherIncome: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),

  // S Corporation Income Fields
  businessRevenue: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),
  passThroughIncome: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),
  distributions: z.string().refine(
    (val) => {
      return /^-?\d*\.?\d{0,2}$/.test(val) || val === "";
    },
    { message: "Please enter a valid currency amount" }
  ),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

export interface IncomeFormProps {
  onSubmit: (data: IncomeFormData) => void;
  onChange?: (data: Partial<IncomeFormData>, isValid: boolean) => void;
  defaultValues?: Partial<IncomeFormData>;
  className?: string;
}

const IncomeForm: React.FC<IncomeFormProps> = ({
  onSubmit,
  onChange,
  defaultValues,
  className,
}) => {
  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      w2Wages: "",
      interestIncome: "",
      dividendIncome: "",
      otherIncome: "",
      businessRevenue: "",
      passThroughIncome: "",
      distributions: "",
      ...defaultValues,
    },
  });

  // If onChange prop is provided, call it when form values change
  React.useEffect(() => {
    if (onChange) {
      const subscription = form.watch((value) => {
        onChange(value, form.formState.isValid);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  const handleFormSubmit = (data: IncomeFormData) => {
    onSubmit(data);
  };

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters except decimal point and minus sign
    value = value.replace(/[^0-9.-]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts.length > 1 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return value;
  };

  return (
    <Card className={`w-full shadow-sm ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Income Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Personal Income Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Personal Income</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* W-2 Wages */}
                <FormField
                  control={form.control}
                  name="w2Wages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>W-2 Wages</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interest Income */}
                <FormField
                  control={form.control}
                  name="interestIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dividend Income */}
                <FormField
                  control={form.control}
                  name="dividendIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dividend Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Other Income */}
                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* S Corporation Income Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">S Corporation Income</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Revenue */}
                <FormField
                  control={form.control}
                  name="businessRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Revenue</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pass-Through Income */}
                <FormField
                  control={form.control}
                  name="passThroughIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass-Through Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Distributions */}
                <FormField
                  control={form.control}
                  name="distributions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distributions Received</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-9"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCurrency(e));
                            }} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IncomeForm;
