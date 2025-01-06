import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { DateRange } from './widget-types';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Building2 } from 'lucide-react';

interface DateRangeWithInterval extends DateRange {
  intervalDates: Date[];
}

export function BookingWidget() {
  const [type, setType] = useState<'Chalet'>('Chalet');
  const [dates, setDates] = useState<DateRangeWithInterval>({
    checkIn: new Date(),
    checkOut: addDays(new Date(), 1),
    intervalDates: [],
  });
  const [rooms, setRooms] = useState(1);
  const [activeCalendar, setActiveCalendar] = useState<'checkIn' | 'checkOut' | null>(null);
  const [isRoomSelectOpen, setIsRoomSelectOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const intervalDates = eachDayOfInterval({
      start: dates.checkIn,
      end: dates.checkOut,
    });

    setDates((prev) => ({
      ...prev,
      intervalDates,
    }));
  }, [dates.checkIn, dates.checkOut]);

  // Add responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (activeCalendar === 'checkIn') {
      setDates((prev) => {
        const newCheckOut =
          selectedDate >= prev.checkOut ? addDays(selectedDate, 1) : prev.checkOut;

        return {
          checkIn: selectedDate,
          checkOut: newCheckOut,
          intervalDates: eachDayOfInterval({
            start: selectedDate,
            end: newCheckOut,
          }),
        };
      });
    } else if (activeCalendar === 'checkOut') {
      setDates((prev) => ({
        ...prev,
        checkOut: selectedDate,
        intervalDates: eachDayOfInterval({
          start: prev.checkIn,
          end: selectedDate,
        }),
      }));
    }
  };

  const handleDone = (popoverType: 'calendar' | 'rooms') => {
    if (popoverType === 'calendar') {
      setActiveCalendar(null);
    } else {
      setIsRoomSelectOpen(false);
    }
  };

  const resetSelection = () => {
    const checkIn = new Date();
    const checkOut = addDays(new Date(), 1);
    setDates({
      checkIn,
      checkOut,
      intervalDates: eachDayOfInterval({ start: checkIn, end: checkOut }),
    });
    setRooms(1);
    setType('Chalet');
  };

  const handleSearch = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      checkIn: dates.checkIn.toISOString(),
      checkOut: dates.checkOut.toISOString(),
      selectedDates: JSON.stringify(dates.intervalDates.map((date) => date.toISOString())),
      rooms: rooms.toString(),
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate(`/admin/reservations/new/search?${searchParams.toString()}`);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-[810px] mx-auto mb-3 bg-white backdrop-blur shadow-xl rounded-xl">
      <Tabs defaultValue="chalet" className="w-full mt-2 max-w-3xl p-2 rounded-none">
        {/* <TabsList className="grid w-full grid-cols-2 bg-transparent h-12">
          <TabsTrigger
            value="chalet"
            className="p-2 transition-all w-32 text-base font-semibold data-[state=active]:bg-[#27534c] data-[state=active]:text-white"
          >
            {type === "Chalet" && <Home className="mr-2 h-4 w-4" />}
            {type}
          </TabsTrigger>
        </TabsList> */}
        <CardHeader>
          <CardTitle className="text-xl text-[#1a3733]">
            Find Available Chalet Before Reserving
          </CardTitle>
        </CardHeader>

        <TabsContent value="chalet">
          <CardContent className="p-1 md:p-1">
            <div className="grid gap-2 md:grid-cols-[1fr,1fr,1fr,1fr]">
              {/* Check-in Date */}
              <Popover
                open={activeCalendar === 'checkIn'}
                onOpenChange={(open) => setActiveCalendar(open ? 'checkIn' : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-12 justify-start transition-all text-sm md:text-base',
                      activeCalendar === 'checkIn' && 'border-[#27534c]',
                    )}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span className="text-sm mt-1 font-medium text-gray-500">Check in</span>
                    <span className="text-base mt-1">{format(dates.checkIn, 'LLL dd, y')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen md:w-auto p-0" align="start" sideOffset={8}>
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={dates.checkIn}
                      onSelect={handleDateSelect}
                      numberOfMonths={isMobile ? 1 : 2}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border-none"
                    />
                    <div className="flex justify-end p-2 border-t">
                      <Button
                        onClick={() => handleDone('calendar')}
                        className="px-8 bg-[#27534c] hover:bg-[#1c3d38]"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Check-out Date */}
              <Popover
                open={activeCalendar === 'checkOut'}
                onOpenChange={(open) => setActiveCalendar(open ? 'checkOut' : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-12 justify-start transition-all text-sm md:text-base',
                      activeCalendar === 'checkOut' && 'border-[#27534c]',
                    )}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span className="text-sm mt-1 font-medium text-gray-500">Check out</span>
                    <span className="text-base mt-1">{format(dates.checkOut, 'LLL dd, y')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen md:w-auto p-0" align="start" sideOffset={8}>
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={dates.checkOut}
                      onSelect={handleDateSelect}
                      numberOfMonths={isMobile ? 1 : 2}
                      disabled={(date) => date <= dates.checkIn}
                      className="rounded-md border-none"
                    />
                    <div className="flex justify-end p-2 border-t">
                      <Button
                        onClick={() => handleDone('calendar')}
                        className="px-8 bg-[#27534c] hover:bg-[#1c3d38]"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Room Selection */}
              <Popover open={isRoomSelectOpen} onOpenChange={setIsRoomSelectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start transition-all text-sm md:text-base"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-4" align="start" sideOffset={8}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Number of Rooms</p>
                        <p className="text-xs text-gray-500">Maximum 5 rooms</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setRooms((prev) => Math.max(1, prev - 1))}
                          disabled={rooms <= 1}
                          className="h-8 w-8"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{rooms}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setRooms((prev) => Math.min(5, prev + 1))}
                          disabled={rooms >= 5}
                          className="h-8 w-8"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        className="text-white bg-orange-500 hover:bg-orange-700 transition-all"
                        onClick={resetSelection}
                      >
                        Reset
                      </Button>
                      <Button
                        className="bg-[#27534c] hover:bg-[#1c3d38]"
                        onClick={() => handleDone('rooms')}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                className="h-12 md:h-12 text-base md:text-base bg-[#27534c] hover:bg-[#1c3d38] font-medium transition-all"
                onClick={handleSearch}
                disabled={loading || !dates.checkIn || !dates.checkOut}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  `Find ${type}s`
                )}
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
