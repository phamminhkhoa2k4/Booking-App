import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../components/Booking Widget/BookingWidget";
import PlaceGallery from "../components/Place Gallery/PlaceGalllery";
import AddressLink from "../components/Address Link/AddressLink";

const PlacePage = () => {
  const [place, setPlace] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/place/" + id).then(({ data }) => {
      setPlace(data);
    });
  }, [id]);

  if (!place) return "";

  
  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl font-bold">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place}/>
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            <p>{place.description}</p>
          </div>
          Check-in: {place.checkIn}
          <br />
          Check-out: {place.checkOut}
          <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Information</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-500 leading-5">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
