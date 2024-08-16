import { useEffect, useState } from "react";
import { TelnyxRTC } from "@telnyx/webrtc";

const TelnyxPhone = () => {
  const [client, setClient] = useState<TelnyxRTC | null>(null);
  const [destination, setDestination] = useState("");
  const [call, setCall] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Initialize TelnyxRTC client
    const rtcClient = new TelnyxRTC({
      login: "gencredOZpTCE3XqNinAi9HnQINeo2dYeftUx15KjOeWUHSxd",
      password: "d8470d1730bc4820ba4f96828b8621c5",
      ringtoneFile: "./sounds/ringback_tone.mp3",
      ringbackFile: "./sounds/ringback_tone.mp3",
    });

    console.log({ rtcClient });

    rtcClient.connect();

    // Event listener for when the client is ready
    rtcClient.on("telnyx.ready", () => {
      console.log("Telnyx client is ready");
      setIsRegistered(true);
    });

    // Event listener for incoming call notifications
    rtcClient.on("telnyx.notification", (notification: any) => {
      if (notification.type === "callUpdate") {
        const incomingCall = notification.call;
        if (incomingCall.state === "ringing") {
          setCall(incomingCall);
        }
      }
    });

    setClient(rtcClient);

    return () => {
      // Clean up: Disconnect and remove event listeners
      rtcClient.disconnect();
    };
  }, []);

  const handleCall = () => {
    if (client) {
      const newCall = client.newCall({
        destinationNumber: destination,
        callerNumber: import.meta.env.VITE_TELNYX_PHONE_NUMBER,
        audio: true,
        video: false,
      });
      setCall(newCall);
    }
  };

  const handleAnswer = () => {
    if (call) {
      call.answer();
    }
  };

  const handleHangup = () => {
    if (call) {
      call.hangup();
    }
  };

  return (
    <div>
      <h2>Telnyx Phone</h2>
      {isRegistered ? (
        <div>
          <input
            type="tel"
            placeholder="Enter destination number"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button onClick={handleCall}>Call</button>
          {call && call.state === "ringing" && (
            <div>
              <p>Incoming call...</p>
              <button onClick={handleAnswer}>Answer</button>
            </div>
          )}
          {call && (
            <button onClick={handleHangup}>
              {call.state !== "destroy" ? "Hangup" : "End Call"}
            </button>
          )}
        </div>
      ) : (
        <p>Connecting...</p>
      )}
      <audio id="remoteMedia" autoPlay />
    </div>
  );
};

export default TelnyxPhone;
