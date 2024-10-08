import { useEffect, useState, useContext } from "react";
import { Audio, TelnyxRTCContext, useNotification } from "@telnyx/react-client";

function Phone() {
  const client = useContext(TelnyxRTCContext);
  const notification = useNotification();
  const [destination, setDestination] = useState("");
  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      const call = client?.newCall({
        destinationNumber: destination,
        callerName: import.meta.env.VITE_TELNYX_PHONE_NUMBER || "",
        callerNumber: import.meta.env.VITE_TELNYX_PHONE_NUMBER || "",
        audio: true,
        video: false,
      });

      console.log("newCall: ", call);
    } catch (err) {
      console.error(err);
    }
  };

  const call = notification?.call;
  const callState = call?.state;

  useEffect(() => {
    console.log("phone callState:", callState);
  }, [callState]);

  useEffect(() => {
    console.log("notification------------: ", notification);
  }, [notification]);

  return (
    <div>
      <strong>Voice call</strong>
      <form onSubmit={handleSubmit}>
        <input
          name="destination_phone_number"
          type="tel"
          placeholder="1-555-123-4567"
          value={destination}
          onChange={(e: any) => setDestination(e.target.value)}
        />

        {call && call.state === "ringing" ? (
          <button type="button" onClick={() => call.answer()}>
            Answer
          </button>
        ) : (
          <button type="submit">Call</button>
        )}

        {call && call.state !== "destroy" && (
          <button type="button" onClick={() => call.hangup()}>
            Hangup
          </button>
        )}
      </form>

      <Audio stream={call?.remoteStream} />
    </div>
  );
}

export default Phone;
