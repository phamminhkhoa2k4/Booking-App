import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { id } = useParams;
  return (
    <div className="mt-5">
      <h1>{id}</h1>
    </div>
  );
};

export default BookingPage;
