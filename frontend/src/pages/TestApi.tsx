import { useEffect, useState } from "react";
import { getNextSundayBooking, createNextSundayBooking, type BookingDTO } from "@/lib/api";

const MEMBER_ID = "68a2562808604c0df9f35d9d"; // <-- ton _id user

export default function TestApi() {
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const b = await getNextSundayBooking(MEMBER_ID);
        setBooking(b);
      } catch (e: any) {
        setErr(e?.message || "fetch error");
      }
    })();
  }, []);

  async function book() {
    try {
      const b = await createNextSundayBooking({
        memberId: MEMBER_ID,
        selectedTime: "08:30",
        pickupAddress: "Heathfield",
      });
      setBooking(b);
    } catch (e: any) {
      setErr(e?.message || "create error");
    }
  }

  return (
    <pre style={{ padding: 12, background: "#111", color: "#eee" }}>
      ERR: {err || "-"}{"\n"}
      BOOKING: {JSON.stringify(booking, null, 2)}
      {"\n\n"}
      <button onClick={book}>Book now</button>
    </pre>
  );
}
