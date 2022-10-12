import { Avatar } from "@mui/material";
import styled from "@emotion/styled";
import { deepOrange } from "@mui/material/colors";

export const MessageRow = styled("div")({
    display: "flex"
});

export const MessageRowRight = styled("div")({
    display: "flex"
});

export const MessageBlue = styled("div")({
    position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#A8DDFD",
      width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #97C6E3",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #A8DDFD",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #97C6E3",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px"
      }
});

export const MessageOrange = styled("div")({
    position: "relative",
    marginRight: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f8e896",
    width: "60%",
    //height: "50px",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #dfd087",
    borderRadius: "10px",
    "&:after": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "15px solid #f8e896",
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      top: "0",
      right: "-15px"
    },
    "&:before": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "17px solid #dfd087",
      borderLeft: "16px solid transparent",
      borderRight: "16px solid transparent",
      top: "-1px",
      right: "-17px"
    }
});

export const MessageContent = styled("p")({
    padding: 0,
    margin: 0
});

export const MessageTimeStampRight = styled("div")({
    padding: 0,
    margin: 0
});

export const OrangeAvatar = styled(Avatar)(({ theme }) => {
    const t = theme as any;
    return {
        color: t.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        width: t.spacing(4),
        height: t.spacing(4),
    }
});

export const DisplayName = styled("div")({
    padding: 0,
    margin: 0
});
