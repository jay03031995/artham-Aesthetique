import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// This is a route wrapper that opens the booking modal when navigating to /book or /book/:slug
export default function BookingRouteBridge({ onOpenBooking }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    onOpenBooking(slug || null);
    // Route away to home so refresh doesn't keep re-opening it awkwardly
    navigate("/", { replace: true, state: { fromBook: true } });
    // eslint-disable-next-line
  }, [location.pathname]);

  return null;
}
