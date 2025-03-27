'use client';

import Map from "@/components/map";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


const Home = () => (
    <div className="relative">
        <Map />
        <div className="fixed w-2/7 top-16 right-6">
            <div className="bg-white px-6 py-2 rounded-md mb-2">
                <Accordion className="cursor-pointer" type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Create New Trip</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="pickup">Pickup Location</Label>
                                    <Input id="pickup" type="text" placeholder="Pickup Location" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dropoff">Dropoff Location</Label>
                                    <Input id="dropoff" type="text" placeholder="Dropoff Location" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="cycle">Cycle Used</Label>
                                    <Input id="cycle" type="text" placeholder="Cycle Used" />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full">
                                    Create Trip
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="bg-white px-6 py-2 rounded-md">
                <Accordion className="cursor-pointer" type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Create New Log</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Current Location</Label>
                                    <Input id="location" type="text" placeholder="Current Location" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="memo">Memo</Label>
                                    <Textarea id="memo" placeholder="Type your message here." />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Driving Time</Label>
                                    <Input id="cycle" type="number" placeholder="Driving Time" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="breaks">Rest Breaks</Label>
                                    <Input id="breaks" type="text" placeholder="Rest Breaks" />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full">
                                    Create New Log
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </div>
)

export default Home;