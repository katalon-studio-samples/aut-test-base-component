// Create an end-to-end flow to cover all html tags as below
// Input - text <input type="text">
import React, { useState, useRef, useId } from 'react';
import styles from './Input.module.css';

export const TextPage: React.FC = () => {
    const [mandatory, setMandatory] = useState('');
    const [optional, setOptional] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const uncontrolledRef = useRef<HTMLInputElement>(null);
    const hiddenRef = useRef<HTMLInputElement>(null);
    const id = useId();

    const handleButtonClick = () => {
        if (!mandatory.trim()) {
            setError('Mandatory field is required.');
            setResult('');
            return;
        }
        setError('');
        setResult(
            `Mandatory: ${mandatory}\nOptional: ${optional || '(empty)'}\nHidden: ${hiddenRef.current?.value || '(empty)'}\nUncontrolled: ${uncontrolledRef.current?.value || '(empty)'}`
        );
    };

    return (
        <div className={styles.container} id={`${id}-container`}>
            <h2 className={styles.h2} id={`${id}-title`}>Text Input Example</h2>
            <br/>
            <div className={styles.inputGroup} id={`${id}-mandatory-group`}>
                <label htmlFor={`${id}-mandatory`}>
                    Mandatory field:
                    <input
                        id={`${id}-mandatory`}
                        type="text"
                        value={mandatory}
                        onChange={e => setMandatory(e.target.value)}
                        className={styles.textInput}
                        placeholder="Require this field"
                        required
                    />
                </label>
            </div>
            <div className={styles.inputGroup} id={`${id}-optional-group`}>
                <label htmlFor={`${id}-optional`}>
                    Optional field:
                    <input
                        id={`${id}-optional`}
                        type="text"
                        value={optional}
                        onChange={e => setOptional(e.target.value)}
                        className={styles.textInput}
                        placeholder="Optional field"
                    />
                </label>
            </div>
            <div className={styles.inputGroup} id={`${id}-hidden-group`}>
                <label htmlFor={`${id}-hidden`}>
                    Hidden value field:
                    <input
                        id={`${id}-hidden`}
                        type="text"
                        className={styles.textInput}
                        style={{ WebkitTextSecurity: 'disc' }}
                        autoComplete="off"
                        placeholder="Hidden value"
                        ref={hiddenRef}
                    />
                </label>
            </div>
            <div className={styles.inputGroup} id={`${id}-uncontrolled-group`}>
                <label htmlFor={`${id}-uncontrolled`}>
                    Uncontrolled field (no value attribute):
                    <input
                        id={`${id}-uncontrolled`}
                        type="text"
                        ref={uncontrolledRef}
                        className={styles.textInput}
                        placeholder="Uncontrolled input"
                    />
                </label>
            </div>
            <div className={styles.inputGroup} id={`${id}-button-group`}>
                <input
                    id={`${id}-show-text`}
                    type="button"
                    value="Show Text"
                    onClick={handleButtonClick}
                />
            </div>
            {error && (
                <div className={styles.error} id={`${id}-error`} style={{ color: 'red' }}>
                    {error}
                </div>
            )}
            {result && (
                <div className={styles.result} id={`${id}-result`}>
                    {result}
                </div>
            )}
        </div>
    );
};