import { Tooltip, Typography } from "@mui/material";
import dictionary from "../assets/dictionary.json";

export default function addDictionaryDefs(
  text: string,
): (string | React.JSX.Element)[] {
  const words = text.split(" ");
  return words.map((word, index) => {
    // Remove the comma, we need to keep hyphens though:
    const cleanWord = word.replace(/,/g, "").toLowerCase();

    if (dictionary[cleanWord as keyof typeof dictionary]) {
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        <Tooltip arrow key={index} title={definition}>
          <span>
            <Typography
              component="span"
              style={{
                display: "inline",
                color: "darkblue",
                textDecoration: "underline",
                fontSize: "inherit", // Inherit font size
                fontFamily: "inherit", // Inherit font family
              }}
            >
              {word}
            </Typography>
            <Typography
              component="span"
              style={{
                display: "inline",
                fontSize: "inherit", // Inherit font size
                fontFamily: "inherit", // Inherit font family
              }}
            >
              {" "}
            </Typography>
          </span>
        </Tooltip>
      );
    }
    return `${word} `;
  });
}
