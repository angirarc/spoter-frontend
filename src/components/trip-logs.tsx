'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { ClockIcon, MapPinIcon, MessageSquareIcon } from 'lucide-react';

import { useTripStore } from '@/store/tripStore';

interface TripLogsProps {
    tripId: number;
}

const TripLogs = ({ tripId }: TripLogsProps) => {
    const { logs, getTripLogs, state } = useTripStore();

    useEffect(() => {
        if (tripId) {
            getTripLogs(tripId);
        }
    }, [tripId, getTripLogs]);

    const isLoading = state.getTripLogs?.status === 'LOADING';

    if (isLoading) {
        return <div className="text-center py-4">Loading logs...</div>;
    }

    if (logs.length === 0) {
        return <div className="text-center py-4">No logs available for this trip.</div>;
    }

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    };

    const formatDrivingTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-4">
            <div className="w-full max-w-3xl mx-auto">
                <div className="-my-4">
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-8 sm:pl-32 py-4 group">
                            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                                <time className="sm:absolute left-0 translate-y-0.5 inline-flex py-0.5 px-1 items-center justify-center text-xs font-semibold uppercase w-20 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-sm">
                                    {formatDate(log.createdOn)}
                                </time>
                                <div className="text-xl font-bold text-slate-900 flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                    {log.current_location}
                                </div>
                            </div>
                            <div className="text-slate-500 mb-2">{log.memo}</div>
                            {/* <div className="flex flex-wrap gap-3 text-sm"> */}
                                <div className="flex items-center text-indigo-500">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    Driving time: {formatDrivingTime(log.driving_time)}
                                </div>
                                {log.rest_breaks.length > 0 && (
                                    <div className="flex items-center text-amber-500">
                                        <MessageSquareIcon className="h-4 w-4 mr-1" />
                                        Rest breaks: {log.rest_breaks.map(b => `${b}m`).join(', ')}
                                    </div>
                                )}
                            {/* </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TripLogs;