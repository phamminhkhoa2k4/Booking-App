import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
/* eslint-disable react/prop-types */
const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [phone, setPhone] = useState("");
  const [redirect,setRedirect] = useState(null);
  const {user} = useContext(UserContext);
  useEffect(() => {
    if(user){
      setName(user.name);
    }
  },[user])
  let numberOfNight = 0;
  if (checkIn && checkOut) {
    numberOfNight = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }
  const Booking = async (e) => {
    e.preventDefault();
    if (!checkIn) toast.warn("Please Choose Time Check In !!!");
    else if (!checkOut) toast.warn("Please Choose Time Check Out !!!");
    else if (!numberOfGuests) toast.warn("Please Enter Number Of Guests !!!");
    else if (!name) toast.warn("Please Enter Name !!!");
    else if (!phone) toast.warn("Please Enter Phone !!!");
    else {
       await axios.post("/booking",{place:place._id,name,phone,checkIn,checkOut,numberOfGuests,price:numberOfNight * place.price}).then(({data}) => {
        if(data.statusCode === 0){
        setRedirect(`/account/bookings/${data.data._id}`);
        toast.success(data.msg);
      }
    }).catch(err => console.log(err))
    }
   
  }
  if(redirect) return <Navigate to={redirect}/>;
  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: {place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4">
              <label>Check in: </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="py-3 px-4 border-l">
              <label>Check out: </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input
              type="number"
              max={place.maxGuests}
              min="1"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
            />
          </div>
          {numberOfNight > 0 && (
            <div className="py-3 px-4 border-t">
              <label>Your full name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Phone number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        </div>
        <button onClick={(e) => Booking(e)} className="primary">
          Book this place{"   "}
          {numberOfNight > 0 && <span>{numberOfNight * place.price}</span>}
        </button>
      </div>
    </>
  );
};

export default BookingWidget;
