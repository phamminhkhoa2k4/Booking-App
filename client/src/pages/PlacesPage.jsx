import { Link } from "react-router-dom";
import AccountNavigation from "../components/Account Navigation/AccountNavigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [isLoad,setIsLoad] = useState(false);
  useEffect(() => {
    const asyncPlace = async () => {
      await axios
        .get("/user-places")
        .then(({ data }) => {
          setPlaces(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    asyncPlace();
  }, [isLoad]);

    const deletePlace =  async (id) => {
      await axios.delete("/places",{data:{id}}).then((res) => {
        if(res && res.data && res.data.statusCode === 0){
          toast.success(res.data.msg);
          setIsLoad(true);
        }
      })
    }
 
  return (
    <div>
      <AccountNavigation />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place, index) => {
            return (
              <div key={index} className="relative">
                <Link
                  to={"/account/places/" + place._id}
                  className="grid grid-cols-[1fr_5fr]  cursor-pointer gap-4 bg-gray-200 p-4 mb-4 rounded-2xl"
                >
                  <div className="flex w-60 h-32 bg-gray-300 rounded-lg overflow-hidden">
                    {place.photos.length > 0 && (
                      <img
                        className="object-cover w-full"
                        src={"http://localhost:4000/uploads/" + place.photos[0]}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="">
                    <h2 className="text-xl">{place.title}</h2>
                    <p className="text-sm mt-2">{place.description}</p>
                  </div>
                </Link>
                <button onClick={() => deletePlace(place._id)} className="absolute cursor-pointer rounded-2xl bottom-2 right-2 py-2 px-4 bg-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlacesPage;
