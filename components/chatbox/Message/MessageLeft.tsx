import { formatDate } from "server/utils/dates";
import { MessageProps } from "./Message.types";
import { MessageContent, MessageOrange, MessageRowRight, MessageTimeStampRight } from "./MessageStyles";

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