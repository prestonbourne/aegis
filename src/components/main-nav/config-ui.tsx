"use client";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Chip } from "@/components/chip";
import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { prettyPercent } from "@/lib/number-utils";
import { useState, useEffect } from "react";
import { useMockData } from "@/app-context";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  MIN_USERS,
  MIN_MALICIOUS_PROMPT_RATE,
  MIN_PROMPTS,
  MAX_MALICIOUS_PROMPT_RATE,
  MAX_PROMPTS,
  MAX_USERS,
  DEFAULT_CONFIG,
} from "@/data";

const configFormSchema = z.object({
  userCount: z.number().min(MIN_USERS).max(MAX_USERS),
  promptCount: z.number().min(MIN_PROMPTS).max(MAX_PROMPTS),
  maliciousPromptRate: z
    .number()
    .min(MIN_MALICIOUS_PROMPT_RATE)
    .max(MAX_MALICIOUS_PROMPT_RATE),
});

export function Configuration() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { setDataConfig, config } = useMockData();

  const form = useForm<z.infer<typeof configFormSchema>>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      userCount: DEFAULT_CONFIG.userCount,
      promptCount: DEFAULT_CONFIG.promptCount,
      maliciousPromptRate: DEFAULT_CONFIG.maliciousPromptRate,
    },
  });

  function onSubmit(values: z.infer<typeof configFormSchema>) {
    const newConfig = {
      ...config,
      ...values,
    };
    setDataConfig(newConfig);
    setDialogIsOpen(false);
  }

  return (
    <Dialog modal open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger>
        <Chip
          level={"paper"}
          className="inline-flex gap-2 items-center text-muted transition-colors hover:text-primary"
          rounded={false}
          textSize={"normal"}
        >
          <GearIcon /> Configuration
        </Chip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-2xl">Aegis</DialogTitle>
          <DialogDescription>
            Built at Cornell Tech under the advisory of my professors and staff
            at Microsoft Azure. <a href="">See More</a>.
          </DialogDescription>
          <DialogDescription>
            Due to IP restrictions, the data you see is mocked at runtime and
            not representative of any actual LLM usage. This configuration panel
            allows you to input parameters for the models that generate and
            classify the demo data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border-b pt-2 pb-4 mb-4 space-y-6">
              <FormField
                control={form.control}
                name="userCount"
                render={({ field: { value, onChange } }) => (
                  <FormItem className="w-8/12">
                    <FormLabel>Users: {value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={MIN_USERS}
                        max={MAX_USERS}
                        step={1}
                        defaultValue={[value]}
                        onValueChange={(e) => {
                          onChange({
                            target: { value: e[0] },
                          });
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of active users on the LLM
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="promptCount"
                render={({ field: { value, onChange } }) => {
                  return (
                    <FormItem className="w-8/12">
                      <FormLabel>Prompts: {value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={MIN_USERS}
                          max={MAX_USERS}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(e) => {
                            onChange({
                              target: { value: e[0] },
                            });
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Amount of prompts that are generated by your users,
                        randomly distributed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="maliciousPromptRate"
                render={({ field: { value, onChange } }) => (
                  <FormItem className="w-8/12">
                    <FormLabel>
                      Malicious Prompt Rate: {prettyPercent(value * 100)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={MIN_MALICIOUS_PROMPT_RATE}
                        max={MAX_MALICIOUS_PROMPT_RATE}
                        step={0.01}
                        defaultValue={[value]}
                        onValueChange={(e) => {
                          onChange({
                            target: { value: e[0] },
                          });
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Approximately what percentage of prompts are malicious
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="float-right flex items-center gap-4">
              {/* <Label>Don&apos;t show this dialog again</Label>
              <Switch
                checked={localStorage.getItem(dontShowKey) === "true"}
                onCheckedChange={handleDontShowChange}
              /> */}
              <Button type="submit">Load</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
