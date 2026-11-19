import { Tooltip, Typography } from "@mui/material";
import { Fragment } from "react";
import dictionary from "../assets/dictionary.json";
import { splitWords } from "../utils/splitWords";

export default function addDictionaryDefs(
  text: string | undefined,
): React.JSX.Element[] {
  if (text === undefined) {
    return [];
  }
  return splitWords(text).map(({ word, key }) => {
    // Remove the comma, we need to keep hyphens though:
    const cleanWord = word.replaceAll(",", "").toLowerCase();

    if (dictionary[cleanWord as keyof typeof dictionary]) {
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        <Tooltip arrow key={key} title={definition}>
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
    return <Fragment key={key}>{`${word} `}</Fragment>;
  });
}
