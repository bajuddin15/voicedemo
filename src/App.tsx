import { useState } from "react";
import { TelnyxRTCProvider } from "@telnyx/react-client";
import ClientStatus from "./ClientStatus";
import CallLog from "./CallLog";
import Phone from "./Phone";
import VideoCall from "./VideoCall";

const App = () => {
  const [credential, setCredential] = useState({
    // Create a .env file with REACT_APP_TELNYX_LOGIN_TOKEN
    // set to your On-Demand Credential Token to try this out
    // https://developers.telnyx.com/docs/v2/webrtc/quickstart
    login_token: import.meta.env.VITE_TELNYX_LOGIN_TOKEN || "mytoken",
  });
  const [loginTokenValue, setLoginTokenValue] = useState(
    credential.login_token
  );
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setCredential({ login_token: loginTokenValue });
  };
  const options = {
    ringtoneFile: "./sounds/ringback_tone.mp3",
    ringbackFile: "./sounds/ringback_tone.mp3",
  };

  return (
    <div style={{ padding: 20 }}>
      <TelnyxRTCProvider
        credential={{
          login: "gencredOZpTCE3XqNinAi9HnQINeo2dYeftUx15KjOeWUHSxd",
          password: "d8470d1730bc4820ba4f96828b8621c5",
        }}
        options={options}
      >
        <form onSubmit={handleSubmit}>
          <label>
            Login token:
            <input
              name="telnyx_login_token"
              type="password"
              value={loginTokenValue}
              onChange={(e) => setLoginTokenValue(e.target.value)}
            />
          </label>
          <button type="submit">Update token</button>
        </form>

        <ClientStatus />
        <CallLog />

        <div>
          <label>
            <input
              type="checkbox"
              checked={isAudioOnly}
              onChange={(e) => setIsAudioOnly(e.target.checked)}
            />
            Audio-only call
          </label>

          {isAudioOnly ? <Phone /> : <VideoCall />}
        </div>
      </TelnyxRTCProvider>
    </div>
  );
};

export default App;
