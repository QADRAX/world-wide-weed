import { Avatar, Stack } from "@mui/material";
import styled from "@emotion/styled";
import { deepOrange } from "@mui/material/colors";
import { formatDate } from "../../../../utils/Dates";
import { CardRequestSnapshot } from "../../../../types/WeedTypes";
import { CardRequestInfo } from "../../Shared/CardRequestInfo";
import { useAppSelector } from "../../../hooks/redux";

export const MessageRow = styled("div")({
    display: "flex"
});

export const MessageRowRight = styled("div")({
    display: "flex",
    flexDirection: "row-reverse"
});

export const MessageBlue = styled("div")({
    position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#A8DDFD",
      width: "60%",
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

export const MessageInfo = styled("div")({
    width: "60%",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor:'#f3f3f3',
    textAlign: 'center',
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #fde4e4",
});

export const MessageContent = styled("p")({
    padding: 0,
    margin: 0
});

export const MessageTimeStampRight = styled("div")({
    padding: 0,
    paddingTop: "5px",
    margin: 0,
    fontSize: "0.7em",
});

export const OrangeAvatar = styled(Avatar)(({ theme }) => {
    const t = theme as any;
    return {
        color: t.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        width: t.spacing(4),
        height: t.spacing(4),
        marginLeft: '0.5rem',
    }
});

export const DisplayName = styled("div")({
    padding: 0,
    margin: 0
});

export type MessageProps = {
    message: string;
    timestamp: number;
    photoURL?: string;
    displayName: string;
}

export const MessageLeft = (props: MessageProps) => {
    const formatedDate = formatDate(props.timestamp);
    return (
        <MessageRow>
            <OrangeAvatar
                alt={props.displayName}
                src={props.photoURL}
            ></OrangeAvatar>
            <Stack direction='column' sx={{ flex: 1, pl: 1 }}>
                <DisplayName>{props.displayName}</DisplayName>
                <MessageBlue>
                    <div>
                        <MessageContent>{props.message}</MessageContent>
                    </div>
                    <MessageTimeStampRight>{formatedDate}</MessageTimeStampRight>
                </MessageBlue>
            </Stack>
        </MessageRow >
    );
};

export const MessageRight = (props: MessageProps) => {
    const formatedDate = formatDate(props.timestamp);

    return (
      <MessageRowRight>
        <MessageOrange>
          <MessageContent>{props.message}</MessageContent>
          <MessageTimeStampRight>{formatedDate}</MessageTimeStampRight>
        </MessageOrange>
      </MessageRowRight>
    );
  };

export const MessageCenter = (props: CardRequestSnapshot) => {
    const matchPlayers = useAppSelector((state) => state.match.players);
    const formatedDate = formatDate(props.date);

    return (
      <MessageRow>
        <MessageInfo>
          <MessageContent>
            <CardRequestInfo cardRequest={props.request} players={matchPlayers} />
          </MessageContent>
          <MessageTimeStampRight>{formatedDate}</MessageTimeStampRight>
        </MessageInfo>
      </MessageRow>
    );
  };