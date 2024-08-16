import { TelnyxRTC } from "@telnyx/webrtc";
import React, { useEffect, useState } from "react";
const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [outgoingCall, setOutgoingCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  useEffect(() => {
    const client = new TelnyxRTC({
      /* Use a JWT to authenticate (recommended) */
      login_token: import.meta.env.VITE_TELNYX_LOGIN_TOKEN,
      /* or use your Connection credentials */
      // login: username,
      // password: password,
    });

    client.connect();
    setClient(client);
    // Attach event listeners
    client
      .on("telnyx.ready", () => console.log("ready to call"))
      .on("telnyx.error", () => console.log("error"))
      // Events are fired on both session and call updates
      // ex: when the session has been established
      // ex: when there's an incoming call
      .on("telnyx.notification", (notification: any) => {
        const call = notification.call;
        setIncomingCall(call);
        if (notification.type === "callUpdate" && call?.state === "ringing") {
          call.answer();

          // activeCall = notification.call;
        }
      });
    client.remoteElement = "remoteMedia";

    return () => {
      // Disconnecting and Removing listeners.
      client.disconnect();
      client.off("telnyx.ready");
      client.off("telnyx.notification");
    };
  }, []);

  const handleMakeCall = (phoneNumber: string) => {
    const call = client.newCall({
      // Destination is required and can be a phone number or SIP URI
      destinationNumber: phoneNumber,
      callerNumber: import.meta.env.VITE_TELNYX_PHONE_NUMBER,
      audio: true,
      debug: true, // Default is false,
      debugOutput: "socket", // Possible values are 'socket' | 'file'
    });
    console.log("Call is making...");
    setOutgoingCall(call);
  };
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="917818000000"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhoneNumber(e.target.value)
          }
        />
        <button onClick={() => handleMakeCall(phoneNumber)}>Call</button>
      </div>

      {incomingCall && (
        <div>
          <button>Accept</button>
          <button>Reject</button>
        </div>
      )}
      <audio id="remoteMedia" autoPlay={true} />
    </div>
  );
};

export default Phone;
