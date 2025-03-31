'use client';

import { useTripStore } from "@/store/tripStore";

import Map from "@/components/map";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import TripLogs from "@/components/trip-logs";
import TripForm from "@/components/trip-form";
import TripDetails from "@/components/trip-details";

const Home = () => {
    const { selectedTrip } = useTripStore();
    return (
        <div className="relative">
            <Map />
            <div className="fixed flex flex-col items-end top-16 right-6">
                <div className="bg-white xs:w-[300px] sm:w-[400px] md:w-[500px] lg:w-[500px] w-[500px] px-6 py-2 rounded-md mb-2">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="cursor-pointer">{selectedTrip ? 'Trip Details' : 'Create New Trip'}</AccordionTrigger>
                            <AccordionContent>
                                {
                                    selectedTrip ? <TripDetails trip={selectedTrip} />
                                    : <TripForm />
                                }
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                {
                    selectedTrip && (
                        <>
                            <div className="bg-white xs:w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] w-[600px] px-6 py-2 rounded-md mt-2">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="cursor-pointer">Trip Logs</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="max-h-96 overflow-y-scroll">
                                                <TripLogs tripId={selectedTrip.id} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Home;