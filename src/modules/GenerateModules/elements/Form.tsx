import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
    element: z.string().min(1, { message: "Element is required" }),
    rarity: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    evolvement: z.number().int().min(0).max(2, { message: "Evolvement must be between 0 and 2" }),
    holdable: z.boolean(),
    wearable: z.boolean(),
    detail: z.boolean(),
    password: z.string().min(1, { message: "Password is required" }),
});

const rarityOptions = [
    { label: "Common", value: 0 },
    { label: "Rare", value: 1 },
    { label: "Legendary", value: 2 },
];

const evolvementOptions = [
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
];
interface PokemonFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}
const PokemonForm: React.FC<PokemonFormProps> = ({ onSubmit }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            element: "",
            rarity: undefined,
            evolvement: undefined,
            holdable: false,
            wearable: false,
            detail: false,
        },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Description
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                            <Info className="w-4 h-4 ml-2" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Brief description of the Pokemon</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="element"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Element
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                            <Info className="w-4 h-4 ml-2" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>The elemental type of the Pokemon</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select element" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="fire">Fire</SelectItem>
                                    <SelectItem value="water">Water</SelectItem>
                                    <SelectItem value="neutral">Neutral</SelectItem>
                                    <SelectItem value="grass">Grass</SelectItem>
                                    <SelectItem value="electric">Electric</SelectItem>
                                    <SelectItem value="psychic">Psychic</SelectItem>
                                    <SelectItem value="fighting">Fighting</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rarity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Rarity
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                            <Info className="w-4 h-4 ml-2" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>How rare the Pokemon is</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value !== undefined ? field.value.toString() : ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rarity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rarityOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="evolvement"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Evolvement
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                            <Info className="w-4 h-4 ml-2" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Evolvement Stage of The Pokemon</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value !== undefined ? field.value.toString() : ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select evolvement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {evolvementOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex space-x-4">
                    <FormField
                        control={form.control}
                        name="holdable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center">
                                        Holdable
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                                    <Info className="w-4 h-4 ml-2" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Is the Pokémon holding something? This option will generate a random object to be held by the Pokémon</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="wearable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row  items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center">
                                        Wearable
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                                    <Info className="w-4 h-4 ml-2" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Is the Pokémon wearing something? This option will generate a random item to be worn by the Pokémon</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="detail"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="flex items-center">
                                    Detail
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                                <Info className="w-4 h-4 ml-2" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Does the Pokémon have additional details? This will generate additional details for the Pokémon</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Password
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                            <Info className="w-4 h-4 ml-2" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Contact me for the password at danisrahman3105@gmail.com</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='w-[30%]'>Generate</Button>
            </form>
        </Form>
    );
};

export default PokemonForm;