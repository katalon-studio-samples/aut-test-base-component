// Create an end-to-end flow to cover all html tags as below
// Input - button	<input type="button">
// Input - checkbox	<input type="checkbox">
import React, { useState, useId } from "react";
import styles from "./Input.module.css";

export const CheckBoxPage: React.FC = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [isUnchecked, setIsUnchecked] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [result, setResult] = useState("");
  const id = useId();

  const handleButtonClick = () => {
    setResult(
      `Receive newsletter: ${isChecked ? "Yes" : "No"}\n` +
        `Enable notifications: ${isUnchecked ? "Yes" : "No"}\n` +
        `Accept terms and conditions: ${isAccepted ? "Yes" : "No"}`,
    );
  };

  return (
    <div className={styles.container} id={`${id}-container`}>
      <h2 className={styles.h2} id={`${id}-title`}>
        Preferences
      </h2>
      <br />
      <div className={styles.inputGroup} id={`${id}-newsletter-group`}>
        <label htmlFor={`${id}-newsletter`}>
          <input
            id={`${id}-newsletter`}
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          Receive newsletter
        </label>
      </div>
      <div className={styles.inputGroup} id={`${id}-notifications-group`}>
        <label htmlFor={`${id}-notifications`}>
          <input
            id={`${id}-notifications`}
            type="checkbox"
            checked={isUnchecked}
            onChange={() => setIsUnchecked(!isUnchecked)}
          />
          Enable notifications
        </label>
      </div>
      <div className={styles.inputGroup} id={`${id}-accept-group`}>
        <label htmlFor={`${id}-accept`}>
          <input
            id={`${id}-accept`}
            type="checkbox"
            checked={isAccepted}
            onChange={() => setIsAccepted(!isAccepted)}
          />
          Accept terms and conditions
        </label>
      </div>
      <div className={styles.inputGroup} id={`${id}-button-group`}>
        <input
          id={`${id}-show-selection`}
          type="button"
          value="Show Selection"
          onClick={handleButtonClick}
        />
      </div>
      {result && (
        <div className={styles.result} id={`${id}-result`}>
          {result}
        </div>
      )}
    </div>
  );
};
