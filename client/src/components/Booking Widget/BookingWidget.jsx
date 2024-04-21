/* eslint-disable react/prop-types */
const BookingWidget = ({place}) => {
    return (
      <>
        <div className="bg-white shadow p-4 rounded-2xl">
          <div className="text-2xl text-center">
            Price: {place.price} / per night
          </div>
          <div className="border rounded-2xl mt-4">
            <div className="flex">
              <div className="py-3 px-4">
                <label>Check in:</label>
                <input type="date" />
              </div>
              <div className="py-3 px-4 border-l">
                <label>Check out:</label>
                <input type="date" />
              </div>
            </div>
            <div className="py-3 px-4 border-t">
              <label>Number of guests:</label>
              <input type="number" max={place.maxGuests} min="1" />
            </div>
          </div>
          <button className="primary">Book this place</button>
        </div>
      </>
    );
}

export  default BookingWidget;