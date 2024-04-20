import axios from "axios";
import { useEffect, useState } from "react";
import PhotosUploader from "../components/PhotosUploader/PhotosUploader";
import Perks from "../components/Perks/Perks";
import AccountNavigation from "../components/Account Navigation/AccountNavigation";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const PlacesFormPage = () => {
  const {id} = useParams();
  console.log(id);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    if(!id){
      return;
    }
    axios.get('/places/'+id).then(({data}) => {
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
    }).catch((error) => {
      console.log(error);
    })
  },[id])
  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  const savePlace = async (e) => {
    e.preventDefault();
    if (!title) toast.warn("Please Enter Title !!!");
    else if (!address) toast.warn("Please Enter Address !!!");
    else if (addedPhotos.length == 0) toast.warn("Please Enter or Choose Photos !!!");
    else if (!description) toast.warn("Please Enter Description !!!");
    else if (perks.length == 0) toast.warn("Please Check Perks !!!");
    else if (!extraInfo) toast.warn("Please Enter Extra Information !!!");
    else if (!checkIn) toast.warn("Please Enter Time Check In !!!");
    else if (!checkOut) toast.warn("Please Enter Time Check Out !!!");
    else if (!maxGuests) toast.warn("Please Enter Max Guests !!!");
    else {
       const placesData = {
         title,
         address,
         addedPhotos,
         description,
         perks,
         extraInfo,
         checkIn,
         checkOut,
         maxGuests,
       };
      if(id){
        await axios.put("/places", { id, ...placesData }).then(({ data }) => {
          if (data.statusCode == 0) {
            toast.success(data.msg);
          } else {
            toast.error("Error Server !!!");
          }
          setIsRedirect(true);
        });
      }else{
        await axios
          .post("/places", placesData)
          .then(({ data }) => {
            if (data.statusCode == 0) {
              toast.success(data.msg);
            } else {
              toast.error("Error Server !!!");
            }
            setIsRedirect(true);
          });
      }
      
    }
  };

  if (isRedirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNavigation />
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: My lovely apt"
        />
        {preInput("Address", "Address to this place")}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ex: HCM City"
        />
        {preInput("Photos", "more = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {preInput("Perks", "select all the perks your place")}
        <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra information", "house rule, etc")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className=" grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 mb-1">Check in time</h3>
            <input
              type="number"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="14"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Check out time</h3>
            <input
              type="number"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="11"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>
        <button className="primary my-4 ">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
