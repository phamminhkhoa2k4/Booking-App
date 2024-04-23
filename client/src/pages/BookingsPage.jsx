import { useEffect, useState } from "react";
import AccountNavigation from "../components/Account Navigation/AccountNavigation";
import axios from "axios";
import PlaceImg from "../components/Place Img/PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../components/Booking Dates/BookingDates";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then(({ data }) => {
      setBookings(data);
    });
  }, []);
  return (
    <div>
      <AccountNavigation />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking, index) => {
            return (
              <Link 
                to={`/account/bookings/${booking._id}`}
                key={index}
                className="flex gap-4 bg-gray-200 rounded-2xl mb-4 overflow-hidden"
              >
                <div className="w-60">
                  <PlaceImg place={booking.place} />
                </div>
                <div className="py-3 pr-3 grow">
                  <h2 className="text-2xl">{booking.place.title}</h2>
                    
                    <BookingDates booking={booking} />
                  
                  <div className="text-xl">
                    <div className="flex gap-1 items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                      Total Price :$ {booking.price}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default BookingsPage;
