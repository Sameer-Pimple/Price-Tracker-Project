import { useEffect, useState } from "react";

const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?";

export default function EncryptedText({
    text,
    interval = 50,
    className,
}) {
    const [outputText, setOutputText] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        let timer;

        if (outputText !== text) {
            timer = setInterval(() => {
                if (outputText.length < text.length) {
                    setOutputText((prev) => prev + text[prev.length]);
                } else {
                    clearInterval(timer);
                }
            }, interval);
        }


        return () => clearInterval(timer);
    }, [text, interval, outputText]);

    const remainder =
        outputText.length < text.length
            ? text
                .slice(outputText.length)
                .split("")
                .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
                .join("")
            : "";

    if (!isMounted) {
        return <span> </span>;
    }

    return (
        <span className={className}>
            {outputText}
            {remainder}
        </span>
    );
}