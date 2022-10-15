import { formatDate } from "server/utils/dates";
import { MessageProps } from "./Message.types";
import { DisplayName, MessageBlue, MessageContent, MessageRow, MessageTimeStampRight, OrangeAvatar } from "./MessageStyles";

export const MessageLeft = (props: MessageProps) => {
    const formatedDate = formatDate(props.timestamp);
    return (
        <MessageRow>
            <OrangeAvatar
                alt={props.displayName}
                src={props.photoURL}
            ></OrangeAvatar>
            <div>
                <DisplayName>{props.displayName}</DisplayName>
                <MessageBlue>
                    <div>
                        <MessageContent>{props.message}</MessageContent>
                    </div>
                    <MessageTimeStampRight>{formatedDate}</MessageTimeStampRight>
                </MessageBlue>
            </div>
        </MessageRow >
    );
};