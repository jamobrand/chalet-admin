import { Helmet } from 'react-helmet-async';
import { BookingWidget } from './booking-widget';

const NewReservation = () => {
 
  return (
    <div className="p-6">
      <Helmet>
        <title>New Reservation - GRVL</title>
      </Helmet>

      <BookingWidget />
    </div>
  );
};

export default NewReservation;
